"use client"

import { cn } from "@/lib/utils"

interface SidebarSectionHeaderProps {
  label: string
  isExpanded: boolean
}

export default function SidebarSectionHeader({
  label,
  isExpanded,
}: SidebarSectionHeaderProps) {
  // Fixed height ALWAYS, same position ALWAYS
  // Text just fades, no layout change
  return (
    <div className="h-6 mb-2 flex items-center">
      <span
        className={cn(
          " text-gray-400 whitespace-nowrap",
          !isExpanded && "opacity-0"
        )}
      >
        {label}
      </span>
    </div>
  )
}
