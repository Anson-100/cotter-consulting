// src/components/ui/LogoLinkFooter.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/solid"

const LogoLinkFooter: React.FC = () => {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return isHomePage ? (
    <button
      onClick={scrollToTop}
      className="flex flex-col items-center justify-center"
    >
      <div className="flex items-center">
        <DocumentCurrencyDollarIcon className="h-10 text-indigo-600" />
        <div className="flex items-center text-white">
          <h1 className="text-5xl font-semibold m-0">Pirate</h1>
          <h1 className="text-5xl ml-1 text-gray-300">Ship</h1>
        </div>
      </div>
    </button>
  ) : (
    <Link href="/" className="flex items-center">
      <DocumentCurrencyDollarIcon className="h-10 text-indigo-600" />
      <div className="flex items-center text-white">
        <h1 className="text-5xl font-semibold m-0">Pirate</h1>
        <h1 className="text-5xl ml-1 text-gray-300">Ship</h1>
      </div>
    </Link>
  )
}

export default LogoLinkFooter
