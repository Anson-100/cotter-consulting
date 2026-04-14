// POST /api/bids/[id]/accept
// Public endpoint - customer accepting a bid (no auth required)

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { customerUpdateBidSchema } from "@/lib/validations/bid"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 1. Validate request body
    const body = await request.json()
    const parsed = customerUpdateBidSchema.safeParse({
      ...body,
      status: "accepted",
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // 2. Fetch the bid to check current state
    const { data: bid, error: fetchError } = await supabase
      .from("bids")
      .select("id, status, disabled_at, accepted_at, declined_at")
      .eq("id", id)
      .single()

    if (fetchError || !bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 })
    }

    // 3. Business logic checks
    if (bid.disabled_at) {
      return NextResponse.json(
        { error: "This bid link is no longer active" },
        { status: 410 }
      )
    }

    if (bid.accepted_at) {
      return NextResponse.json(
        { error: "Bid has already been accepted" },
        { status: 409 }
      )
    }

    if (bid.declined_at) {
      return NextResponse.json(
        { error: "Bid has already been declined" },
        { status: 409 }
      )
    }

    if (bid.status === "draft") {
      return NextResponse.json(
        { error: "This bid has not been sent yet" },
        { status: 400 }
      )
    }

    // 4. Update the bid
    const { data: updated, error: updateError } = await supabase
      .from("bids")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        accepted_email: parsed.data.accepted_email || null,
        project_status: "starting_soon",
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Error accepting bid:", updateError)
      return NextResponse.json(
        { error: "Failed to accept bid" },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email to customer (if accepted_email provided)
    // TODO: Notify contractor (email/text based on their preferences)

    return NextResponse.json({
      success: true,
      status: updated.status,
      accepted_at: updated.accepted_at,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
