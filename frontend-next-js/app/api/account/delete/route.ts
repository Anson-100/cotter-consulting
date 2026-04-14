// /api/account/delete/route.ts
// Secure account deletion endpoint
// Order: Cancel Stripe sub → Delete profile → Delete organization → Delete auth user

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Admin client for deleting auth user (requires service role key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()

    // Create authenticated Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // =========================================
    // 1. VERIFY USER IS AUTHENTICATED
    // =========================================
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`[Account Delete] Starting deletion for user: ${user.id}`)

    // =========================================
    // 2. GET USER'S PROFILE AND ORGANIZATION
    // =========================================
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, organization_id, plan_id")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 = no rows returned (user might not have completed onboarding)
      console.error("[Account Delete] Profile fetch error:", profileError)
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      )
    }

    let stripeCustomerId: string | null = null

    // Get organization if profile exists
    if (profile?.organization_id) {
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .select("id, stripe_customer_id")
        .eq("id", profile.organization_id)
        .single()

      if (orgError && orgError.code !== "PGRST116") {
        console.error("[Account Delete] Organization fetch error:", orgError)
        return NextResponse.json(
          { error: "Failed to fetch organization" },
          { status: 500 }
        )
      }

      stripeCustomerId = org?.stripe_customer_id ?? null
    }

    // =========================================
    // 3. CANCEL STRIPE SUBSCRIPTION (if exists)
    // =========================================
    if (stripeCustomerId) {
      try {
        console.log(
          `[Account Delete] Cancelling subscriptions for Stripe customer: ${stripeCustomerId}`
        )

        // List all active subscriptions for this customer
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: "active",
        })

        // Cancel each active subscription immediately
        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id, {
            prorate: false, // No prorated refund on deletion
          })
          console.log(
            `[Account Delete] Cancelled subscription: ${subscription.id}`
          )
        }

        // Also check for trialing/past_due subscriptions
        const otherSubs = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: "all",
        })

        for (const subscription of otherSubs.data) {
          if (
            ["trialing", "past_due", "unpaid"].includes(subscription.status)
          ) {
            await stripe.subscriptions.cancel(subscription.id)
            console.log(
              `[Account Delete] Cancelled ${subscription.status} subscription: ${subscription.id}`
            )
          }
        }

        // Add metadata to mark customer as deleted (keeps audit trail)
        await stripe.customers.update(stripeCustomerId, {
          metadata: {
            deleted_at: new Date().toISOString(),
            deleted_user_id: user.id,
            deletion_reason: "user_requested",
          },
        })

        console.log(`[Account Delete] Updated Stripe customer metadata`)
      } catch (stripeError) {
        console.error("[Account Delete] Stripe error:", stripeError)
        // Continue with deletion even if Stripe fails
        // Log for manual cleanup if needed
      }
    }

    // =========================================
    // 4. DELETE PROFILE (Supabase)
    // =========================================
    if (profile) {
      const { error: deleteProfileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id)

      if (deleteProfileError) {
        console.error(
          "[Account Delete] Profile delete error:",
          deleteProfileError
        )
        return NextResponse.json(
          { error: "Failed to delete profile" },
          { status: 500 }
        )
      }
      console.log(`[Account Delete] Deleted profile`)
    }

    // =========================================
    // 5. DELETE ORGANIZATION (cascades to related records)
    // =========================================
    // Note: Ensure your Supabase FK constraints use ON DELETE CASCADE for:
    // - bids (organization_id)
    // - contacts (organization_id)
    // - Any other org-related tables
    if (profile?.organization_id) {
      const { error: deleteOrgError } = await supabase
        .from("organizations")
        .delete()
        .eq("id", profile.organization_id)

      if (deleteOrgError) {
        console.error(
          "[Account Delete] Organization delete error:",
          deleteOrgError
        )
        return NextResponse.json(
          { error: "Failed to delete organization" },
          { status: 500 }
        )
      }
      console.log(`[Account Delete] Deleted organization and cascaded records`)
    }

    // =========================================
    // 6. DELETE AUTH USER (requires admin/service role)
    // =========================================
    const { error: deleteAuthError } =
      await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteAuthError) {
      console.error("[Account Delete] Auth user delete error:", deleteAuthError)
      return NextResponse.json(
        { error: "Failed to delete authentication record" },
        { status: 500 }
      )
    }
    console.log(`[Account Delete] Deleted auth user`)

    // =========================================
    // 7. SIGN OUT (clear session cookies)
    // =========================================
    await supabase.auth.signOut()

    console.log(
      `[Account Delete] Account deletion complete for user: ${user.id}`
    )

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (err) {
    console.error("[Account Delete] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
