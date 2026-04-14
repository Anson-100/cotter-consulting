// /app/api/contacts/route.ts

// This route handles contacts CRUD operations
// GET - Fetch all contacts for the user's organization
// POST - Create a new contact in the user's organization
// RLS policies ensure users only access their own org's contacts

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

// Validation schema for creating a contact
const createContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z
    .string()
    .email("Invalid email")
    .max(100, "Email too long")
    .optional()
    .or(z.literal("")),
  phone: z.string().max(30, "Phone too long").optional().or(z.literal("")),
  notes: z.string().max(500, "Notes too long").optional().or(z.literal("")),
})

// GET - Fetch all contacts for user's organization
export async function GET() {
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

    // RLS handles filtering by organization
    const { data: contacts, error: contactsError } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })

    if (contactsError) {
      console.error("[Contacts GET] Error:", contactsError)
      return NextResponse.json(
        { error: "Failed to fetch contacts" },
        { status: 500 }
      )
    }

    return NextResponse.json({ contacts })
  } catch (err) {
    console.error("[Contacts GET] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new contact
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

    // Get user's organization
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.organization_id) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      )
    }

    // Validate request body
    const body = await req.json()
    const validation = createContactSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid request data" },
        { status: 400 }
      )
    }

    const { name, email, phone, notes } = validation.data

    // Create contact
    const { data: contact, error: insertError } = await supabase
      .from("contacts")
      .insert({
        organization_id: profile.organization_id,
        name,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[Contacts POST] Insert error:", insertError)
      return NextResponse.json(
        { error: "Failed to create contact" },
        { status: 500 }
      )
    }

    return NextResponse.json({ contact }, { status: 201 })
  } catch (err) {
    console.error("[Contacts POST] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
