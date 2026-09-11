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
    "inline-flex font-sans items-center justify-center gap-2 rounded-full font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 active:translate-y-[1px] hover:cursor-pointer " +
    // Solid disabled state (no opacity). aria-disabled covers the <a> case.
    "disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:border-zinc-700 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 " +
    "aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:border-zinc-300 aria-disabled:bg-zinc-200 aria-disabled:text-zinc-400 dark:aria-disabled:border-zinc-700 dark:aria-disabled:bg-zinc-800 dark:aria-disabled:text-zinc-500"

  const sizes: Record<Size, string> = {
    md: "px-3.5 py-2 text-base",
    lg: "px-3.5 py-2 text-lg",
  }

  const variants: Record<Variant, string> = {
    primary:
      "border border-indigo-600 text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 dark:text-white dark:border-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:active:bg-indigo-700 focus-visible:ring-indigo-500",
    secondary:
      "border border-zinc-300 text-gray-900 bg-zinc-200 hover:bg-zinc-300 dark:text-gray-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900 focus-visible:ring-indigo-500",
    success:
      "border border-emerald-600 text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 dark:text-white dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:active:bg-emerald-700 focus-visible:ring-emerald-500",
    ghost:
      "border border-transparent text-gray-500 bg-transparent hover:text-gray-700 hover:bg-zinc-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-zinc-800 focus-visible:ring-indigo-500 disabled:bg-transparent disabled:border-transparent aria-disabled:bg-transparent aria-disabled:border-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent",
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
