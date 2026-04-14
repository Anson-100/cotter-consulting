"use client"
import { motion } from "framer-motion"
import Portal from "./ui/portal"

type LoadingOverlayProps = {
  isVisible: boolean
  message?: string
}

export default function LoadingOverlay({
  isVisible,
  message = "Processing...",
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <Portal>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-indigo-500"></div>

          {/* Message */}
          <p className="text-lg font-semibold text-gray-100">{message}</p>
        </div>
      </motion.div>
    </Portal>
  )
}
