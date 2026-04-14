// components/ui/filter-search-bar.tsx
"use client"

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid"
import { cn } from "@/lib/utils"

type SortValue = "newest" | "oldest"

const sortLabels: Record<SortValue, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
}

const sortValues: SortValue[] = ["newest", "oldest"]

interface FilterSearchBarProps {
  searchPlaceholder?: string
  searchQuery: string
  onSearchChange: (query: string) => void
  statusOptions: string[]
  selectedStatus: string
  onStatusChange: (status: string) => void
  sortBy: SortValue
  onSortChange: (sort: SortValue) => void
}

export type { SortValue }

export default function FilterSearchBar({
  searchPlaceholder = "Search...",
  searchQuery,
  onSearchChange,
  statusOptions,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}: FilterSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row">
      {/* Search input */}
      <div className="sm:flex-auto">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="relative block w-50 rounded-t-md sm:rounded-md bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-base text-zinc-800 outline-2 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700 placeholder:text-gray-600 dark:placeholder:text-gray-300 dark:text-gray-200 focus:z-10 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:rounded-r-none -mb-px sm:mb-0 sm:-mr-px"
        />
      </div>

      {/* Combined filter + sort dropdown */}
      <Menu as="div" className="relative">
        <MenuButton className="relative flex flex-row-reverse justify-between w-50 items-center gap-x-1.5 sm:rounded-md bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-gray-600 dark:text-gray-300 sm:rounded-l-none rounded-b-md ring-inset focus:z-10 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 dark:focus:outline-indigo-500 outline-2 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700">
          <ChevronDownIcon className="-mr-1 size-5 text-gray-400" />
          {selectedStatus}
        </MenuButton>

        <MenuItems className="absolute left-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-zinc-950 shadow-lg ring-2 ring-zinc-200 dark:ring-zinc-700 focus:outline-none overflow-hidden max-h-56 overflow-y-auto md:max-h-none md:overflow-y-visible">
          {/* Status filter section */}
          {statusOptions.map((status) => (
            <MenuItem key={status}>
              <button
                type="button"
                onClick={() => onStatusChange(status)}
                className="flex w-full cursor-pointer justify-between items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-800"
              >
                <span>{status}</span>
                {selectedStatus === status && (
                  <CheckIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                )}
              </button>
            </MenuItem>
          ))}

          {/* Divider */}
          <div className="border-t-2 border-zinc-200 dark:border-zinc-700 " />

          {/* Sort section */}
          <div className="px-4 py-1.5">
            <span className=" text-gray-400 dark:text-gray-500">Sort by</span>
          </div>
          {sortValues.map((sort) => (
            <MenuItem key={sort}>
              <button
                type="button"
                onClick={() => onSortChange(sort)}
                className={cn(
                  "flex w-full cursor-pointer justify-between items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-800",
                )}
              >
                <span>{sortLabels[sort]}</span>
                {sortBy === sort && (
                  <CheckIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                )}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  )
}
