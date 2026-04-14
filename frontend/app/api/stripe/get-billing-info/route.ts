/* eslint-disable @typescript-eslint/no-explicit-any */
// api/stripe/get-billing-info/route.ts
// This route fetches billing info from Supabase and card details from Stripe
// Called by billingSettings.tsx on page load
// Uses session cookies to identify user, queries organizations table and Stripe API

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, plan_id")
      .eq("id", user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      )
    }

    const { data: org } = await supabase
      .from("organizations")
      .select(
        "billing_name, billing_street, billing_city, billing_region, billing_postal, billing_country, stripe_payment_method_id, stripe_customer_id"
      )
      .eq("id", profile.organization_id)
      .single()

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      )
    }

    // Get card info
    let card = null
    if (org.stripe_payment_method_id) {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        org.stripe_payment_method_id
      )
      card = {
        last4: paymentMethod.card?.last4,
        exp_month: paymentMethod.card?.exp_month,
        exp_year: paymentMethod.card?.exp_year,
        brand: paymentMethod.card?.brand,
      }
    }

    // Get subscription info for next payment date
    // Get subscription info for next payment date
    let nextPaymentDate = null
    if (org.stripe_customer_id) {
      const subscriptions = await stripe.subscriptions.list({
        customer: org.stripe_customer_id,
        status: "active",
        limit: 1,
      })

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0] as any
        nextPaymentDate = subscription.items.data[0].current_period_end
      }
    }

    return NextResponse.json({
      billing: {
        cardholderName: org.billing_name,
        streetAddress: org.billing_street,
        city: org.billing_city,
        region: org.billing_region,
        postalCode: org.billing_postal,
        country: org.billing_country,
      },
      card,
      plan: profile.plan_id,
      nextPaymentDate,
    })
  } catch (err) {
    console.error("Get billing info error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
