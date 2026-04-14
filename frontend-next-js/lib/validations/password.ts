import { z } from "zod"

export const PASSWORD_RULES = [
  { key: "minLength", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { key: "uppercase", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { key: "lowercase", label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { key: "number", label: "One number", test: (v: string) => /\d/.test(v) },
  { key: "special", label: "One special character (!@#$...)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const

export function validatePassword(password: string): string | true {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) return rule.label
  }
  return true
}

// Zod schema for server-side validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
