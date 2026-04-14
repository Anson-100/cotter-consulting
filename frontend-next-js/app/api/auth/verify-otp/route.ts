import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const { success } = await checkRateLimit(request)
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    )
  }

  try {
    const { email, token, type } = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: type || "signup",
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
