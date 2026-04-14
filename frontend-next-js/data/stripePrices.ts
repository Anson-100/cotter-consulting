// Map your Zustand plan IDs to Stripe Price IDs
// Get the price_xxx IDs from Stripe Dashboard → Products → Click product → Copy Price ID

export const STRIPE_PRICE_IDS: Record<string, string> = {
  // NOTE: Zustand uses underscores, Stripe uses hyphens in product names
  // But we map to the Price ID (price_xxx), not the product name

  starter_monthly: "price_1Sa2W02Z0TOKVx8aoSoNtJi7",
  starter_annually: "price_1Sa2X42Z0TOKVx8agoElGCf3",
  pro_monthly: "price_1Sa2XP2Z0TOKVx8aO9cv6sB3",
  pro_annually: "price_1Sa2YX2Z0TOKVx8a99u2DmBO",
  unlimited_monthly: "price_1Sa2Xo2Z0TOKVx8anBNSNhSi",
  unlimited_annually: "price_1Sa2YC2Z0TOKVx8ab6a8cUwy",
}

export function getStripePriceId(planId: string): string | null {
  return STRIPE_PRICE_IDS[planId] || null
}
