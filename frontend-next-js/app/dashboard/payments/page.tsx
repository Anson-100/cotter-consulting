"use client"
import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import UnderConstruction from "@/components/ui/under-construction"
import EmptyState from "@/components/ui/empty-state"
import { CurrencyDollarIcon } from "@heroicons/react/24/outline"

const UNDER_CONSTRUCTION = true // TODO: Remove when ready to build

export default function Payments() {
  // TODO: Fetch payments from API
  const payments: unknown[] = []
  const loading = false

  return (
    <div className="">
      <DashboardPageHeader
        title="Payments"
        subtitle="View and manage payment activity"
      />

      {UNDER_CONSTRUCTION ? (
        <UnderConstruction
          title="Payments under construction"
          message="This feature will be available soon"
        />
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading payments...</span>
          </div>
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={<CurrencyDollarIcon className="size-12" />}
          title="No payments yet"
          subtitle="Payments will appear here as customers pay for your projects."
        />
      ) : (
        <div>{/* TODO: Payments list */}</div>
      )}
    </div>
  )
}
