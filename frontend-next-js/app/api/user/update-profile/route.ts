// /api/user/update-profile/route.ts

// This route updates the user's first name, last name, and email in Supabase
// Called by userSettings.tsx when user clicks Save on Personal Info form
// Uses session cookies to identify the user, RLS ensures users only update their own row

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

// Validation schema - matches profile fields from finalize
const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(40, "Last name too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
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
    const validation = updateProfileSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid request data" },
        { status: 400 }
      )
    }

    const { firstName, lastName, email } = validation.data

    // Update profile in DB
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", user.id)

    if (profileError) {
      console.error("Profile update error:", profileError)
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    // Update email in auth if changed
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email,
      })

      if (emailError) {
        console.error("Email update error:", emailError)
        return NextResponse.json(
          { error: "Failed to update email" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Update profile error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
