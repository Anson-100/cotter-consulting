"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Portal from "./portal"

type DialogShellProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  /** Disable close button while loading */
  disableClose?: boolean
  /** Width variant */
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "sm:w-sm",
  md: "sm:w-md",
  lg: "sm:w-lg",
}

export default function DialogShell({
  open,
  onClose,
  title,
  subtitle,
  children,
  disableClose = false,
  size = "md",
}: DialogShellProps) {
  function handleClose() {
    if (!disableClose) onClose()
  }

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed flex backdrop-blur-md bg-zinc-950/80 justify-center items-center inset-0 z-9999 p-2"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className={`bg-zinc-100 dark:bg-zinc-950 rounded-xl shadow-lg relative 
                dark:ring-2 dark:ring-inset dark:ring-zinc-800 
                max-h-full flex flex-col w-full ${sizeClasses[size]} z-10000`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Indigo top bar */}
              <div className="w-full h-3 bg-indigo-600 dark:bg-indigo-500 rounded-t-xl shrink-0" />

              {/* Header */}
              <div className="w-full px-6 pb-4 pt-4 border-b-2 border-zinc-200 dark:border-zinc-800 shrink-0">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
                <button
                  onClick={handleClose}
                  disabled={disableClose}
                  className="absolute top-6 right-4 text-zinc-600 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XMarkIcon className="size-6" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              {/* Content - scrollable */}
              <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] overscroll-contain min-h-0">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
