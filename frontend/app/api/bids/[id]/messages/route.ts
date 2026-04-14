// POST /api/bids/[id]/messages - Customer sends a question (public)
// GET /api/bids/[id]/messages - Contractor reads messages (auth required)

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createBidMessageSchema } from "@/lib/validations/message"

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST - Customer sends a question (no auth)
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 1. Validate request body
    const body = await request.json()
    const parsed = createBidMessageSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // 2. Check bid exists and is active
    const { data: bid, error: fetchError } = await supabase
      .from("bids")
      .select("id, disabled_at")
      .eq("id", id)
      .single()

    if (fetchError || !bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 })
    }

    if (bid.disabled_at) {
      return NextResponse.json(
        { error: "This bid link is no longer active" },
        { status: 410 }
      )
    }

    // 3. Create the message
    const { data: message, error: insertError } = await supabase
      .from("bid_messages")
      .insert({
        bid_id: id,
        message: parsed.data.message,
        sender_email: parsed.data.sender_email,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating message:", insertError)
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      )
    }

    // TODO: Notify contractor (email/text based on their preferences)

    return NextResponse.json(
      { success: true, message_id: message.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET - Contractor reads messages (auth required)
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 1. Verify contractor is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Verify contractor owns this bid
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (bidError || !bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 })
    }

    // 3. Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from("bid_messages")
      .select("*")
      .eq("bid_id", id)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      )
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
