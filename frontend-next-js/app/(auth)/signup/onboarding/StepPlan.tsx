"use client"

import PriceTilesOnboarding from "@/components/PriceTilesOnboarding"

type StepPlanProps = {
  registerValidate?: (fn: () => boolean) => void
}

export default function StepPlan({ registerValidate }: StepPlanProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <PriceTilesOnboarding registerValidate={registerValidate} />
    </div>
  )
}
