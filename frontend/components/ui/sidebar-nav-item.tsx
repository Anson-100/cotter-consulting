"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ComponentType } from "react"

interface SidebarNavItemProps {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  iconSolid?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  label: string
  isExpanded: boolean
  isActive?: boolean
  href?: string
  onClick?: () => void
  variant?: "default" | "newProject"
}

export default function SidebarNavItem({
  icon,
  iconSolid,
  label,
  isExpanded,
  isActive = false,
  href,
  onClick,
  variant = "default",
}: SidebarNavItemProps) {
  const isNewProject = variant === "newProject"

  // Use solid icon when active (if provided), otherwise use outline
  const Icon = isActive && iconSolid ? iconSolid : icon

  // Base classes - ALWAYS same layout structure, icon never moves
  const baseClasses =
    "group flex items-center rounded-md p-2 font-semibold w-full text-left"

  // Style classes based on active state and variant
  const styleClasses = cn(
    isNewProject
      ? "bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-succulent dark:hover:text-succulent text-gray-600 dark:text-gray-300"
      : isActive
      ? "bg-white text-succulent dark:bg-zinc-950 dark:text-succulent dark:hover:bg-zinc-900"
      : "text-gray-600 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-succulent dark:hover:text-succulent"
  )

  // Icon classes based on variant and active state
  const iconClasses = cn(
    "size-6 shrink-0",
    isNewProject
      ? "rounded-full ring-3 ring-succulent text-white bg-succulent hover:bg-succulent/90 active:bg-succulent/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] dark:text-white dark:ring-succulent dark:bg-succulent/90 dark:hover:bg-succulent"
      : isActive
      ? "text-succulent dark:text-succulent"
      : "text-gray-400 group-hover:text-succulent dark:group-hover:text-succulent"
  )

  // Content - icon ALWAYS in same position, text just gets clipped by outer container
  const content = (
    <>
      <Icon aria-hidden={true} className={iconClasses} />
      <span
        className={cn("whitespace-nowrap ml-3", !isExpanded && "opacity-0")}
      >
        {label}
      </span>
    </>
  )

  // Render as Link if href provided, otherwise as button
  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseClasses, styleClasses)}
        onClick={onClick}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseClasses, styleClasses)}
    >
      {content}
    </button>
  )
}
