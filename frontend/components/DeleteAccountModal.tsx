"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import Button from "@/components/ui/button"

type DeleteAccountModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  userEmail?: string
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const CONFIRM_PHRASE = "DELETE"
  const isConfirmValid = confirmText === CONFIRM_PHRASE

  // Reset state and close modal
  const handleClose = useCallback(() => {
    if (isDeleting) return
    setConfirmText("")
    setError(null)
    setIsDeleting(false)
    onClose()
  }, [isDeleting, onClose])

  const handleConfirm = async () => {
    if (!isConfirmValid || isDeleting) return

    setIsDeleting(true)
    setError(null)

    try {
      await onConfirm()
    } catch (err) {
      console.error("Delete account error:", err)
      setError(err instanceof Error ? err.message : "Failed to delete account")
      setIsDeleting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed flex backdrop-blur-sm justify-center items-center inset-0 z-9999 p-2 bg-black/60 dark:bg-black/90"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <motion.div
            className="bg-zinc-100 dark:bg-zinc-950 rounded-b-lg rounded-t-xl shadow-lg relative 
                       dark:ring-2 dark:ring-inset dark:ring-zinc-800 
                       max-h-full flex flex-col w-full sm:w-md z-10000"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => {
              if (isOpen) inputRef.current?.focus()
            }}
          >
            {/* Red warning banner */}
            <div className="w-full h-3 bg-red-600 dark:bg-red-500 rounded-t-lg" />

            {/* Header */}
            <div className="w-full px-6 lg:px-8 pb-4 pt-4 border-b-2 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="shrink-0 p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Delete your account?
                </h2>
              </div>
              {!isDeleting && (
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-4 text-gray-500 hover:text-gray-800 text-xl hover:cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] overscroll-contain px-6 lg:px-8 pb-8 min-h-0">
              <div className="mx-auto w-full max-w-sm lg:w-96 mt-10">
                {/* Warning message */}
                <p className="text-gray-700 dark:text-gray-200">
                  This action cannot be undone. All of your data will be
                  permanently removed.
                </p>

                {/* Warning details */}
                <div className="mt-6 rounded-md bg-red-100 dark:bg-red-900/20 p-4 border-2 border-red-200 dark:border-red-800">
                  <ul className="text-red-800 dark:text-red-300 space-y-2">
                    <li>• Your subscription will be cancelled immediately</li>
                    <li>
                      • All bids, contacts, and records will be permanently
                      deleted
                    </li>
                    <li>• Your organization data will be removed</li>
                    <li>• This cannot be recovered</li>
                  </ul>
                </div>

                {/* Confirmation input */}
                <div className="mt-6">
                  <label
                    htmlFor="confirm-delete"
                    className="block font-semibold text-gray-800 dark:text-gray-300"
                  >
                    Type{" "}
                    <span className="font-mono font-bold text-red-600 dark:text-red-500">
                      DELETE
                    </span>{" "}
                    to confirm
                  </label>
                  <input
                    ref={inputRef}
                    id="confirm-delete"
                    type="text"
                    value={confirmText}
                    onChange={(e) =>
                      setConfirmText(e.target.value.toUpperCase())
                    }
                    disabled={isDeleting}
                    placeholder="DELETE"
                    className="mt-2 block w-full rounded-md border-2 border-zinc-200 dark:border-zinc-700 
                               bg-white dark:bg-zinc-950 px-3 py-2 font-mono
                               text-gray-900 dark:text-gray-100 placeholder-gray-400
                               focus:border-red-500 focus:ring-red-500 focus:outline-none
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {userEmail && (
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Deleting account for: {userEmail}
                    </p>
                  )}
                </div>

                {/* Error message */}
                {error && <p className="text-red-600 mt-4">{error}</p>}

                {/* Action buttons */}
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleConfirm}
                    disabled={!isConfirmValid || isDeleting}
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 
                               font-semibold text-white transition-all
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 
                               focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900
                               active:translate-y-px
                               ${
                                 isConfirmValid && !isDeleting
                                   ? "border-3 border-red-700 bg-red-600 hover:bg-red-700 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]"
                                   : "border-3 border-red-300 dark:border-red-900 bg-red-300 dark:bg-red-900/50 cursor-not-allowed"
                               }`}
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete my account"
                    )}
                  </button>

                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isDeleting}
                    className="w-full justify-center"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
