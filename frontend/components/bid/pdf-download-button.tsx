"use client"

import { useState } from "react"
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline"
import type { BidBlock } from "@/lib/validations/bid"
import { downloadBidPdf, viewBidPdf } from "@/lib/pdf"
import GhostButton from "@/components/ui/ghost-button"

interface PdfDownloadButtonProps {
  blocks: BidBlock[]
  filename?: string
  title?: string
  mode?: "download" | "view"
  variant?: "button" | "link"
  className?: string
}

export default function PdfDownloadButton({
  blocks,
  filename = "estimate.pdf",
  title,
  mode = "download",
  variant = "button",
  className = "",
}: PdfDownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    try {
      if (mode === "view") {
        await viewBidPdf(blocks, title)
      } else {
        await downloadBidPdf(blocks, filename, title)
      }
    } catch (err) {
      setError("Failed to generate PDF")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const buttonText = loading
    ? "Generating..."
    : mode === "view"
      ? "View PDF"
      : "Download PDF"

  if (variant === "link") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`text-indigo-600 dark:text-indigo-500 hover:underline font-medium disabled:opacity-50 ${className}`}
      >
        {buttonText}
      </button>
    )
  }

  return (
    <GhostButton onClick={handleClick} disabled={loading} className={className}>
      <DocumentArrowDownIcon className="size-5" />
      <span>{buttonText}</span>
    </GhostButton>
  )
}
