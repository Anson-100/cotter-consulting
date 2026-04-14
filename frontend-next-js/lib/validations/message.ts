import { z } from "zod"

// ============================================
// BID MESSAGE SCHEMAS
// ============================================

// Full message as returned from database
export const bidMessageSchema = z.object({
  id: z.string().uuid(),
  bid_id: z.string().uuid(),
  message: z.string(),
  sender_email: z.string().email(),
  created_at: z.string().datetime(),
})

// For creating a new message (customer sending a question)
export const createBidMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message too long"),
  sender_email: z.string().email("Valid email required"),
})

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type BidMessage = z.infer<typeof bidMessageSchema>
export type CreateBidMessageInput = z.infer<typeof createBidMessageSchema>
