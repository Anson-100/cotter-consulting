"use client"

import { use, useState } from "react"
import { cn } from "@/lib/utils"
import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import BidEditor from "@/app/dashboard/bids/bid-editor"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditBidPage({ params }: PageProps) {
  const { id } = use(params)
  const [isMobileView, setIsMobileView] = useState(false)

  return (
    <>
      <DashboardPageHeader
        title="Edit bid"
        subtitle="Make changes to your bid"
        backHref="/dashboard/bids"
        backLabel="Back to Bids"
      />

      <div
        className={cn(
          "@container rounded-xl border-sky-600/20 dark:border-sky-500/20 border overflow-hidden shadow-xl shadow-zinc-700/50 dark:[box-shadow:0_4px_20px_rgb(14_165_233/0.4)]",
          isMobileView && "max-w-[375px] mx-auto",
        )}
      >
        <BidEditor
          bidId={id}
          isMobileView={isMobileView}
          onToggleMobileView={() => setIsMobileView(!isMobileView)}
        />
      </div>
    </>
  )
}
