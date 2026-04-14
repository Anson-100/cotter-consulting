// /api/stripe/update-payment-method/route.ts

// This route file updates the payment method in Stripe and Supabase
// Called by billingSettings.tsx when user updates their card
// Attaches new payment method to customer, updates default, stores in organizations table

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Stripe from "stripe"
import { z } from "zod"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Validation schema
const updatePaymentMethodSchema = z.object({
  paymentMethodId: z
    .string()
    .min(1, "Payment method is required")
    .startsWith("pm_", "Invalid payment method format"),
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate request body
    const body = await req.json()
    const validation = updatePaymentMethodSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid request data" },
        { status: 400 }
      )
    }

    const { paymentMethodId } = validation.data

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
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
      .select("stripe_customer_id")
      .eq("id", profile.organization_id)
      .single()

    if (!org?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 404 }
      )
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: org.stripe_customer_id,
    })

    // Set as default payment method
    await stripe.customers.update(org.stripe_customer_id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    // Update in database
    const { error: updateError } = await supabase
      .from("organizations")
      .update({ stripe_payment_method_id: paymentMethodId })
      .eq("id", profile.organization_id)

    if (updateError) {
      console.error("Update payment method error:", updateError)
      return NextResponse.json(
        { error: "Failed to update payment method" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Update payment method error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
