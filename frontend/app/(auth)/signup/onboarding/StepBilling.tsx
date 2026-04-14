"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import StepBillingInner, {
  StepBillingProps,
  StepBillingValues,
  BillingForSupabase,
} from "./StepBillingInner"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Re-export types so existing imports from "./StepBilling" still work
export type { StepBillingProps, StepBillingValues, BillingForSupabase }

export default function StepBilling(props: StepBillingProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          variables: {
            fontFamily: "Inter, sans-serif",
          },
        },
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
          },
        ],
      }}
    >
      <StepBillingInner {...props} />
    </Elements>
  )
}
