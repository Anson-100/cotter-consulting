"use client"

import { useState } from "react"
import DialogShell from "@/components/ui/dialog-shell"
import Button from "@/components/ui/button"
import { CheckIcon } from "@heroicons/react/24/solid"

type Step = "confirm" | "success"

interface ConfirmCompleteModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function ConfirmCompleteModal({
  open,
  onClose,
  onConfirm,
}: ConfirmCompleteModalProps) {
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
    if (step === "success") return "Job Complete!"
    return "Mark job as complete?"
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
              This will mark the job as complete and update its status.
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
                variant="success"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 justify-center"
              >
                {isSubmitting ? "Updating..." : "Yes, Complete"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Success */}
        {step === "success" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-emerald-200/60 dark:bg-emerald-900/30 ring-2 ring-emerald-400 dark:ring-emerald-800 rounded-full flex items-center justify-center">
                <CheckIcon className="size-8 text-emerald-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                This job has been marked as complete.
              </p>
            </div>

            <Button
              variant="primary"
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
