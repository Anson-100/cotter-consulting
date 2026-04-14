"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import { motion, AnimatePresence } from "framer-motion"

import { FolderIcon } from "@heroicons/react/24/outline"
import Badge from "@/components/ui/badge"
import FilterSearchBar, {
  type SortValue,
} from "@/components/ui/filter-search-bar"

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
}

// Map bid statuses to project display statuses
const statusDisplayMap: Record<string, string> = {
  sent: "Pending",
  viewed: "Pending",
  accepted: "Accepted",
  declined: "Declined",
}

const statusOptions = [
  "All",
  "Pending",
  "Accepted",
  "In progress",
  "Complete",
  "Declined",
]

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function getBidTitle(bid: Bid): string {
  if (bid.title) return bid.title

  // Try to extract from header block
  const headerBlock = bid.blocks?.find(
    (b: unknown) =>
      typeof b === "object" &&
      b !== null &&
      (b as { type?: string }).type === "header",
  ) as { companyName?: string } | undefined

  if (headerBlock?.companyName && headerBlock.companyName !== "Your Company") {
    return headerBlock.companyName
  }

  return "Untitled Project"
}

function getProjectStatus(bid: Bid): string {
  // For accepted bids, derive display status from job-level project_status
  if (bid.status === "accepted") {
    if (bid.project_status === "complete") return "Complete"
    if (bid.project_status === "in_progress") return "In progress"
    return "Accepted"
  }
  return statusDisplayMap[bid.status] || "Pending"
}

function getStatusVariant(
  status: string,
): "success" | "warning" | "danger" | "active" | "neutral" {
  switch (status) {
    case "Accepted":
      return "active"
    case "In progress":
      return "active"
    case "Pending":
      return "warning"
    case "Complete":
      return "success"
    case "Declined":
      return "danger"
    default:
      return "neutral"
  }
}

export default function Projects() {
  const [projects, setProjects] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortValue>("newest")
  const [hoverEnabled, setHoverEnabled] = useState(true)
  const [newBidModalOpen, setNewBidModalOpen] = useState(false)

  // Fetch projects (sent bids only) on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const res = await fetch("/api/bids")
        if (!res.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data: Bid[] = await res.json()
        // Filter out drafts - projects are only sent bids
        const sentBids = data.filter((bid) => bid.status !== "draft")
        setProjects(sentBids)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Filter projects by status and search, then sort
  const filteredProjects = projects
    .filter((project) => {
      const displayStatus = getProjectStatus(project)
      const matchesStatus =
        selectedStatus === "All" || displayStatus === selectedStatus

      const matchesSearch =
        searchQuery === "" ||
        getBidTitle(project).toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="">
        <DashboardPageHeader
          title="Projects"
          subtitle="View and manage your projects — past, present, and future"
        />
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading projects...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="">
        <DashboardPageHeader
          title="Projects"
          subtitle="View and manage your projects — past, present, and future"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <DashboardPageHeader
        title="Jobs"
        subtitle="View and manage your jobs — past, present, and future"
      />

      {/* NAVIGATION / FILTERS */}
      <div className="flex items-start flex-col gap-2 mb-6">
        <div className="flex items-center gap-8 sm:gap-0 justify-between w-full">
          <FilterSearchBar
            searchPlaceholder="Search jobs..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            onStatusChange={(value) => {
              setSelectedStatus(value)
              setHoverEnabled(false)
              setTimeout(() => setHoverEnabled(true), 900)
            }}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto size-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {projects.length === 0 ? "No projects yet" : "No matching projects"}
          </h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {projects.length === 0
              ? "Projects appear here once you send a bid to a customer."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={selectedStatus + searchQuery}
            role="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
          >
            {/* JOB TILES ============================================================================== */}
            {filteredProjects.map((project) => {
              const displayStatus = getProjectStatus(project)
              return (
                <li
                  key={project.id}
                  className="col-span-1 flex flex-col divide-y-2 border-2 border-zinc-200 dark:border-zinc-700 divide-zinc-200 dark:divide-zinc-700 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden"
                >
                  {/* Swappable content */}
                  <div className="relative flex flex-1 flex-col p-8 group">
                    {/* Default content */}
                    <div>
                      <h3 className="mt-2 font-semibold text-gray-800 text-lg dark:text-gray-200">
                        {getBidTitle(project)}
                      </h3>
                      <dl className="mt-1 flex grow flex-col justify-between">
                        <dd className="text-gray-600 dark:text-gray-300">
                          {/* TODO: Add contact name when contacts are linked */}
                          Project #{project.id.slice(0, 8)}
                        </dd>
                        <dd className="text-gray-600 dark:text-gray-300 font-semibold">
                          <span className="font-medium">Date started: </span>
                          {formatDate(project.created_at)}
                        </dd>
                        <dd className="mt-3 mx-auto">
                          <Badge variant={getStatusVariant(displayStatus)}>
                            {displayStatus}
                          </Badge>
                        </dd>
                      </dl>
                    </div>

                    {/* Hover info that fades in */}
                    <div
                      className={classNames(
                        "absolute inset-0 text-left bg-white dark:bg-zinc-950 flex flex-col items-center justify-center px-8 py-6",
                        hoverEnabled
                          ? "opacity-0 group-hover:opacity-100"
                          : "opacity-0",
                      )}
                      style={{
                        transition: "opacity 200ms ease-in-out",
                        willChange: "opacity",
                        pointerEvents: "none",
                      }}
                    >
                      <div>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">
                          <span className="font-medium">Status: </span>
                          {displayStatus}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 font-semibold">
                          <span className="font-medium">Last updated: </span>
                          {formatDate(project.updated_at)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 font-semibold">
                          <span className="font-medium">Blocks: </span>
                          {project.blocks?.length || 0} sections
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Button stays visible */}
                  <div>
                    <div className="-mt-px flex hover:bg-zinc-100 dark:hover:bg-zinc-900">
                      <div className="flex w-0 flex-1">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-2 rounded-bl-lg border border-transparent py-4 font-semibold text-gray-800 dark:text-zinc-200 z-10"
                        >
                          View job <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  )
}
