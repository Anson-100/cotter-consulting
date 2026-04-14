import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateTemplateSchema } from "@/lib/validations/template"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/templates/[id] - Get a single template
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

    const { data: template, error } = await supabase
      .from("bid_templates")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching template:", error)
      return NextResponse.json(
        { error: "Failed to fetch template" },
        { status: 500 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/templates/[id] - Update a template
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
    const parsed = updateTemplateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name
    if (parsed.data.description !== undefined)
      updateData.description = parsed.data.description
    if (parsed.data.blocks !== undefined) updateData.blocks = parsed.data.blocks

    const { data: template, error } = await supabase
      .from("bid_templates")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        )
      }
      console.error("Error updating template:", error)
      return NextResponse.json(
        { error: "Failed to update template" },
        { status: 500 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/templates/[id] - Delete a template
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
      .from("bid_templates")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error deleting template:", error)
      return NextResponse.json(
        { error: "Failed to delete template" },
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
