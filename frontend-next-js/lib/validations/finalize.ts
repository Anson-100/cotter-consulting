// lib/validations/finalize.ts

// Server-side validation for the /api/stripe/finalize route
// These rules should mirror your React Hook Form / Controller rules

import { z } from "zod"

// Valid plan IDs (must match your stripePrices.ts + "deferred")
const VALID_PLAN_IDS = [
  "starter_monthly",
  "starter_annually",
  "pro_monthly",
  "pro_annually",
  "unlimited_monthly",
  "unlimited_annually",
  "deferred",
] as const

// Valid billing countries (must match StepBillingInner countries array)
const VALID_COUNTRIES = ["US", "CA", "GB", "AU", "NZ"] as const

// Profile schema - matches StepProfile form validation
const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(40, "Last name too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  tosAccepted: z.literal(true, { message: "You must accept the terms" }),
  // Optional fields from profile
  country: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  marketingOk: z.boolean().optional(),
})

// Billing schema - matches StepBillingInner form validation
const billingSchema = z.object({
  cardholderName: z
    .string()
    .min(1, "Cardholder name is required")
    .max(80, "Cardholder name too long"),
  country: z.enum(VALID_COUNTRIES, { message: "Invalid country" }),
  streetAddress: z
    .string()
    .min(1, "Street address is required")
    .max(60, "Street address too long"),
  city: z.string().min(1, "City is required").max(60, "City too long"),
  region: z
    .string()
    .min(1, "State/Province is required")
    .regex(/^[A-Za-z]{2}$/, "Use 2-letter code (e.g., FL)"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
})

// Main finalize request schema
export const finalizeSchema = z.object({
  plan: z.enum(VALID_PLAN_IDS, { message: "Invalid plan selected" }),
  profile: profileSchema,
  billing: billingSchema,
  paymentMethodId: z
    .string()
    .min(1, "Payment method is required")
    .startsWith("pm_", "Invalid payment method format"),
  stripeCustomerId: z
    .string()
    .startsWith("cus_", "Invalid customer ID format")
    .nullable()
    .optional(),
})

// Export types derived from schemas (useful for type safety)
export type FinalizeInput = z.infer<typeof finalizeSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type BillingInput = z.infer<typeof billingSchema>
