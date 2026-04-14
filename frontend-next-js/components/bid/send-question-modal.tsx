"use client"

import { useState } from "react"
import DialogShell from "@/components/ui/dialog-shell"
import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"
import { CheckIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid"

type Step = "compose" | "success"

interface SendQuestionModalProps {
  open: boolean
  onClose: () => void
  onSend: (message: string, email: string) => Promise<void>
  existingEmail?: string
  /** Pre-fill message for "changed your mind" flow */
  defaultMessage?: string
}

export default function SendQuestionModal({
  open,
  onClose,
  onSend,
  existingEmail,
  defaultMessage = "",
}: SendQuestionModalProps) {
  const [step, setStep] = useState<Step>("compose")
  const [message, setMessage] = useState(defaultMessage)
  const [email, setEmail] = useState(existingEmail || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setStep("compose")
    setMessage(defaultMessage)
    setEmail(existingEmail || "")
    setError(null)
    onClose()
  }

  const handleSend = async () => {
    if (!message.trim()) {
      setError("Please enter a message")
      return
    }
    if (!email.trim()) {
      setError("Please enter your email so they can reply")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSend(message, email)
      setStep("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitle = () => {
    if (step === "success") return "Message Sent!"
    return "Send a message"
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
        {/* Step 1: Compose */}
        {step === "compose" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400 dark:ring-indigo-700 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            {/* Message textarea */}
            <div>
              <label
                htmlFor="question-message"
                className="block font-medium text-gray-800 dark:text-gray-200 mb-2"
              >
                Your message
              </label>
              <textarea
                id="question-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What questions do you have about this bid?"
                className="w-full px-3 py-2 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 resize-none"
                autoFocus
              />
            </div>

            <FormInput
              label="Your email (for reply)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />

            {error && (
              <p className="text-red-600 text-center">{error}</p>
            )}

            <Button
              variant="primary"
              onClick={handleSend}
              disabled={isSubmitting || !message.trim() || !email.trim()}
              className="w-full justify-center mt-2"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
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
                Your message has been sent. The contractor will get back to you at{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {email}
                </span>
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
