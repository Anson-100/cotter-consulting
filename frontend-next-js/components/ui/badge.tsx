import { cn } from "@/lib/utils"

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "active"
  | "label"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success: cn(
    "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
    "dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-400/30",
  ),
  warning: cn(
    "bg-amber-100 text-amber-700 ring-amber-600/20",
    "dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-400/30",
  ),
  danger: cn(
    "bg-red-100 text-red-700 ring-red-600/20",
    "dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/30",
  ),
  active: cn(
    "bg-blue-100 text-blue-700 ring-blue-600/20",
    "dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30",
  ),
  neutral: cn(
    "bg-zinc-100 text-zinc-700 ring-zinc-600/20",
    "dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-400/30",
  ),
  label: cn(
    "bg-zinc-950/80 text-white ring-sky-600/40",
    "dark:bg-zinc-950/80 dark:text-white dark:ring-sky-500/40",
  ),
}

export default function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1",
        "text-base font-medium",
        "ring-1 ring-inset",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
