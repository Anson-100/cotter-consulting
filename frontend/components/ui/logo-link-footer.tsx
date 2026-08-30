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

  return isHomePage ? (
    <button
      onClick={scrollToTop}
      className="flex flex-col items-center justify-center font-serif"
    >
      <div className="flex items-center">
        <ScaleIcon className="h-10 text-indigo-600 mr-2" />
        <div className="flex items-center gap-1 text-white">
          <h1 className="text-5xl  m-0">Cotter</h1>
          <h1 className="text-5xl ml-1 text-gray-300">Consulting</h1>
        </div>
      </div>
    </button>
  ) : (
    <Link href="/" className="flex items-center">
      <ScaleIcon className="h-10 text-indigo-600" />
      <div className="flex items-center gap-1 text-white">
        <h1 className="text-5xl  m-0">Cotter</h1>
        <h1 className="text-5xl ml-1 text-gray-300">Consulting</h1>
      </div>
    </Link>
  )
}

export default LogoLinkFooter
