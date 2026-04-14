"use client"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid"
import Button from "@/components/ui/button"
import Badge from "@/components/ui/badge"

type BidStatus = "accepted" | "declined"
type ProjectStatus = "starting_soon" | "in_progress" | "complete"

interface BidStatusFooterProps {
  status: BidStatus
  statusDate: Date
  projectStatus?: ProjectStatus
  onChangedMind?: () => void
}

function formatDateCompact(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getProjectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case "starting_soon":
      return "Starting soon"
    case "in_progress":
      return "In progress"
    case "complete":
      return "Complete"
    default:
      return ""
  }
}

function getProjectStatusVariant(
  status: ProjectStatus,
): "success" | "warning" | "active" {
  switch (status) {
    case "starting_soon":
      return "warning"
    case "in_progress":
      return "active"
    case "complete":
      return "success"
    default:
      return "active"
  }
}

export default function BidStatusFooter({
  status,
  statusDate,
  projectStatus,
  onChangedMind,
}: BidStatusFooterProps) {
  const isAccepted = status === "accepted"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-t-2 border-zinc-200 dark:border-zinc-700">
      <div className="w-11/12 lg:max-w-7xl mx-auto py-4">
        {isAccepted ? (
          /* Accepted state - single row with 2-line text */
          <div className="flex items-center justify-between gap-3">
            {/* Left: Icon + status text (2 lines) */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 flex-none rounded-full bg-emerald-200/60 dark:bg-emerald-900/30 ring-2 ring-emerald-400 dark:ring-emerald-800 flex items-center justify-center">
                <CheckIcon className="size-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  <span className="sm:hidden">You approved on</span>
                  <span className="hidden sm:inline">
                    You approved this bid
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {formatDateCompact(statusDate)}
                </p>
              </div>
            </div>

            {/* Right: Project status badge */}
            {projectStatus && (
              <Badge
                variant={getProjectStatusVariant(projectStatus)}
                className="flex-none"
              >
                {getProjectStatusLabel(projectStatus)}
              </Badge>
            )}
          </div>
        ) : (
          /* Declined state - single row with 2-line text */
          <div className="flex items-center justify-between gap-3">
            {/* Left: Icon + status text (2 lines) */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 flex-none rounded-full bg-zinc-200 dark:bg-zinc-800 ring-2 ring-zinc-300 dark:ring-zinc-700 flex items-center justify-center">
                <XMarkIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  <span className="sm:hidden">Declined</span>
                  <span className="hidden sm:inline">
                    You declined this bid
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {formatDateCompact(statusDate)}
                </p>
              </div>
            </div>

            {/* Right: Changed mind button */}
            {onChangedMind && (
              <Button
                variant="ghost"
                onClick={onChangedMind}
                className="flex-none text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Changed mind?
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
