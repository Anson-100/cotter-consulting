// /app/api/contacts/[id]/route.ts

// This route handles single contact operations
// PATCH - Update a contact
// DELETE - Delete a contact
// RLS policies ensure users only access their own org's contacts

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

// Validation schema for updating a contact
const updateContactSchema = z.object({
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

// PATCH - Update a contact
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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
    const validation = updateContactSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid request data" },
        { status: 400 }
      )
    }

    const { name, email, phone, notes } = validation.data

    // Update contact (RLS ensures user can only update their own org's contacts)
    const { data: contact, error: updateError } = await supabase
      .from("contacts")
      .update({
        name,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("[Contacts PATCH] Update error:", updateError)

      // Check if contact not found or not authorized
      if (updateError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: "Failed to update contact" },
        { status: 500 }
      )
    }

    return NextResponse.json({ contact })
  } catch (err) {
    console.error("[Contacts PATCH] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a contact
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    // Delete contact (RLS ensures user can only delete their own org's contacts)
    const { error: deleteError } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("[Contacts DELETE] Delete error:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete contact" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[Contacts DELETE] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
