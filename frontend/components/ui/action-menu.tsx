// components/ui/action-menu.tsx
"use client"

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import { cn } from "@/lib/utils"
import { ComponentType } from "react"

interface ActionMenuOption {
  label: string
  icon: ComponentType<{ className?: string }>
  onClick: () => void
}

interface ActionMenuProps {
  label: string
  icon: ComponentType<{ className?: string }>
  options: ActionMenuOption[]
  buttonClassName?: string
  menuClassName?: string
  anchor?: "top" | "bottom"
}

export default function ActionMenu({
  label,
  icon: ButtonIcon,
  options,
  buttonClassName,
  menuClassName,
  anchor = "bottom",
}: ActionMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className={cn(
          "flex items-center gap-x-3 rounded-md p-2",
          "text-gray-600 dark:text-gray-300",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800",
          "hover:text-indigo-600 dark:hover:text-indigo-500",
          "",
          buttonClassName
        )}
      >
        <ButtonIcon className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-500" />
        <span>{label}</span>
      </MenuButton>

      <MenuItems
        className={cn(
          "absolute z-50 rounded-md py-1",
          "bg-white dark:bg-zinc-950 shadow-lg",
          "ring-2 ring-zinc-200 dark:ring-zinc-700",
          "focus:outline-none overflow-hidden",
          anchor === "bottom"
            ? "mt-2 origin-top-left left-0"
            : "mb-2 bottom-full origin-bottom-left left-0",
          "min-w-[180px]",
          menuClassName
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.label}>
            {({ active }) => (
              <button
                type="button"
                onClick={option.onClick}
                className={cn(
                  "flex items-center gap-x-3 w-full text-left p-2",
                  "text-gray-600 dark:text-gray-300",
                  active &&
                    "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-500"
                )}
              >
                <option.icon
                  className={cn(
                    "size-6 shrink-0",
                    active
                      ? "text-indigo-600 dark:text-indigo-500"
                      : "text-gray-400"
                  )}
                />
                <span>{option.label}</span>
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
