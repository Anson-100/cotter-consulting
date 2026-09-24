// src/components/ui/LogoLinkFooter.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const LogoLinkFooter: React.FC = () => {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const content = (
    <div className="flex flex-col items-center gap-2 font-serif">
      <Image
        src="/images/cc-logo.png"
        alt=""
        width={128}
        height={128}
        className="h-16 w-auto shrink-0 sm:h-20"
      />

      <div className="flex flex-col items-center whitespace-nowrap">
        <span className="text-4xl leading-none font-bold tracking-wider text-gold sm:text-5xl">
          COTTER
        </span>
        <span className="-mt-0.5 -mr-[0.155em] text-[1.33rem] leading-none tracking-[0.155em] text-gold sm:text-[1.78rem]">
          CONSULTING
        </span>
      </div>
    </div>
  )

  return isHomePage ? (
    <button
      onClick={scrollToTop}
      className="flex max-w-full items-center justify-center"
    >
      {content}
    </button>
  ) : (
    <Link href="/" className="flex max-w-full items-center justify-center">
      {content}
    </Link>
  )
}

export default LogoLinkFooter
