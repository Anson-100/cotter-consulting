// src/components/ui/LogoLinkFooter.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScaleIcon } from "@heroicons/react/24/solid"

const LogoLinkFooter: React.FC = () => {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const content = (
    <div className="flex max-w-full flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3">
      <ScaleIcon className="h-10 shrink-0 text-indigo-600 sm:h-12" />
      <div className="flex flex-col items-center leading-[0.95] sm:flex-row sm:items-baseline sm:gap-2">
        <span className="text-5xl text-white sm:text-5xl lg:text-6xl">
          Cotter
        </span>
        <span className="text-5xl text-gray-300 sm:text-5xl lg:text-6xl">
          Consulting
        </span>
      </div>
    </div>
  )

  return isHomePage ? (
    <button
      onClick={scrollToTop}
      className="flex max-w-full items-center justify-center font-serif"
    >
      {content}
    </button>
  ) : (
    <Link href="/" className="flex max-w-full items-center font-serif">
      {content}
    </Link>
  )
}

export default LogoLinkFooter
