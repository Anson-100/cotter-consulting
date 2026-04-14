// components/ui/dashboard-page-header.tsx

import React from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

interface DashboardPageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
}

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
}) => {
  return (
    <header className="flex flex-col gap-3 mb-12">
      <div className="flex flex-col w-auto gap-2 p-3.5 rounded-lg border-2 dark:border-sky-500 border-sky-600 bg-sky-100 dark:bg-sky-950/40 w-fit">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        )}
      </div>{" "}
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-500 w-fit"
        >
          <ArrowLeftIcon className="size-4" />
          {backLabel}
        </Link>
      )}
    </header>
  )
}

export default DashboardPageHeader
