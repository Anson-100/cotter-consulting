// app/api/stripe/change-plan/route.ts

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Stripe from "stripe"
import { getStripePriceId } from "@/data/stripePrices"
import { getAllPlanIds } from "@/data/planUtils"
import { z } from "zod"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Dynamically create validation schema from existing data
const changePlanSchema = z.object({
  newPlanId: z.enum(getAllPlanIds() as [string, ...string[]], {
    message: "Invalid plan selected",
  }),
})

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
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

    // 1. Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Validate request
    const body = await req.json()
    const validation = changePlanSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid plan" },
        { status: 400 }
      )
    }

    const { newPlanId } = validation.data

    // 3. Get user's profile and current plan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("organization_id, plan_id")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.organization_id) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Check if already on this plan
    if (profile.plan_id === newPlanId) {
      return NextResponse.json(
        { error: "Already on this plan" },
        { status: 400 }
      )
    }

    // 4. Get organization's Stripe customer ID
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("stripe_customer_id")
      .eq("id", profile.organization_id)
      .single()

    if (orgError || !org?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Stripe customer not found" },
        { status: 404 }
      )
    }

    // 5. Get the new price ID
    const newPriceId = getStripePriceId(newPlanId)
    if (!newPriceId) {
      return NextResponse.json(
        { error: "Invalid plan configuration" },
        { status: 500 }
      )
    }

    // 6. Find active subscription in Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: org.stripe_customer_id,
      status: "active",
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    const subscription = subscriptions.data[0]
    const subscriptionItemId = subscription.items.data[0].id

    // 7. Update the subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        items: [
          {
            id: subscriptionItemId,
            price: newPriceId,
          },
        ],
        proration_behavior: "create_prorations",
      }
    )

    if (updatedSubscription.status !== "active") {
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      )
    }

    // 8. Update plan_id in Supabase profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ plan_id: newPlanId })
      .eq("id", user.id)

    if (updateError) {
      console.error("Failed to update profile plan_id:", updateError)
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Plan changed successfully",
      newPlan: newPlanId,
    })
  } catch (error) {
    console.error("Change plan error:", error)
    return NextResponse.json(
      { error: "Failed to change plan" },
      { status: 500 }
    )
  }
}
