"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Portal from "./portal"

type SlideDrawerProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  /** Width variant */
  size?: "md" | "lg" | "xl" | "full"
}

const sizeClasses = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full",
}

export default function SlideDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "xl",
}: SlideDrawerProps) {
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            {/* Drawer panel */}
            <motion.div
              className={`fixed top-0 right-0 h-full z-50 w-full ${sizeClasses[size]} bg-zinc-100 dark:bg-zinc-950 shadow-2xl flex flex-col border-l-2 border-zinc-200 dark:border-zinc-800`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="shrink-0 px-6 py-5 border-b-2 border-zinc-200 dark:border-zinc-800 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -m-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 "
                >
                  <XMarkIcon className="size-6" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              {/* Content - scrollable */}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}
