"use client"

import { useState } from "react"
import DialogShell from "@/components/ui/dialog-shell"
import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"
import { CheckIcon, EnvelopeIcon } from "@heroicons/react/24/solid"

type Step = "confirm" | "email" | "success"

interface ConfirmAcceptModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (email?: string) => Promise<void>
  existingEmail?: string
}

export default function ConfirmAcceptModal({
  open,
  onClose,
  onConfirm,
  existingEmail,
}: ConfirmAcceptModalProps) {
  const [step, setStep] = useState<Step>("confirm")
  const [email, setEmail] = useState(existingEmail || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    // Only allow close on confirm step or success step
    if (step === "confirm" || step === "success") {
      setStep("confirm")
      setEmail(existingEmail || "")
      setError(null)
      onClose()
    }
  }

  const handleConfirm = async () => {
    setStep("email")
  }

  const handleSendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onConfirm(email)
      setStep("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
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
    if (step === "success") return "Bid Approved!"
    if (step === "email") return "Get a confirmation"
    return "Confirm Approval"
  }

  return (
    <DialogShell
      open={open}
      onClose={handleClose}
      title={getTitle()}
      disableClose={step === "email" && isSubmitting}
      size="sm"
    >
      <div className="p-6">
        {/* Step 1: Confirm */}
        {step === "confirm" && (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              You're about to accept this bid.{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                This cannot be undone.
              </span>
            </p>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="flex-1 justify-center"
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleConfirm}
                className="flex-1 justify-center"
              >
                Yes, Accept
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Email capture */}
        {step === "email" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400 dark:ring-indigo-700 rounded-full flex items-center justify-center">
                <EnvelopeIcon className="size-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your email to receive a confirmation for your records.
              </p>
            </div>

            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoFocus
            />

            {error && <p className="text-red-600 text-center">{error}</p>}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="flex-1 justify-center"
              >
                Skip
              </Button>
              <Button
                variant="primary"
                onClick={handleSendConfirmation}
                disabled={isSubmitting || !email}
                className="flex-1 justify-center"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-emerald-200/60 dark:bg-emerald-900/30 ring-2 ring-emerald-400 dark:ring-emerald-800 rounded-full flex items-center justify-center">
                <CheckIcon className="size-8 text-emerald-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Your approval has been recorded. The contractor has been
                notified.
              </p>
              {email && (
                <p className="text-gray-500 dark:text-gray-400">
                  A confirmation was sent to{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {email}
                  </span>
                </p>
              )}
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
