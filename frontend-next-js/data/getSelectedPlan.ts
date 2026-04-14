import { PRICE_PLANS } from "./pricePlans";

export function getSelectedPlan(planId: string | null) {
  if (!planId) return null;

  // Example planId formats:
  // "starter_monthly"
  // "pro_annually"
  const [baseId, cycle] = planId.split("_"); // baseId = starter, cycle = monthly

  const plan = PRICE_PLANS.find((p) => p.id === baseId);
  if (!plan) return null;

  return {
    name: plan.name,
    price: plan.price[cycle as "monthly" | "annually"],
    cycle,
    description: plan.description,
    features: plan.features,
  };
}
