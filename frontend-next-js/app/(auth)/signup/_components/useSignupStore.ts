import { create } from "zustand"
import type { StepProfileValues } from "@/app/(auth)/signup/onboarding/StepProfile"
import type { BillingForSupabase } from "@/app/(auth)/signup/onboarding/StepBilling"

type CardPreview = {
  brand: string
  last4: string
  exp_month: number
  exp_year: number
}

type SignupState = {
  plan: string | null
  profile: StepProfileValues | null
  billing: BillingForSupabase | null
  cardPreview: CardPreview | null
  paymentMethodId: string | null // <-- ADD
  stripeCustomerId: string | null // <-- ADD

  setPlan: (planId: string) => void
  setProfile: (data: StepProfileValues) => void
  setBilling: (data: BillingForSupabase) => void
  setCardPreview: (card: CardPreview) => void
  setPaymentMethodId: (id: string) => void // <-- ADD
  setStripeCustomerId: (id: string) => void // <-- ADD

  reset: () => void
}

export const useSignupStore = create<SignupState>((set) => ({
  plan: null,
  profile: null,
  billing: null,
  cardPreview: null,
  paymentMethodId: null, // <-- ADD
  stripeCustomerId: null, // <-- ADD

  setPlan: (plan) => set({ plan }),
  setProfile: (profile) => set({ profile }),
  setBilling: (billing) => set({ billing }),
  setCardPreview: (cardPreview) => set({ cardPreview }),
  setPaymentMethodId: (paymentMethodId) => set({ paymentMethodId }), // <-- ADD
  setStripeCustomerId: (stripeCustomerId) => set({ stripeCustomerId }), // <-- ADD

  reset: () =>
    set({
      plan: null,
      profile: null,
      billing: null,
      cardPreview: null,
      paymentMethodId: null, // <-- ADD
      stripeCustomerId: null, // <-- ADD
    }),
}))
