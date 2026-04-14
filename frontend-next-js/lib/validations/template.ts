import { z } from "zod"
import { bidBlockSchema } from "./bid"

// ============================================
// TEMPLATE SCHEMAS
// ============================================

// For creating a new template
export const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  blocks: z.array(bidBlockSchema),
})

// For updating a template
export const updateTemplateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  blocks: z.array(bidBlockSchema).optional(),
})

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>

export type Template = {
  id: string
  user_id: string
  name: string
  description: string | null
  blocks: z.infer<typeof bidBlockSchema>[]
  created_at: string
  updated_at: string
}
