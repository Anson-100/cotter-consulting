"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PriceTileOnboarding from "@/components/ui/price-tile-onboarding"
import { PRICE_PLANS } from "@/data/pricePlans"

type ChangePlanInlineProps = {
  isExpanded: boolean
  onCollapse: () => void
  currentPlanId: string
  // REPORTS SELECTED PLAN BACK TO PARENT SO THE BUTTON CAN UPDATE ========
  onSelectionChange: (selectedPlanId: string) => void
}

export default function ChangePlanInline({
  isExpanded,
  onCollapse,
  currentPlanId,
  onSelectionChange,
}: ChangePlanInlineProps) {
  const currentCycle = currentPlanId.endsWith("_annually")
    ? "annually"
    : "monthly"

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    currentCycle,
  )
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlanId)

  // SCROLL TARGET — AUTO-SCROLL HERE WHEN EXPANDED =======================
  const inlineRef = useRef<HTMLDivElement>(null)

  // RESET STATE + SCROLL INTO VIEW WHEN EXPANDED =========================
  useEffect(() => {
    if (isExpanded) {
      const cycle = currentPlanId.endsWith("_annually") ? "annually" : "monthly"
      setBillingCycle(cycle)
      setSelectedPlan(currentPlanId)
      onSelectionChange(currentPlanId)

      // SLIGHT DELAY SO THE ELEMENT HAS RENDERED BEFORE SCROLLING ========
      setTimeout(() => {
        inlineRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 150)
    }
  }, [isExpanded, currentPlanId, onSelectionChange])

  // REPORT SELECTION CHANGES TO PARENT ====================================
  const handleSelect = (planId: string) => {
    setSelectedPlan(planId)
    onSelectionChange(planId)
  }

  return (
    <AnimatePresence mode="wait">
      {isExpanded && (
        <motion.div
          key="change-plan-inline"
          ref={inlineRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden scroll-mt-24"
        >
          <div className="pt-8 pb-4">
            {/* BILLING CYCLE TOGGLE ====================================== */}
            <div className="flex justify-center pb-8">
              <fieldset aria-label="Payment frequency">
                <div className="relative flex items-center rounded-full bg-white dark:bg-zinc-950 ring-2 ring-zinc-300 dark:ring-zinc-700 ring-inset px-1 py-1 gap-2">
                  <div
                    className="absolute rounded-full bg-indigo-600 transition-all duration-200"
                    style={{
                      height: "calc(100% - 8px)",
                      top: "4px",
                      left:
                        billingCycle === "monthly" ? "4px" : "calc(50% + 4px)",
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
                      onChange={() => {
                        setBillingCycle("monthly")
                        const planBase = selectedPlan
                          .replace("_monthly", "")
                          .replace("_annually", "")
                        const newPlan = `${planBase}_monthly`
                        setSelectedPlan(newPlan)
                        onSelectionChange(newPlan)
                      }}
                      className="sr-only"
                    />
                    Monthly
                  </label>
                  <label
                    className={`relative cursor-pointer rounded-full px-4 py-1 font-semibold transition-colors z-10 ${
                      billingCycle === "annually"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value="annually"
                      checked={billingCycle === "annually"}
                      onChange={() => {
                        setBillingCycle("annually")
                        const planBase = selectedPlan
                          .replace("_monthly", "")
                          .replace("_annually", "")
                        const newPlan = `${planBase}_annually`
                        setSelectedPlan(newPlan)
                        onSelectionChange(newPlan)
                      }}
                      className="sr-only"
                    />
                    Annually
                  </label>
                </div>
              </fieldset>
            </div>

            {/* PLAN TILES ================================================ */}
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
                    handleSelect(`${tier.id}_${billingCycle}`)
                  }}
                />
              ))}
            </div>

            {/* CANCEL LINK =============================================== */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onCollapse}
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
