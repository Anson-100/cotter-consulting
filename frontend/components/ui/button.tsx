"use client"

import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Variant = "primary" | "secondary" | "success" | "ghost"
type Size = "md" | "lg"

type ButtonProps<T extends ElementType> = {
  as?: T
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "variant" | "size" | "className" | "children"
>

export default function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps<T>) {
  const Component = as || "button"
  const isLink = Component === "a"

  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 active:translate-y-[1px] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"

  const sizes: Record<Size, string> = {
    md: "px-3.5 py-2 text-base",
    lg: "px-3.5 py-2 text-lg",
  }

  const variants: Record<Variant, string> = {
    primary:
      "border-3 border-indigo-600 text-white bg-indigo-500 hover:bg-indigo-500/90 active:bg-indigo-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] dark:text-white dark:border-indigo-500 dark:bg-indigo-600/90 dark:hover:bg-indigo-600 focus-visible:ring-indigo-500",
    secondary:
      "border-3 border-zinc-300 text-gray-900 bg-zinc-200 hover:bg-zinc-300 dark:text-gray-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900 focus-visible:ring-indigo-500",
    success:
      "border-3 border-emerald-600 text-white bg-emerald-500 hover:bg-emerald-500/90 active:bg-emerald-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] dark:text-white dark:border-emerald-500 dark:bg-emerald-600/90 dark:hover:bg-emerald-600 focus-visible:ring-emerald-500",
    ghost:
      "border-3 border-transparent text-gray-500 bg-transparent hover:text-gray-700 hover:bg-zinc-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-zinc-800 focus-visible:ring-indigo-500",
  }

  const linkDisabledProps =
    isLink && disabled
      ? {
          "aria-disabled": true,
          tabIndex: -1,
          onClick: (e: React.MouseEvent) => e.preventDefault(),
        }
      : {}

  return (
    // @ts-expect-error - Polymorphic component type resolution with React 19
    <Component
      className={twMerge(base, sizes[size], variants[variant], className)}
      {...(isLink ? linkDisabledProps : { disabled })}
      {...rest}
    >
      {children}
    </Component>
  )
}
