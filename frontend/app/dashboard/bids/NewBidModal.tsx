"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DocumentIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import DialogShell from "@/components/ui/dialog-shell"
import FormInput from "@/components/ui/form-input"
import { getBlankBlocks } from "@/lib/bid-templates"

type NewBidModalProps = {
  open: boolean
  onClose: () => void
  onSelectTemplate: (title: string) => void
}

/**
 * Generate a fallback title for untitled bids.
 * Uses last 4 digits of timestamp for uniqueness.
 */
function generateUntitledName(): string {
  const suffix = Date.now().toString().slice(-4)
  return `Untitled bid #${suffix}`
}

export default function NewBidModal({
  open,
  onClose,
  onSelectTemplate,
}: NewBidModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleStartFromScratch() {
    setLoading(true)
    setError("")

    try {
      const blocks = getBlankBlocks()
      const bidTitle = title.trim() || generateUntitledName()

      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks, title: bidTitle }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create bid")
      }

      const bid = await res.json()
      handleClose()
      router.push(`/dashboard/bids/${bid.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  function handleStartFromTemplate() {
    const bidTitle = title.trim() || generateUntitledName()
    onSelectTemplate(bidTitle)
    handleClose()
  }

  function handleClose() {
    if (!loading) {
      setTitle("")
      setError("")
      onClose()
    }
  }

  return (
    <DialogShell
      open={open}
      onClose={handleClose}
      title="New bid"
      subtitle="How would you like to start?"
      disableClose={loading}
    >
      <div className="px-6 py-6 space-y-4">
        {/* Bid name input */}
        <FormInput
          id="bid-title"
          label="Bid name"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Johnson Deck Repair"
          disabled={loading}
        />

        {/* Start from scratch */}
        <button
          type="button"
          onClick={handleStartFromScratch}
          disabled={loading}
          className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div className="size-12 flex-none rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center ring-2 ring-zinc-200 dark:ring-zinc-700">
            {loading ? (
              <div className="size-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <DocumentIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Start from scratch
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Begin with blank bid
            </p>
          </div>
        </button>

        {/* Start from template */}
        <button
          type="button"
          onClick={handleStartFromTemplate}
          disabled={loading}
          className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div className="size-12 flex-none rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center ring-2 ring-zinc-200 dark:ring-zinc-700">
            <DocumentTextIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Start from template
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Click to choose a template
            </p>
          </div>
        </button>

        {error && (
          <p className="text-base text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </DialogShell>
  )
}
