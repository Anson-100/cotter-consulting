"use client"

import { useState, useEffect } from "react"
import {
  CheckCircleIcon,
  PencilSquareIcon,
  EyeIcon,
  ChevronDownIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import { CheckIcon } from "@heroicons/react/24/solid"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import GhostButton from "@/components/ui/ghost-button"
import ConfirmCompleteModal from "@/components/bid/confirm-complete-modal"
import { cn } from "@/lib/utils"

type BidStatus = "draft" | "sent" | "viewed" | "accepted" | "declined"
type JobStatus = "starting_soon" | "in_progress" | "complete"
type PaymentStatus = "pending" | "received" | "overdue"

interface PaymentInfo {
  label: string
  amount: number
  status: PaymentStatus
}

interface JobManagementFooterProps {
  bidId: string
  bidStatus: BidStatus
  jobStatus?: JobStatus
  sentAt?: string
  acceptedAt?: string
  declinedAt?: string
  payments?: PaymentInfo[]
  onStatusChange?: (status: JobStatus) => void
}

const statusLabels: Record<JobStatus, string> = {
  starting_soon: "Starting soon",
  in_progress: "In progress",
  complete: "Complete",
}

const statusColors: Record<JobStatus, string> = {
  starting_soon:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  complete:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
}

const paymentStatusStyles: Record<PaymentStatus, string> = {
  received: "text-green-600 dark:text-green-400",
  pending: "text-amber-600 dark:text-amber-400",
  overdue: "text-red-600 dark:text-red-400",
}

const paymentStatusLabels: Record<PaymentStatus, string> = {
  received: "Paid",
  pending: "Pending",
  overdue: "Overdue",
}

export default function JobManagementFooter({
  bidId,
  bidStatus,
  jobStatus = "starting_soon",
  sentAt,
  acceptedAt,
  declinedAt,
  payments = [],
  onStatusChange,
}: JobManagementFooterProps) {
  const [status, setStatus] = useState<JobStatus>(jobStatus)
  const [completeModalOpen, setCompleteModalOpen] = useState(false)

  // Sidebar pinned state tracking
  const [isPinned, setIsPinned] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebarPinned")
      return stored !== null ? stored === "true" : true
    }
    return true
  })

  // Listen for sidebar changes
  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent<boolean>) => {
      setIsPinned(e.detail)
    }
    window.addEventListener(
      "sidebarPinnedChange",
      handleSidebarChange as EventListener,
    )
    return () =>
      window.removeEventListener(
        "sidebarPinnedChange",
        handleSidebarChange as EventListener,
      )
  }, [])

  const handleStatusChange = (newStatus: JobStatus) => {
    if (newStatus === "complete") {
      setCompleteModalOpen(true)
      return
    }
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }

  const handleConfirmComplete = async () => {
    setStatus("complete")
    onStatusChange?.("complete")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Calculate payment totals
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const paidAmount = payments
    .filter((p) => p.status === "received")
    .reduce((sum, p) => sum + p.amount, 0)
  const balanceAmount = totalAmount - paidAmount

  // Get deposit status (first payment is typically deposit)
  const depositPayment = payments.find(
    (p) => p.label.toLowerCase() === "deposit",
  )

  // PHASE 1: Pending approval (sent or viewed) ========================================================================================================================================
  if (bidStatus === "sent" || bidStatus === "viewed") {
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-t-2 border-zinc-200 dark:border-zinc-800 transition-[margin] duration-200 ease-in-out",
          isPinned ? "lg:ml-55" : "lg:ml-14",
        )}
      >
        <div className="w-full sm:w-11/12 lg:max-w-7xl mx-auto py-2.5">
          <div className="flex items-center justify-between gap-4">
            {/* Status info */}
            <div className="ml-3 flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <div className="flex gap-1 items-center ">
                  <ClockIcon className="size-5 text-amber-500" />

                  <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    Awaiting response
                  </p>
                </div>

                <p className="text-gray-600 dark:text-gray-400 truncate">
                  <span className="">Sent</span> {formatDate(sentAt)}{" "}
                  <span className="">
                    {bidStatus === "viewed" ? "(Viewed)" : "(Not viewed)"}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center shrink-0">
              <GhostButton href={`/bid/${bidId}`} target="_blank">
                <EyeIcon className="size-5" />
                <span className="hidden sm:inline">View</span>
              </GhostButton>
              <GhostButton href={`/dashboard/bids/${bidId}/edit`}>
                <PencilSquareIcon className="size-5" />
                <span className="hidden sm:inline">Edit</span>
              </GhostButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PHASE 3: Declined ===================================================================================================
  if (bidStatus === "declined") {
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-t-2 border-zinc-200 dark:border-zinc-800 transition-[margin] duration-200 ease-in-out",
          isPinned ? "lg:ml-55" : "lg:ml-14",
        )}
      >
        <div className="w-11/12 lg:max-w-7xl mx-auto py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Status info */}
            <div className="flex items-center gap-3 min-w-0">
              <XCircleIcon className="size-6 text-red-500 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Declined
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {formatDate(declinedAt)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <GhostButton href={`/dashboard/bids/${bidId}/edit`}>
                <PencilSquareIcon className="size-5" />
                <span className="hidden sm:inline">Edit & resend</span>
              </GhostButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PHASE 2: Accepted - full job management ==========================================================================================================
  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-t-2 border-zinc-200 dark:border-zinc-800 transition-[margin] duration-200 ease-in-out",
          isPinned ? "lg:ml-55" : "lg:ml-14",
        )}
      >
        <div className="w-11/12 lg:max-w-7xl mx-auto py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Accepted info + Status control */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Accepted date */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <CheckCircleIcon className="size-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Accepted {formatDate(acceptedAt)}
                </span>
              </div>

              {/* Status dropdown */}
              <Menu as="div" className="relative shrink-0">
                <MenuButton
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full font-semibold ${statusColors[status]}`}
                >
                  {statusLabels[status]}
                  <ChevronDownIcon className="size-4" />
                </MenuButton>
                <MenuItems className="absolute left-0 bottom-full mb-2 w-48 origin-bottom-left rounded-md bg-white dark:bg-zinc-950 shadow-lg ring-2 ring-zinc-200 dark:ring-zinc-700 focus:outline-none overflow-hidden">
                  {(Object.keys(statusLabels) as JobStatus[]).map((s) => (
                    <MenuItem key={s}>
                      <button
                        onClick={() => handleStatusChange(s)}
                        className="flex w-full items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      >
                        {statusLabels[s]}
                        {status === s && (
                          <CheckIcon className="size-5 text-indigo-600 dark:text-indigo-500" />
                        )}
                      </button>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>

            {/* Center: Payment info ===============================================================================*/}
            {payments.length > 0 && (
              <div className="hidden md:flex items-center gap-4 text-gray-600 dark:text-gray-400">
                {depositPayment && (
                  <span>
                    Deposit:{" "}
                    <span
                      className={`font-semibold ${paymentStatusStyles[depositPayment.status]}`}
                    >
                      {paymentStatusLabels[depositPayment.status]}
                    </span>
                  </span>
                )}
                {balanceAmount > 0 && (
                  <span>
                    Balance:{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {formatCurrency(balanceAmount)}
                    </span>
                  </span>
                )}
              </div>
            )}

            {/* Right: Quick actions */}
            <div className="flex items-center gap-2 shrink-0">
              <GhostButton href={`/bid/${bidId}`} target="_blank">
                <EyeIcon className="size-5" />
                <span className="hidden lg:inline">View</span>
              </GhostButton>
              <GhostButton href={`/dashboard/bids/${bidId}/edit`}>
                <PencilSquareIcon className="size-5" />
                <span className="hidden lg:inline">Edit</span>
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      <ConfirmCompleteModal
        open={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        onConfirm={handleConfirmComplete}
      />
    </>
  )
}
