import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateBidSchema } from "@/lib/validations/bid"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/bids/[id] - Get a single bid
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: bid, error } = await supabase
      .from("bids")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Bid not found" }, { status: 404 })
      }
      console.error("Error fetching bid:", error)
      return NextResponse.json(
        { error: "Failed to fetch bid" },
        { status: 500 }
      )
    }

    return NextResponse.json(bid)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/bids/[id] - Update a bid
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = updateBidSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title
    if (parsed.data.contact_id !== undefined)
      updateData.contact_id = parsed.data.contact_id
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status
    if (parsed.data.blocks !== undefined) updateData.blocks = parsed.data.blocks

    const { data: bid, error } = await supabase
      .from("bids")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Bid not found" }, { status: 404 })
      }
      console.error("Error updating bid:", error)
      return NextResponse.json(
        { error: "Failed to update bid" },
        { status: 500 }
      )
    }

    return NextResponse.json(bid)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/bids/[id] - Delete a bid
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("bids")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error deleting bid:", error)
      return NextResponse.json(
        { error: "Failed to delete bid" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
