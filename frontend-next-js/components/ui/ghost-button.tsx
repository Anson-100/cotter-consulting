// components/ui/ghost-button.tsx

import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type BaseProps = {
  children: React.ReactNode
  className?: string
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
    target?: never
  }

type LinkProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string
    target?: string
  }

type GhostButtonProps = ButtonProps | LinkProps

function isLink(props: GhostButtonProps): props is LinkProps {
  return "href" in props && props.href !== undefined
}

export default function GhostButton(props: GhostButtonProps) {
  const { children, className, ...rest } = props

  const baseStyles = cn(
    "flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold",
    "text-gray-600 dark:text-gray-300",
    "hover:text-indigo-600 dark:hover:text-indigo-500",
    "hover:bg-zinc-100 dark:hover:bg-zinc-800",
    "disabled:opacity-50 disabled:pointer-events-none",
    className
  )

  if (isLink(props)) {
    const { href, target, ...linkRest } = rest as LinkProps
    return (
      <Link href={href} target={target} className={baseStyles} {...linkRest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={baseStyles} {...(rest as ButtonProps)}>
      {children}
    </button>
  )
}
