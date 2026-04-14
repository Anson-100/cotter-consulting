// app/(auth)/signup/_components/nav/FinalizeActions.tsx
"use client"
import Button from "@/components/ui/button"
import LoadingOverlay from "@/components/LoadingOverlay"
import { useRouter } from "next/navigation"
import { useSignupStore } from "../useSignupStore"
import { useAuthStore } from "@/lib/useAuthStore"
import { useState } from "react"

export default function FinalizeActions() {
  const router = useRouter()
  const { plan, profile, billing, paymentMethodId, stripeCustomerId, reset } =
    useSignupStore()
  const setHasProfile = useAuthStore((state) => state.setHasProfile)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFinalize = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/stripe/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          profile,
          billing,
          paymentMethodId,
          stripeCustomerId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to finalize signup")
      }

      // Clear the signup store
      reset()

      // Update auth store so navbar shows "Dashboard" immediately
      setHasProfile(true)

      // Navigate to dashboard - keep isLoading true, navigation will unmount
      router.push("/dashboard")
    } catch (err) {
      // Only reset loading state on error
      console.error("Finalize error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <>
      <LoadingOverlay
        isVisible={isLoading}
        message="Setting up your account..."
      />

      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col gap-2 items-start">
          <Button
            onClick={() => router.push("/signup/onboarding")}
            variant="secondary"
            disabled={isLoading}
          >
            Back
          </Button>
          <p className="text-gray-700 dark:text-gray-300">
            Return to the previous page
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <Button
            onClick={handleFinalize}
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Final confirmation"}
          </Button>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">All aboard!</p>
          )}
        </div>
      </div>
    </>
  )
}
