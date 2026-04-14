"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SlideDrawer from "@/components/ui/slide-drawer"
import { DocumentTextIcon } from "@heroicons/react/24/outline"
import type { Template } from "@/lib/validations/template"
import type { BidBlock } from "@/lib/validations/bid"

type TemplatePickerDrawerProps = {
  open: boolean
  onClose: () => void
  /** Title to use for the new bid (passed from NewBidModal) */
  bidTitle?: string
}

export default function TemplatePickerDrawer({
  open,
  onClose,
  bidTitle,
}: TemplatePickerDrawerProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState<string | null>(null)

  // Fetch templates when drawer opens
  useEffect(() => {
    if (open) {
      fetchTemplates()
    }
  }, [open])

  async function fetchTemplates() {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/templates")
      if (!res.ok) throw new Error("Failed to fetch templates")
      const data = await res.json()
      setTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSelectTemplate(template: Template) {
    setCreating(template.id)

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: template.blocks,
          title: bidTitle || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create bid")
      }

      const bid = await res.json()
      onClose()
      router.push(`/dashboard/bids/${bid.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setCreating(null)
    }
  }

  // Get block type summary for preview
  function getBlockSummary(blocks: BidBlock[]): string {
    const types = blocks.map((b) => {
      switch (b.type) {
        case "header":
          return "Header"
        case "content":
          return "Content"
        case "location":
          return "Location"
        case "stepTracker":
          return "Steps"
        case "pricing":
          return "Pricing"
        case "photo":
          return "Photos"
        default:
          return "Block"
      }
    })
    return types.join(" → ")
  }

  return (
    <SlideDrawer
      open={open}
      onClose={onClose}
      title="Choose a template"
      subtitle={
        bidTitle
          ? `Creating: ${bidTitle}`
          : "Select a template to start your new bid"
      }
      size="xl"
    >
      <div className="p-6">
        {/* Error state */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <DocumentTextIcon className="mx-auto size-16 text-zinc-300 dark:text-zinc-700" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              No templates yet
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              You haven&apos;t saved any templates. Create a bid and save it as
              a template to see it here.
            </p>
          </div>
        ) : (
          /* Template grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                disabled={!!creating}
                className="text-left p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {/* Template preview */}
                <div className="aspect-4/3 rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-3 p-3 overflow-hidden">
                  {creating === template.id ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="size-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {template.blocks.slice(0, 4).map((block, idx) => (
                        <div
                          key={idx}
                          className="h-3 rounded bg-zinc-200 dark:bg-zinc-700"
                          style={{
                            width: block.type === "header" ? "60%" : "100%",
                          }}
                        />
                      ))}
                      {template.blocks.length > 4 && (
                        <p className="text-xs text-zinc-400">
                          +{template.blocks.length - 4} more
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Template info */}
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {template.name}
                </h3>
                {template.description && (
                  <p className="mt-1 text-base text-gray-600 dark:text-gray-400 line-clamp-2">
                    {template.description}
                  </p>
                )}
                <p className="mt-2 text-base text-zinc-500 dark:text-zinc-500">
                  {getBlockSummary(template.blocks)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </SlideDrawer>
  )
}
