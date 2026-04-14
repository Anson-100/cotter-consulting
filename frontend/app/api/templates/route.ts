import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createTemplateSchema } from "@/lib/validations/template"

// GET /api/templates - List all templates for the authenticated user
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

    const { data: templates, error } = await supabase
      .from("bid_templates")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching templates:", error)
      return NextResponse.json(
        { error: "Failed to fetch templates" },
        { status: 500 }
      )
    }

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create a new template
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
    const parsed = createTemplateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { data: template, error } = await supabase
      .from("bid_templates")
      .insert({
        user_id: user.id,
        name: parsed.data.name,
        description: parsed.data.description || null,
        blocks: parsed.data.blocks,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating template:", error)
      return NextResponse.json(
        { error: "Failed to create template" },
        { status: 500 }
      )
    }

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
