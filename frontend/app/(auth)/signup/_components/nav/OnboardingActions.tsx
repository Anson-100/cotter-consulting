// app/(auth)/signup/_components/nav/OnboardingActions.tsx
"use client"

import Button from "@/components/ui/button"
import { useState } from "react"

export default function OnboardingActions({
  onNext,
}: {
  onNext: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await onNext()
    } catch (err) {
      console.error("Onboarding navigation error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full justify-between items-center">
      {/* LEFT SIDE */}
      <div className="flex flex-col items-start">
        <Button
          onClick={() => window.history.back()}
          variant="secondary"
          disabled={isLoading}
        >
          Back
        </Button>
        <p className="text-gray-700 dark:text-gray-300"></p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col items-end">
        <Button onClick={handleNext} variant="primary" disabled={isLoading}>
          {isLoading ? "Processing..." : "Save and continue"}
        </Button>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-700 dark:text-gray-300"></p>
        )}
      </div>
    </div>
  )
}
