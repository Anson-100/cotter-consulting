"use client"
import Button from "@/components/ui/button"
import {
  CheckIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

type FooterMode = "live" | "preview" | "editor"

interface BidActionFooterProps {
  bidId: string
  mode?: FooterMode
  contactPhone?: string
  contactEmail?: string
  onAccept?: () => void
  onDecline?: () => void
  onQuestions?: () => void
}

export default function BidActionFooter({
  bidId,
  mode = "live",
  contactPhone,
  contactEmail,
  onAccept,
  onDecline,
  onQuestions,
}: BidActionFooterProps) {
  const isDisabled = mode !== "live"

  // Editor mode: muted/grayed out appearance
  const editorStyles = mode === "editor" ? "opacity-50 pointer-events-none" : ""
  // Preview mode: normal appearance but non-interactive
  const previewStyles = mode === "preview" ? "pointer-events-none" : ""

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 ${editorStyles} ${previewStyles}`}
    >
      {/* Mode indicator for preview */}
      {mode === "preview" && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-lg bg-zinc-700 text-zinc-300 text-base font-medium">
          Customer action buttons
        </div>
      )}

      <div className="w-11/12 lg:max-w-7xl mx-auto py-2">
        {/* Mobile: single row with Accept + icon buttons, Desktop: full buttons */}
        <div className="flex gap-3 items-center">
          {/* Accept - always full button (the money action) */}
          <Button
            variant="success"
            size="lg"
            onClick={onAccept}
            disabled={isDisabled}
            className="flex-1 sm:flex-none sm:w-auto"
          >
            <CheckIcon className="size-5" />
            Accept bid
          </Button>

          {/* Questions - icon-only on mobile, full button on desktop */}
          <Button
            variant="secondary"
            size="lg"
            onClick={onQuestions}
            disabled={isDisabled}
            className="sm:w-auto"
            aria-label="I have questions"
          >
            <ChatBubbleLeftRightIcon className="size-5" />
            <span className="hidden sm:inline">I have questions</span>
          </Button>

          {/* Decline - icon-only on mobile, full button on desktop */}
          <Button
            variant="ghost"
            size="lg"
            onClick={onDecline}
            disabled={isDisabled}
            className="sm:w-auto"
            aria-label="Decline bid"
          >
            <XMarkIcon className="size-5" />
            <span className="hidden sm:inline">Decline</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
