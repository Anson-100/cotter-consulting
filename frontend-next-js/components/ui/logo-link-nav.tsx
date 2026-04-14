"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/solid"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

interface LogoLinkProps {
  isExpanded?: boolean
}

const LogoLink: React.FC<LogoLinkProps> = ({ isExpanded = true }) => {
  const pathname = usePathname()
  const router = useRouter()
  const lowerCasePage = "home"
  const isHomePage = pathname === "/"

  const handleScrollHome = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const section = document.getElementById(lowerCasePage)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      } else {
        router.push("/")
      }
    },
    [router],
  )

  const handleNavigateHome = useCallback(() => {
    sessionStorage.setItem("selectedPage", lowerCasePage)
    router.push("/")
  }, [router])

  const Logo = (
    <div className="flex items-center dark:text-gray-100">
      <DocumentCurrencyDollarIcon className="h-4 sm:h-6 text-indigo-600 shrink-0" />
      <div
        className={cn(
          "text-pretty leading-none flex flex-row sm:items-center text-lg sm:text-2xl whitespace-nowrap",
          !isExpanded && "opacity-0",
        )}
      >
        <h1 className="font-semibold m-0 leading-none">Pirate</h1>
        <h1 className=" dark:text-gray-300 leading-none">Ship</h1>
      </div>
    </div>
  )

  return isHomePage ? (
    <a href={`#${lowerCasePage}`} onClick={handleScrollHome}>
      {Logo}
    </a>
  ) : (
    <Link href="/" onClick={handleNavigateHome}>
      {Logo}
    </Link>
  )
}

export default LogoLink
