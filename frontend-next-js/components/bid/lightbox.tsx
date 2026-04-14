"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import Badge from "@/components/ui/badge"

interface LightboxPhoto {
  id: string
  url: string
  caption?: string
  category?: "before" | "after"
  categoryIndex?: number
}

interface LightboxProps {
  photos: LightboxPhoto[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
  sidebarPinned?: boolean
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
  sidebarPinned,
}: LightboxProps) {
  const currentPhoto = photos[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1
  const hasMultiple = photos.length > 1

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      onNavigate(currentIndex - 1)
    }
  }, [hasPrev, currentIndex, onNavigate])

  const handleNext = useCallback(() => {
    if (hasNext) {
      onNavigate(currentIndex + 1)
    }
  }, [hasNext, currentIndex, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose, handlePrev, handleNext])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const fadeVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  }

  // Format category badge text
  const getCategoryLabel = () => {
    if (!currentPhoto.category || !currentPhoto.categoryIndex) return null
    const category =
      currentPhoto.category.charAt(0).toUpperCase() +
      currentPhoto.category.slice(1)
    return `${category} ${currentPhoto.categoryIndex}`
  }

  return (
    <div
      className={`fixed inset-0 z-40 backdrop-blur-md bg-zinc-950/80 flex items-center justify-center ${
        sidebarPinned === true
          ? "lg:left-55"
          : sidebarPinned === false
            ? "lg:left-14"
            : ""
      }`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
      }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-4 z-10 text-zinc-400 hover:text-zinc-200"
      >
        <XMarkIcon className="size-6" />
        <span className="sr-only">Close</span>
      </button>

      {/* Counter */}
      {hasMultiple && (
        <div className="absolute top-6 left-4 z-999 px-4 py-2 rounded-full bg-zinc-900/80 text-white text-base font-medium">
          {currentIndex + 1} of {photos.length}
        </div>
      )}

      {/* Prev */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          disabled={!hasPrev}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-999 p-3 rounded-full text-white ${
            hasPrev
              ? "bg-zinc-900/40 hover:bg-zinc-900/40 backdrop-blur-xs "
              : "bg-zinc-900/10 "
          }`}
        >
          <ChevronLeftIcon className="size-8" />
        </button>
      )}

      {/* Next */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          disabled={!hasNext}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white ${
            hasNext
              ? "bg-zinc-900/40 hover:bg-zinc-900/40 backdrop-blur-xs "
              : "bg-zinc-900/10 "
          }`}
        >
          <ChevronRightIcon className="size-8" />
        </button>
      )}

      {/* Image with crossfade animation */}
      <div className="relative w-[90%] h-[85%] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt={currentPhoto.caption || "Photo"}
            className="max-w-full max-h-full object-contain rounded-lg"
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          />
        </AnimatePresence>
      </div>

      {/* Caption and Category Badge */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        {/* Category Badge */}
        {getCategoryLabel() && (
          <Badge variant="label">{getCategoryLabel()}</Badge>
        )}

        {/* Caption */}
        {currentPhoto.caption && (
          <div className="px-4 py-2 rounded-lg bg-white/10 text-white text-base">
            {currentPhoto.caption}
          </div>
        )}
      </div>
    </div>
  )
}
