import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createBidSchema } from "@/lib/validations/bid"

// GET /api/bids - List all bids for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: bids, error } = await supabase
      .from("bids")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching bids:", error)
      return NextResponse.json(
        { error: "Failed to fetch bids" },
        { status: 500 }
      )
    }

    return NextResponse.json(bids)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/bids - Create a new bid
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createBidSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { data: bid, error } = await supabase
      .from("bids")
      .insert({
        user_id: user.id,
        title: parsed.data.title || null,
        contact_id: parsed.data.contact_id || null,
        blocks: parsed.data.blocks,
        status: "draft",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating bid:", error)
      return NextResponse.json(
        { error: "Failed to create bid" },
        { status: 500 }
      )
    }

    return NextResponse.json(bid, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
