// /api/stripe/finalize/route.ts

// This route finalizes the signup process:
// 1. Validates all input data with Zod
// 2. Creates/updates Stripe customer
// 3. Creates subscription (unless deferred)
// 4. Creates organization and profile in Supabase

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Stripe from "stripe"
import { getStripePriceId } from "@/data/stripePrices"
import { finalizeSchema } from "@/lib/validations/finalize"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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

    // 1. Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse and validate request body with Zod
    const body = await req.json()
    const validation = finalizeSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      console.error("Validation failed:", validation.error.issues)
      return NextResponse.json(
        { error: firstError?.message || "Invalid request data" },
        { status: 400 }
      )
    }

    // Now we have validated, typed data
    const { plan, profile, billing, paymentMethodId, stripeCustomerId } =
      validation.data

    const isDeferred = plan === "deferred"

    // 3. Get or create Stripe customer (always - we need this for deferred too)
    let customerId = stripeCustomerId ?? null
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: `${profile.firstName} ${profile.lastName}`,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
        address: {
          line1: billing.streetAddress,
          city: billing.city,
          state: billing.region,
          postal_code: billing.postalCode,
          country: billing.country,
        },
      })
      customerId = customer.id
    } else {
      // Attach payment method
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      })

      // Update customer details
      await stripe.customers.update(customerId, {
        email: profile.email,
        name: `${profile.firstName} ${profile.lastName}`,
        address: {
          line1: billing.streetAddress,
          city: billing.city,
          state: billing.region,
          postal_code: billing.postalCode,
          country: billing.country,
        },
        invoice_settings: { default_payment_method: paymentMethodId },
      })
    }

    // 4. Create Stripe Subscription (skip for deferred)
    let subscriptionId: string | null = null

    if (!isDeferred) {
      const priceId = getStripePriceId(plan)

      if (!priceId) {
        return NextResponse.json(
          { error: `Invalid plan: ${plan}` },
          { status: 400 }
        )
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: "error_if_incomplete",
        expand: ["latest_invoice.payment_intent"],
      })

      if (subscription.status !== "active") {
        return NextResponse.json(
          { error: "Subscription not active", status: subscription.status },
          { status: 400 }
        )
      }

      subscriptionId = subscription.id
    }

    // 5. Create Organization in Supabase
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: `${profile.firstName}'s Organization`,
        created_by: user.id,
        billing_name: billing.cardholderName,
        billing_street: billing.streetAddress,
        billing_city: billing.city,
        billing_region: billing.region,
        billing_postal: billing.postalCode,
        billing_country: billing.country,
        stripe_customer_id: customerId,
        stripe_payment_method_id: paymentMethodId,
      })
      .select()
      .single()

    if (orgError) {
      console.error("Org insert error:", orgError)
      return NextResponse.json(
        { error: "Failed to create organization" },
        { status: 500 }
      )
    }

    // 6. Create Profile in Supabase
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      first_name: profile.firstName,
      last_name: profile.lastName,
      plan_id: isDeferred ? null : plan, // null for deferred users
      organization_id: org.id,
    })

    if (profileError) {
      console.error("Profile insert error:", profileError)
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionId, // null for deferred
      organizationId: org.id,
      isDeferred,
    })
  } catch (err) {
    console.error("Finalize error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
