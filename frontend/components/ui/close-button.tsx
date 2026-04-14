"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { twMerge } from "tailwind-merge"

interface CloseButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
  /** Screen reader label, defaults to "Close" */
  label?: string
}

export default function CloseButton({
  onClick,
  disabled = false,
  className = "",
  label = "Close",
}: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        "text-zinc-600 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <XMarkIcon className="size-6" />
      <span className="sr-only">{label}</span>
    </button>
  )
}
