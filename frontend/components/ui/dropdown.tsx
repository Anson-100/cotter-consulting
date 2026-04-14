// components/ui/dropdown.tsx
"use client"

import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import { cn } from "@/lib/utils"

interface DropdownProps<T extends string> {
  options: T[]
  value: T
  onChange: (value: T) => void
  label?: string // NEW: static label that overrides displayed value (for action menus)
  buttonClassName?: string
  menuClassName?: string
  anchor?: "top" | "bottom"
}

export default function Dropdown<T extends string>({
  options,
  value,
  onChange,
  label,
  buttonClassName,
  menuClassName,
  anchor = "bottom",
}: DropdownProps<T>) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton
          className={cn(
            "flex flex-row-reverse justify-between items-center gap-x-1.5",
            "rounded-md px-3.5 py-2.5",
            "bg-white dark:bg-zinc-950",
            "text-gray-600 dark:text-gray-300",
            "ring-inset outline-2 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700",
            "focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500",
            "w-full",
            buttonClassName
          )}
        >
          <ChevronDownIcon className="-mr-1 shrink-0 size-5 text-gray-400" />
          <span className="truncate">{label ?? value}</span>
        </ListboxButton>

        <ListboxOptions
          className={cn(
            // Base styles
            "absolute left-0 z-10 rounded-md",
            "bg-white dark:bg-zinc-950 shadow-lg",
            "ring-2 ring-zinc-200 dark:ring-zinc-700",
            "focus:outline-none overflow-hidden",
            // Anchor positioning
            anchor === "bottom"
              ? "mt-2 origin-top"
              : "mb-2 bottom-full origin-bottom",
            // Default width
            "w-full",
            // User overrides (comes last so they win)
            menuClassName
          )}
        >
          {options.map((option) => (
            <ListboxOption
              key={option}
              value={option}
              className="block cursor-pointer px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-800"
            >
              {({ selected }) => (
                <span className="flex justify-between items-center gap-2">
                  <span className="truncate">{option}</span>
                  {selected && (
                    <CheckIcon className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-500" />
                  )}
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
