"use client"

import { useState } from "react"
import DialogShell from "@/components/ui/dialog-shell"
import Button from "@/components/ui/button"
import { XMarkIcon } from "@heroicons/react/24/solid"

type Step = "confirm" | "success"

interface ConfirmDeclineModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function ConfirmDeclineModal({
  open,
  onClose,
  onConfirm,
}: ConfirmDeclineModalProps) {
  const [step, setStep] = useState<Step>("confirm")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setStep("confirm")
    setError(null)
    onClose()
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await onConfirm()
      setStep("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitle = () => {
    if (step === "success") return "Bid Declined"
    return "Decline this bid?"
  }

  return (
    <DialogShell
      open={open}
      onClose={handleClose}
      title={getTitle()}
      disableClose={isSubmitting}
      size="sm"
    >
      <div className="p-6">
        {/* Step 1: Confirm */}
        {step === "confirm" && (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              The contractor will be notified that you've declined.
            </p>

            {error && (
              <p className="text-red-600 text-center">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 justify-center"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 justify-center"
              >
                {isSubmitting ? "Declining..." : "Yes, Decline"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Success */}
        {step === "success" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-zinc-200 dark:bg-zinc-800 ring-2 ring-zinc-300 dark:ring-zinc-700 rounded-full flex items-center justify-center">
                <XMarkIcon className="size-8 text-zinc-500 dark:text-zinc-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                This bid has been declined. The contractor has been notified.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={handleClose}
              className="w-full justify-center"
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </DialogShell>
  )
}
