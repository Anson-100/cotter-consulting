// data/planUtils.ts

import { PRICE_PLANS } from "./pricePlans"
import { STRIPE_PRICE_IDS } from "./stripePrices"

export function getAllPlanOptions() {
  const cycles: Array<"monthly" | "annually"> = ["monthly", "annually"]

  return PRICE_PLANS.flatMap((plan) =>
    cycles.map((cycle) => ({
      id: `${plan.id}_${cycle}`,
      label: `${plan.name} - ${cycle === "monthly" ? "Monthly" : "Annual"} (${
        plan.price[cycle]
      })`,
    }))
  )
}

export function getPlanLabel(planId: string): string {
  const [baseId, cycle] = planId.split("_")
  const plan = PRICE_PLANS.find((p) => p.id === baseId)
  if (!plan) return planId

  const cycleLabel = cycle === "monthly" ? "Monthly" : "Annual"
  const price = plan.price[cycle as "monthly" | "annually"]
  return `${plan.name} - ${cycleLabel} (${price})`
}

// Get all valid plan IDs for validation
export function getAllPlanIds(): string[] {
  return Object.keys(STRIPE_PRICE_IDS).filter((id) => id !== "deferred")
}
