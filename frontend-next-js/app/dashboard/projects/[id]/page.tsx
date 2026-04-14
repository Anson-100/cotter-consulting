"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type {
  Bid,
  BidBlock,
  HeaderBlock,
  PricingBlock,
} from "@/lib/validations/bid"
import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import HeaderBox from "@/components/bid/header-box"
import GreetingBox from "@/components/bid/greeting-box"
import StepTrackerBox from "@/components/bid/step-tracker-box"
import LocationBox from "@/components/bid/location-box"
import ContentBox from "@/components/bid/content-box"
import PricingBox from "@/components/bid/pricing-box"
import PhotoBox from "@/components/bid/photo-box"
import JobManagementFooter from "@/components/bid/job-management-footer"

type JobStatus = "starting_soon" | "in_progress" | "complete"

export default function JobManagementPage() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [bid, setBid] = useState<Bid | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch bid data
  useEffect(() => {
    async function fetchBid() {
      try {
        const { data, error } = await supabase
          .from("bids")
          .select("*")
          .eq("id", id)
          .single()

        if (error || !data) {
          setError("Job not found")
          return
        }

        // Only show sent bids (not drafts)
        if (data.status === "draft") {
          setError("This bid hasn't been sent yet")
          return
        }

        setBid(data as Bid)
      } catch (err) {
        setError("Failed to load job")
      } finally {
        setLoading(false)
      }
    }

    fetchBid()
  }, [id, supabase])

  // Handle status change
  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!bid) return

    try {
      const { error } = await supabase
        .from("bids")
        .update({ project_status: newStatus })
        .eq("id", id)

      if (error) throw error

      setBid({ ...bid, project_status: newStatus })
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  // Render block components
  const renderBlock = (block: BidBlock, index: number) => {
    switch (block.type) {
      case "header":
        return <HeaderBox key={`header-${index}`} block={block} readOnly />
      case "greeting":
        return <GreetingBox key={`greeting-${index}`} block={block} readOnly />
      case "stepTracker":
        return <StepTrackerBox key={`steps-${index}`} block={block} readOnly />
      case "location":
        return <LocationBox key={`location-${index}`} block={block} readOnly />
      case "content":
        return <ContentBox key={`content-${index}`} block={block} readOnly />
      case "pricing":
        return <PricingBox key={`pricing-${index}`} block={block} readOnly />
      case "photo":
        return (
          <PhotoBox
            key={`photo-${index}`}
            block={block}
            bidId={bid?.id || ""}
            readOnly
          />
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading job...</span>
        </div>
      </div>
    )
  }

  if (error || !bid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {error || "Job not found"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This job may not exist or you may not have access to it.
          </p>
        </div>
      </div>
    )
  }

  const blocks = bid.blocks || []
  const headerBlock = blocks.find((b): b is HeaderBlock => b.type === "header")
  const bodyBlocks = blocks.filter((b) => b.type !== "header")

  // Derive payment info from the pricing block (if present)
  const pricingBlock = blocks.find(
    (b): b is PricingBlock => b.type === "pricing",
  )
  const payments =
    bid.status === "accepted" && pricingBlock
      ? (() => {
          const total = pricingBlock.lineItems.reduce(
            (sum, item) => sum + item.amount,
            0,
          )
          const deposit = Math.round(
            total * (pricingBlock.depositPercent / 100),
          )
          const balance = total - deposit
          return [
            { label: "Deposit", amount: deposit, status: "pending" as const },
            { label: "Balance", amount: balance, status: "pending" as const },
          ]
        })()
      : []

  return (
    <>
      <DashboardPageHeader
        title="Manage Job"
        subtitle="Track progress and manage this job"
        backHref="/dashboard/projects"
        backLabel="Back to Jobs"
      />

      <section className="min-h-screen pb-32 relative isolate overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {/* Header */}
        {headerBlock && <HeaderBox block={headerBlock} readOnly />}

        {/* Body blocks */}
        <div className="relative isolate w-11/12 lg:max-w-7xl mx-auto">
          <div className="mb-8 mt-12"></div>
          {bodyBlocks.map((block, index) => renderBlock(block, index))}
        </div>

        {/* Contractor management footer */}
        <JobManagementFooter
          bidId={bid.id || ""}
          bidStatus={bid.status}
          jobStatus={(bid.project_status as JobStatus) || "starting_soon"}
          sentAt={bid.sent_at || bid.created_at}
          acceptedAt={bid.accepted_at ?? undefined}
          declinedAt={bid.declined_at ?? undefined}
          payments={payments}
          onStatusChange={handleStatusChange}
        />
      </section>
    </>
  )
}
