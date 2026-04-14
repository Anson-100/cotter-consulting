// /api/stripe/update-billing-address/route.ts

// This route file updates billing address in organizations table
// Called by billingSettings.tsx when user saves billing address
// Uses session cookies to identify user, updates only user's own organization

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

// Valid billing countries (must match StepBillingInner and finalize schema)
const VALID_COUNTRIES = ["US", "CA", "GB", "AU", "NZ"] as const

// Validation schema - matches billing fields from finalize
const updateBillingAddressSchema = z.object({
  cardholderName: z
    .string()
    .min(1, "Cardholder name is required")
    .max(80, "Cardholder name too long"),
  country: z.enum(VALID_COUNTRIES, { message: "Invalid country" }),
  streetAddress: z
    .string()
    .min(1, "Street address is required")
    .max(60, "Street address too long"),
  city: z.string().min(1, "City is required").max(60, "City too long"),
  region: z
    .string()
    .min(1, "State/Province is required")
    .regex(/^[A-Za-z]{2}$/, "Use 2-letter code (e.g., FL)"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
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
    const validation = updateBillingAddressSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid request data" },
        { status: 400 }
      )
    }

    const { cardholderName, streetAddress, city, region, postalCode, country } =
      validation.data

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

    const { error: updateError } = await supabase
      .from("organizations")
      .update({
        billing_name: cardholderName,
        billing_street: streetAddress,
        billing_city: city,
        billing_region: region,
        billing_postal: postalCode,
        billing_country: country,
      })
      .eq("id", profile.organization_id)

    if (updateError) {
      console.error("Update billing error:", updateError)
      return NextResponse.json(
        { error: "Failed to update billing info" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Update billing address error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
