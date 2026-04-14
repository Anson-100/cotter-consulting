"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon } from "@heroicons/react/24/solid"
import Portal from "@/components/ui/portal"
import Button from "@/components/ui/button"
import PriceTileOnboarding from "@/components/ui/price-tile-onboarding"
import { PRICE_PLANS } from "@/data/pricePlans"

type ChangePlanModalProps = {
  isOpen: boolean
  onClose: () => void
  currentPlanId: string // e.g., "starter_monthly"
  onConfirm: (newPlanId: string) => Promise<void>
}

export default function ChangePlanModal({
  isOpen,
  onClose,
  currentPlanId,
  onConfirm,
}: ChangePlanModalProps) {
  // Parse current plan to get initial billing cycle
  const currentCycle = currentPlanId.endsWith("_annually")
    ? "annually"
    : "monthly"

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    currentCycle,
  )
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlanId)
  const [isLoading, setIsLoading] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const cycle = currentPlanId.endsWith("_annually") ? "annually" : "monthly"
      setBillingCycle(cycle)
      setSelectedPlan(currentPlanId)
    }
  }, [isOpen, currentPlanId])

  // Check if selection differs from current plan
  const hasChanges = selectedPlan !== currentPlanId

  // Get selected plan info for the confirm button
  const getSelectedPlanInfo = () => {
    const planBase = selectedPlan
      .replace("_monthly", "")
      .replace("_annually", "")
    const plan = PRICE_PLANS.find((p) => p.id === planBase)
    if (!plan) return null

    const cycle = selectedPlan.endsWith("_annually") ? "annually" : "monthly"
    const price = plan.price[cycle]
    const cycleLabel = cycle === "monthly" ? "mo" : "yr"

    return {
      name: plan.name,
      price,
      cycleLabel,
    }
  }

  const handleConfirm = async () => {
    if (!hasChanges) return
    setIsLoading(true)
    try {
      await onConfirm(selectedPlan)
      onClose()
    } catch (error) {
      console.error("Failed to change plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedInfo = getSelectedPlanInfo()

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed flex backdrop-blur-md bg-zinc-950/80 justify-center items-center inset-0 z-9999 p-4"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-zinc-100 dark:bg-zinc-950 rounded-b-lg rounded-t-xl shadow-lg relative 
                         dark:ring-2 dark:ring-inset dark:ring-zinc-800 
                         max-h-[90vh] flex flex-col w-full max-w-7xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent bar */}
              <div className="w-full h-3 bg-indigo-600 dark:bg-indigo-500 rounded-t-lg"></div>

              {/* Header */}
              <div className="w-full px-6 lg:px-8 pb-4 pt-4 border-b-2 border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Change your plan
                  </h2>
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-4 text-zinc-600 dark:text-zinc-500 hover:cursor-pointer"
                    disabled={isLoading}
                  >
                    <XMarkIcon className="size-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] overscroll-contain px-6 lg:px-8 py-8 min-h-0">
                {/* Toggle switch */}
                <div className="flex justify-center pb-8">
                  <fieldset aria-label="Payment frequency">
                    <div className="relative flex items-center rounded-full bg-white dark:bg-zinc-950 ring-2 ring-zinc-300 dark:ring-zinc-700 ring-inset px-1 py-1 gap-2">
                      <div
                        className="absolute rounded-full bg-indigo-600 transition-all duration-200"
                        style={{
                          height: "calc(100% - 8px)",
                          top: "4px",
                          left:
                            billingCycle === "monthly"
                              ? "4px"
                              : "calc(50% + 4px)",
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
                            // Update selected plan to match new cycle
                            const planBase = selectedPlan
                              .replace("_monthly", "")
                              .replace("_annually", "")
                            setSelectedPlan(`${planBase}_monthly`)
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
                            // Update selected plan to match new cycle
                            const planBase = selectedPlan
                              .replace("_monthly", "")
                              .replace("_annually", "")
                            setSelectedPlan(`${planBase}_annually`)
                          }}
                          className="sr-only"
                        />
                        Annually
                      </label>
                    </div>
                  </fieldset>
                </div>

                {/* Plan tiles */}
                <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-4xl xl:grid-cols-2">
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
                        setSelectedPlan(`${tier.id}_${billingCycle}`)
                      }}
                    />
                  ))}
                </div>
                <div className="h-8" />
                {/* Spacer for sticky button */}

                {/* Sticky confirm button - only shows when there are changes */}
                <div className="sticky bottom-0 left-0 right-0 p-4">
                  <div className="max-w-md mx-auto">
                    <Button
                      variant={hasChanges ? "primary" : "secondary"}
                      className="w-full justify-center disabled:opacity-100 disabled:border-sky-600 dark:disabled:border-sky-500"
                      onClick={handleConfirm}
                      disabled={!hasChanges || isLoading}
                    >
                      {isLoading
                        ? "Updating..."
                        : hasChanges && selectedInfo
                          ? `Update to ${selectedInfo.name} – ${selectedInfo.price}/${selectedInfo.cycleLabel}`
                          : "Current Plan"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
