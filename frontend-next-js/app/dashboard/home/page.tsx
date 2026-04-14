"use client"

import { useState, useEffect } from "react"
import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import Link from "next/link"

type Bid = {
  id: string
  user_id: string
  contact_id: string | null
  title: string | null
  status: "draft" | "sent" | "viewed" | "accepted" | "declined"
  project_status: "starting_soon" | "in_progress" | "complete" | null
  blocks: unknown[]
  created_at: string
  updated_at: string
  accepted_at: string | null
}

function computeJobStats(bids: Bid[]) {
  // Filter out drafts
  const sent = bids.filter((b) => b.status !== "draft")

  const active = sent.filter(
    (b) =>
      b.status === "accepted" &&
      (b.project_status === "starting_soon" ||
        b.project_status === "in_progress"),
  ).length

  const pending = sent.filter(
    (b) => b.status === "sent" || b.status === "viewed",
  ).length

  const declined = sent.filter((b) => b.status === "declined").length

  const completed = sent.filter(
    (b) => b.status === "accepted" && b.project_status === "complete",
  ).length

  return [
    { name: "Active jobs", value: String(active) },
    { name: "Pending approval", value: String(pending) },
    { name: "Completed", value: String(completed) },
    { name: "Declined", value: String(declined) },
  ]
}

export default function Home() {
  const [stats, setStats] = useState([
    { name: "Active jobs", value: "–" },
    { name: "Pending approval", value: "–" },
    { name: "Completed", value: "–" },
    { name: "Declined", value: "–" },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/bids")
        if (!res.ok) return
        const bids: Bid[] = await res.json()
        setStats(computeJobStats(bids))
      } catch {
        // Keep showing dashes on error
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="">
      <DashboardPageHeader
        title="Overview"
        subtitle="See a snapshot of your jobs and what's coming up"
      />{" "}
      {/* SNAPSHOT STATS==================== */}
      <div className="">
        <div className="flex items-center mb-4 gap-2 w-full justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Job summary
          </h2>
          <Link
            href="/dashboard/projects"
            className="text-indigo-600 dark:text-indigo-500 hover:underline"
          >
            <span className="sm:hidden">
              Jobs <span aria-hidden="true">→</span>
            </span>
            <span className="hidden sm:inline">
              go to Jobs <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>

        <div className="mx-auto  rounded-lg overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
          <div className="grid grid-cols-1 gap-0.5 bg-zinc-200 dark:bg-zinc-700 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white dark:bg-zinc-950 px-4 py-6 sm:px-6 lg:px-8 "
              >
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {stat.name}
                </p>
                <p className="mt-2 flex flex-col items-baseline gap-x-2 ">
                  <span
                    className={`text-4xl font-semibold tracking-tight text-gray-800 dark:text-gray-200 ${loading ? "animate-pulse" : ""}`}
                  >
                    {stat.value}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* UPCOMING EVENTS================== */}
    </div>
  )
}
