// /api/user/update-password/route.ts

// This route updates the user's password in Supabase Auth
// Called by userSettings.tsx when user clicks Save on Change Password form
// Uses session cookies to identify the user, validates passwords match before updating

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"
import { passwordSchema } from "@/lib/validations/password"

// Validation schema - matches AuthModal password requirements
const updatePasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
    const validation = updatePasswordSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid request data" },
        { status: 400 }
      )
    }

    const { newPassword } = validation.data

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      console.error("Password update error:", error)
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Update password error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
