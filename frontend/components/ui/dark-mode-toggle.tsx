"use client"
import { useEffect, useState } from "react"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"
import {
  SunIcon as SunIconSolid,
  MoonIcon as MoonIconSolid,
} from "@heroicons/react/24/solid"
import { useDarkModeStore } from "@/lib/useDarkModeStore"
import { cn } from "@/lib/utils"

interface DarkModeToggleProps {
  className?: string
  children?: React.ReactNode
  isExpanded?: boolean
}

export default function DarkModeToggle({
  className,
  children,
  isExpanded = true,
}: DarkModeToggleProps) {
  const { isDark, mounted, toggleDarkMode, initialize } = useDarkModeStore()
  const [justClicked, setJustClicked] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleClick = () => {
    toggleDarkMode()
    setJustClicked(true)
    setTimeout(() => setJustClicked(false), 1000)
  }

  if (!mounted) return null

  return (
    <button
      onClick={handleClick}
      className={cn("group", className)}
      aria-label="Toggle Dark Mode"
      title={!isExpanded ? "Theme" : undefined}
    >
      {isDark ? (
        justClicked ? (
          <MoonIconSolid className="size-6 shrink-0 text-sky-300" />
        ) : (
          <SunIcon className="size-6 shrink-0 text-gray-400" />
        )
      ) : justClicked ? (
        <SunIconSolid className="size-6 shrink-0 text-yellow-500" />
      ) : (
        <MoonIcon className="size-6 shrink-0 text-gray-400" />
      )}
      {children && (
        <span
          className={cn("whitespace-nowrap ml-3", !isExpanded && "opacity-0")}
        >
          {children}
        </span>
      )}
    </button>
  )
}
