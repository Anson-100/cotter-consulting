"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ScaleIcon } from "@heroicons/react/24/solid"
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
    <div className="flex items-center gap-1 font-serif dark:text-gray-100">
      <ScaleIcon className="h-4 shrink-0 text-indigo-600 sm:h-6" />

      <div
        className={cn(
          "flex flex-col items-start whitespace-nowrap text-lg sm:text-2xl",
          !isExpanded && "opacity-0",
        )}
      >
        <h1 className="m-0 leading-none text-succulent brightness-200">
          Cotter
        </h1>

        <h1 className="-mt-1.5 leading-none text-gold">Consulting</h1>
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
