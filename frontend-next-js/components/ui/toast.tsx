// components/ui/toast.tsx
"use client"
import { useEffect, useState, useRef } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid"

// VARIANT CONFIG — ADD NEW TYPES HERE =====================================
const variants = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-800 dark:text-emerald-200",
    border: "border-emerald-300 dark:border-emerald-700",
    icon: CheckCircleIcon,
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-800 dark:text-red-200",
    border: "border-red-300 dark:border-red-700",
    icon: XCircleIcon,
    iconColor: "text-red-500 dark:text-red-400",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-800 dark:text-amber-200",
    border: "border-amber-300 dark:border-amber-700",
    icon: ExclamationTriangleIcon,
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  info: {
    bg: "bg-sky-50 dark:bg-sky-900/20",
    text: "text-sky-800 dark:text-sky-200",
    border: "border-sky-300 dark:border-sky-700",
    icon: InformationCircleIcon,
    iconColor: "text-sky-500 dark:text-sky-400",
  },
} as const

type ToastType = keyof typeof variants

interface ToastProps {
  message: string
  type?: ToastType
  onDismiss: () => void
  duration?: number
  /** When true, shows a spinner instead of the icon and holds the toast open */
  loading?: boolean
}

export default function Toast({
  message,
  type = "success",
  onDismiss,
  duration = 5000,
  loading = false,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const variant = variants[type]
  const Icon = variant.icon

  // MOUNT → SLIDE IN =====================================================
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  // AUTO-DISMISS — only starts countdown when not loading =================
  useEffect(() => {
    // Clear any existing timer when loading state changes
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!loading) {
      timerRef.current = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300)
      }, duration)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [loading, duration, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-9999 max-w-sm w-full
        border-2 rounded-lg p-3 backdrop-blur-xl shadow-lg
        flex items-center gap-3
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        ${variant.bg} ${variant.text} ${variant.border}
      `}
    >
      {loading ? (
        <div
          className={`size-5 shrink-0 border-2 border-current border-t-transparent rounded-full animate-spin ${variant.iconColor}`}
        />
      ) : (
        <Icon className={`size-5 shrink-0 ${variant.iconColor}`} />
      )}
      <p className="flex-1 font-medium">{message}</p>
      {!loading && (
        <button
          onClick={handleDismiss}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <XMarkIcon className="size-5" />
        </button>
      )}
    </div>
  )
}
