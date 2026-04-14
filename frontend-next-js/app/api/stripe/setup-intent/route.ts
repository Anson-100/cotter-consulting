// /api/stripe/setup-intent/route.ts

// This route creates a Stripe SetupIntent for collecting payment methods
// Called during onboarding (StepBilling) and settings (billingSettings)
// Requires authentication to prevent abuse

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Stripe from "stripe"

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

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { customerId } = await req.json()

    const customer = customerId
      ? customerId
      : (await stripe.customers.create({ email: user.email })).id

    const intent = await stripe.setupIntents.create({
      customer,
      payment_method_types: ["card"],
    })

    return NextResponse.json({
      clientSecret: intent.client_secret,
      customerId: customer,
    })
  } catch (err) {
    console.error("Setup intent error:", err)
    return NextResponse.json(
      { error: "Failed to create SetupIntent" },
      { status: 500 }
    )
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
