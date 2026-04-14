"use client"

import { useState, useEffect } from "react"
import { PRICE_PLANS, DEFERRED_PLAN } from "@/data/pricePlans"
import { useSignupStore } from "@/app/(auth)/signup/_components/useSignupStore"
import PriceTileOnboarding from "@/components/ui/price-tile-onboarding"

type PriceTilesProps = {
  registerValidate?: (fn: () => boolean) => void
}

export default function PriceTilesOnboarding({
  registerValidate,
}: PriceTilesProps) {
  const setPlan = useSignupStore((s) => s.setPlan)
  const savedPlan = useSignupStore((s) => s.plan)

  const initialCycle: "monthly" | "annually" =
    typeof savedPlan === "string" && savedPlan.endsWith("_annually")
      ? "annually"
      : "monthly"

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    initialCycle
  )

  const [selectedPlan, setSelectedPlan] = useState<string | null>(
    typeof savedPlan === "string" ? savedPlan : null
  )

  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (!registerValidate) return

    registerValidate(() => {
      if (!selectedPlan) {
        setShowError(true)
        return false
      }
      setShowError(false)
      return true
    })
  }, [registerValidate, selectedPlan])

  return (
    <section className="group/tiers">
      <div className="mx-auto max-w-7xl pt-6 relative">
        {showError && (
          <p className="absolute -top-10 right-0 left-0 mt-4 mb-6 text-center text-red-600 font-medium">
            Please select a plan to continue.
          </p>
        )}

        {/* TOGGLE SWITCH */}
        <div className="flex justify-center pb-8">
          <fieldset aria-label="Payment frequency">
            <div className="relative flex items-center rounded-full bg-white dark:bg-zinc-950 ring-2 ring-zinc-300 dark:ring-zinc-700 ring-inset px-1 py-1 gap-2">
              <div
                className="absolute rounded-full bg-indigo-600 transition-all duration-200"
                style={{
                  height: "calc(100% - 8px)",
                  top: "4px",
                  left: billingCycle === "monthly" ? "4px" : "calc(50% + 4px)",
                  width: "calc(50% - 8px)",
                }}
              />
              <label
                className={`relative cursor-pointer rounded-full px-4 py-1 font-semibold transition-colors z-10 ${
                  billingCycle === "monthly"
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value="monthly"
                  checked={billingCycle === "monthly"}
                  onChange={() => setBillingCycle("monthly")}
                  className="sr-only"
                />
                Monthly
              </label>
              <label
                className={`relative cursor-pointer rounded-full px-4 py-1 font-semibold transition-colors z-10 ${
                  billingCycle === "annually" ? "text-white" : "text-gray-500"
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value="annually"
                  checked={billingCycle === "annually"}
                  onChange={() => setBillingCycle("annually")}
                  className="sr-only"
                />
                Annually
              </label>
            </div>
          </fieldset>
        </div>

        {/* PRICE CARDS */}
        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {PRICE_PLANS.map((tier) => (
            <PriceTileOnboarding
              key={tier.id}
              id={tier.id}
              name={tier.name}
              description={tier.description}
              featured={tier.featured}
              price={tier.price}
              features={tier.features}
              billingCycle={billingCycle}
              isSelected={selectedPlan === `${tier.id}_${billingCycle}`}
              onSelect={() => {
                const combined = `${tier.id}_${billingCycle}`
                setSelectedPlan(combined)
                setPlan(combined)
                setShowError(false)
              }}
            />
          ))}
        </div>

        {/* OR DIVIDER */}
        <div className="flex items-center justify-center my-16 px-4">
          <div className="flex-1 h-0.5 bg-linear-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent max-w-xs" />
          <span className="px-6 text-lg font-semibold text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="flex-1 h-0.5 bg-linear-to-l from-transparent via-zinc-300 dark:via-zinc-700 to-transparent max-w-xs" />
        </div>

        {/* DEFERRED TILE - same grid structure for matching width */}
        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {/* 
            Grid positioning:
            - Mobile (1 col): just fills the column
            - md (2 col): spans both, centers with mx-auto, constrained to half width
            - lg/xl (3 col): sits in center column (col 2)
          */}
          <div className="md:col-span-2 md:w-1/2 md:mx-auto lg:col-span-1 lg:col-start-2 lg:w-full">
            <PriceTileOnboarding
              id={DEFERRED_PLAN.id}
              name={DEFERRED_PLAN.name}
              description={DEFERRED_PLAN.description}
              features={DEFERRED_PLAN.features}
              isSelected={selectedPlan === "deferred"}
              onSelect={() => {
                setSelectedPlan("deferred")
                setPlan("deferred")
                setShowError(false)
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
