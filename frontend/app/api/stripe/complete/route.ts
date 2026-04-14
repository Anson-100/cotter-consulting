// /api/stripe/complete/route.ts

// This route retrieves card details after a successful SetupIntent confirmation
// Called by StepBillingInner to get card preview (brand, last4, expiry)
// Requires authentication to prevent unauthorized access to payment method details

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

    const { paymentMethodId } = await req.json()

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Missing paymentMethodId" },
        { status: 400 }
      )
    }

    // Retrieve full card details
    const pm = await stripe.paymentMethods.retrieve(paymentMethodId)

    const card = pm.card
      ? {
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
        }
      : null

    return NextResponse.json({
      ok: true,
      card,
    })
  } catch (err) {
    console.error("Stripe complete error:", err)
    return NextResponse.json(
      { error: "Failed to finalize billing" },
      { status: 500 }
    )
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
