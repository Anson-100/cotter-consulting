import { z } from "zod"

// ============================================
// BLOCK SCHEMAS
// ============================================

// Header Block - company info at top of bid
export const headerBlockSchema = z.object({
  type: z.literal("header"),
  companyName: z.string(),
  tagline: z.string().optional(),
  logoUrl: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

// Greeting Block - personalized greeting + job name
export const greetingBlockSchema = z.object({
  type: z.literal("greeting"),
  jobName: z.string(),
  recipientName: z.string().optional(),
})

// Content Box - flexible box with header + bullet items
export const contentItemSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const contentBlockSchema = z.object({
  type: z.literal("content"),
  header: z.string(),
  icon: z.string(),
  items: z.array(contentItemSchema),
})

// Location Block - address with optional link
export const locationBlockSchema = z.object({
  type: z.literal("location"),
  header: z.string(),
  address: z.string(),
  url: z.string().url().optional(),
})

// Step Tracker Block - progress steps with optional substeps
export const substepSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["complete", "current", "upcoming"]),
})

export const stepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(["complete", "current", "upcoming"]),
  substeps: z.array(substepSchema).optional(),
})

export const stepTrackerBlockSchema = z.object({
  type: z.literal("stepTracker"),
  header: z.string(),
  subtitle: z.string().optional(),
  steps: z.array(stepSchema),
})

// Pricing Block - structured line items with computed totals
export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
})

// Hour Entry - billable hours line item
export const hourEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  hours: z.number(),
})

// Pricing Note - flexible heading + body (payment terms, accepted methods, etc.)
export const pricingNoteSchema = z.object({
  id: z.string(),
  heading: z.string(),
  body: z.string(),
})

export const pricingBlockSchema = z.object({
  type: z.literal("pricing"),
  header: z.string(),
  // Line items
  showLineItems: z.boolean().default(true),
  lineItems: z.array(lineItemSchema),
  // Billable hours
  showBillableHours: z.boolean().default(false),
  hourlyRate: z.number().default(0),
  hourEntries: z.array(hourEntrySchema).default([]),
  // Payment
  depositPercent: z.number().min(0).max(100).default(50),
  paymentTerms: z.string().optional(),
  // Customer visibility
  showBreakdownToCustomer: z.boolean().default(false),
  // Notes (payment terms, accepted methods, etc.)
  notes: z.array(pricingNoteSchema).default([]),
})

// Signature Block - authorization/signature capture on bids
export const signerSchema = z.object({
  id: z.string(),
  label: z.string(),
  signerName: z.string().optional(),
  signerTitle: z.string().optional(),
  dateSigned: z.string().optional(),
  signatureData: z.string().optional(),
})

export const signatureBlockSchema = z.object({
  type: z.literal("signature"),
  header: z.string(),
  bodyText: z.string().optional(),
  signers: z.array(signerSchema).default([]),
})

// Photo schema (reusable for all photo arrays)
export const photoSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  caption: z.string().optional(),
})

// Photo Block - image gallery with optional before/after mode
export const photoBlockSchema = z.object({
  type: z.literal("photo"),
  header: z.string(),
  isBeforeAfter: z.boolean().default(false),
  photos: z.array(photoSchema),
  beforePhotos: z.array(photoSchema).default([]),
  afterPhotos: z.array(photoSchema).default([]),
})

// Discriminated union of all block types
export const bidBlockSchema = z.discriminatedUnion("type", [
  headerBlockSchema,
  greetingBlockSchema,
  contentBlockSchema,
  locationBlockSchema,
  stepTrackerBlockSchema,
  pricingBlockSchema,
  photoBlockSchema,
  signatureBlockSchema,
])

// ============================================
// BID STATUS & PROJECT STATUS
// ============================================

export const bidStatusEnum = z.enum([
  "draft",
  "sent",
  "viewed",
  "accepted",
  "declined",
])

export const projectStatusEnum = z.enum([
  "starting_soon",
  "in_progress",
  "complete",
])

export const disabledByEnum = z.enum(["contractor", "customer"])

// ============================================
// BID SCHEMA
// ============================================

export const bidSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  contact_id: z.string().uuid().nullable(),
  title: z.string().nullable(),
  status: bidStatusEnum,
  blocks: z.array(bidBlockSchema),
  // New fields for accept/decline flow
  sent_to_email: z.string().email().nullable().optional(),
  sent_to_phone: z.string().nullable().optional(),
  sent_at: z.string().datetime().nullable().optional(),
  accepted_at: z.string().datetime().nullable().optional(),
  declined_at: z.string().datetime().nullable().optional(),
  accepted_email: z.string().email().nullable().optional(),
  project_status: projectStatusEnum.nullable().optional(),
  disabled_at: z.string().datetime().nullable().optional(),
  disabled_by: disabledByEnum.nullable().optional(),
  // Timestamps
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// For creating a new bid (minimal required fields)
export const createBidSchema = z.object({
  title: z.string().optional(),
  contact_id: z.string().uuid().optional(),
  blocks: z.array(bidBlockSchema).default([]),
})

// For updating a bid (contractor editing)
export const updateBidSchema = z.object({
  title: z.string().optional(),
  contact_id: z.string().uuid().nullable().optional(),
  status: bidStatusEnum.optional(),
  blocks: z.array(bidBlockSchema).optional(),
  // Send flow
  sent_to_email: z.string().email().nullable().optional(),
  sent_to_phone: z.string().nullable().optional(),
  // Project management
  project_status: projectStatusEnum.nullable().optional(),
  // Disable link
  disabled_at: z.string().datetime().nullable().optional(),
  disabled_by: disabledByEnum.nullable().optional(),
})

// For customer accept/decline (public, no auth)
export const customerUpdateBidSchema = z.object({
  status: z.enum(["accepted", "declined"]),
  accepted_email: z.string().email().optional(),
})

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type BidStatus = z.infer<typeof bidStatusEnum>
export type ProjectStatus = z.infer<typeof projectStatusEnum>
export type DisabledBy = z.infer<typeof disabledByEnum>
export type HeaderBlock = z.infer<typeof headerBlockSchema>
export type GreetingBlock = z.infer<typeof greetingBlockSchema>
export type ContentItem = z.infer<typeof contentItemSchema>
export type ContentBlock = z.infer<typeof contentBlockSchema>
export type LocationBlock = z.infer<typeof locationBlockSchema>
export type Substep = z.infer<typeof substepSchema>
export type Step = z.infer<typeof stepSchema>
export type StepTrackerBlock = z.infer<typeof stepTrackerBlockSchema>
export type LineItem = z.infer<typeof lineItemSchema>
export type HourEntry = z.infer<typeof hourEntrySchema>
export type PricingNote = z.infer<typeof pricingNoteSchema>
export type PricingBlock = z.infer<typeof pricingBlockSchema>
export type Photo = z.infer<typeof photoSchema>
export type PhotoBlock = z.infer<typeof photoBlockSchema>
export type Signer = z.infer<typeof signerSchema>
export type SignatureBlock = z.infer<typeof signatureBlockSchema>
export type BidBlock = z.infer<typeof bidBlockSchema>
export type Bid = z.infer<typeof bidSchema>
export type CreateBidInput = z.infer<typeof createBidSchema>
export type UpdateBidInput = z.infer<typeof updateBidSchema>
export type CustomerUpdateBidInput = z.infer<typeof customerUpdateBidSchema>
