interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse ${className}`}
    />
  )
}
