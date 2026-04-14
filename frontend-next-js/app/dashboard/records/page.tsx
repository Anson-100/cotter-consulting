"use client"
import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import UnderConstruction from "@/components/ui/under-construction"
import EmptyState from "@/components/ui/empty-state"
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"

const UNDER_CONSTRUCTION = true // TODO: Remove when ready to build

export default function Records() {
  // TODO: Fetch records from API
  const records: unknown[] = []
  const loading = false

  return (
    <div className="">
      <DashboardPageHeader
        title="Records"
        subtitle="View and manage your records"
      />

      {UNDER_CONSTRUCTION ? (
        <UnderConstruction
          title="Records under construction"
          message="This feature will have storage for commonly used documents like COI, all the info you need for tax time, and more"
        />
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading records...</span>
          </div>
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          icon={<DocumentDuplicateIcon className="size-12" />}
          title="No records yet"
          subtitle="Records will appear here as you complete projects and payments."
        />
      ) : (
        <div>{/* TODO: Records list */}</div>
      )}
    </div>
  )
}
