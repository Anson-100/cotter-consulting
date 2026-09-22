"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
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
      <Image
        src="/images/cc-logo.png"
        alt=""
        width={64}
        height={64}
        priority
        className="h-8 w-auto shrink-0 sm:h-10 brightness-75 dark:brightness-100"
      />

      <div
        className={cn(
          "flex flex-col items-start whitespace-nowrap text-xl sm:text-2xl",
          !isExpanded && "opacity-0",
        )}
      >
        <h1 className="m-0 leading-none text-succulent dark:brightness-200">
          Cotter
        </h1>

        <h1 className="-mt-1 sm:-mt-1.5 leading-none text-gold brightness-75 dark:brightness-100">
          Consulting
        </h1>
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
