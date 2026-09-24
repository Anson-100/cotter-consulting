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
    <div className="flex items-center gap-1 font-serif brightness-75 dark:brightness-100">
      <Image
        src="/images/cc-logo.png"
        alt=""
        width={64}
        height={64}
        priority
        className="h-8 w-auto shrink-0 sm:h-10"
      />

      <div
        className={cn(
          "flex flex-col items-start whitespace-nowrap",
          !isExpanded && "opacity-0",
        )}
      >
        <span className="text-xl leading-none font-bold tracking-wider text-gold sm:text-2xl">
          COTTER
        </span>

        <span className="-mt-0.5 -mr-[0.155em] text-[0.74rem] leading-none tracking-[0.155em] text-gold sm:text-[0.89rem]">
          CONSULTING
        </span>
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
