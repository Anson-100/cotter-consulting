"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import Button from "@/components/ui/button"
import EmptyState from "@/components/ui/empty-state"
import NewBidModal from "./NewBidModal"
import TemplatePickerDrawer from "@/components/TemplatePickerDrawer"
import Badge from "@/components/ui/badge"
import EditorField from "@/components/bid/editor-field"

import {
  PlusIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"
import FilterSearchBar, {
  type SortValue,
} from "@/components/ui/filter-search-bar"

type Bid = {
  id: string
  user_id: string
  contact_id: string | null
  title: string | null
  status: "draft" | "sent" | "viewed" | "accepted" | "declined"
  project_status?: "starting_soon" | "in_progress" | "complete" | null
  blocks: unknown[]
  created_at: string
  updated_at: string
}

const statusOptions = ["All", "Sent", "Not sent"]

const BID_TITLE_MAX_LENGTH = 70

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function getBidTitle(bid: Bid): string {
  if (bid.title) return bid.title

  const headerBlock = bid.blocks?.find(
    (b: unknown) =>
      typeof b === "object" &&
      b !== null &&
      (b as { type?: string }).type === "header",
  ) as { companyName?: string } | undefined

  if (headerBlock?.companyName && headerBlock.companyName !== "Your Company") {
    return `Bid for ${headerBlock.companyName}`
  }

  return "Untitled bid"
}

function isSent(status: string): boolean {
  return status !== "draft"
}

// Check if a bid can be deleted
function canDeleteBid(bid: Bid): { allowed: boolean; reason?: string } {
  if (bid.status === "accepted") {
    return {
      allowed: false,
      reason: "Has active job",
    }
  }

  if (
    bid.project_status === "starting_soon" ||
    bid.project_status === "in_progress"
  ) {
    return {
      allowed: false,
      reason: "Job in progress",
    }
  }

  return { allowed: true }
}

// ============================================
// BID TILE TOOLBAR COMPONENT
// Matches BlockShell toolbar styling exactly
// ============================================
type ToolbarMode = "idle" | "confirmDelete" | "editTitle" | "unsavedChanges"

interface BidTileToolbarProps {
  bid: Bid
  mode: ToolbarMode
  onModeChange: (mode: ToolbarMode) => void
  onDelete: () => void
  onSave: () => void
  onDiscard: () => void
  isSaving: boolean
}

function BidTileToolbar({
  bid,
  mode,
  onModeChange,
  onDelete,
  onSave,
  onDiscard,
  isSaving,
}: BidTileToolbarProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onModeChange("editTitle")
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onModeChange("confirmDelete")
  }

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const { allowed } = canDeleteBid(bid)
    if (!allowed) {
      onModeChange("idle")
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/bids/${bid.id}`, { method: "DELETE" })
      if (res.ok) {
        onDelete()
      }
    } catch (err) {
      console.error("Delete failed:", err)
    } finally {
      setIsDeleting(false)
      onModeChange("idle")
    }
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onModeChange("idle")
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSave()
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onModeChange("idle")
  }

  const handleDiscardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDiscard()
  }

  const handleSaveFromPrompt = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSave()
  }

  const { allowed, reason } = canDeleteBid(bid)

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
      {mode === "confirmDelete" ? (
        // Delete confirmation - matches BlockShell exactly
        <div className="flex relative items-center gap-2">
          {/* Tooltip popup */}
          <div className="text-base flex flex-col absolute -bottom-19 right-0 bg-white dark:bg-zinc-950 min-w-max rounded-md py-2 px-3 border-zinc-200 dark:border-zinc-700 border-2">
            {allowed ? (
              <>
                <span className="font-medium text-red-600 dark:text-red-400">
                  Delete?
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  No undo
                </span>
              </>
            ) : (
              <>
                <span className="font-medium text-red-600 dark:text-red-400">
                  Cannot delete
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {reason}
                </span>
              </>
            )}
          </div>

          {allowed ? (
            <>
              {/* Confirm delete */}
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="p-1.5 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckIcon className="size-6 text-white" />
                )}
              </button>
              {/* Cancel */}
              <button
                type="button"
                onClick={handleCancelDelete}
                className="p-1.5 rounded bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                <XMarkIcon className="size-6 text-gray-600 dark:text-gray-300" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCancelDelete}
              className="p-1.5 rounded bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              <XMarkIcon className="size-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      ) : mode === "unsavedChanges" ? (
        // Unsaved changes prompt - same tooltip style as delete confirmation
        <div className="flex relative items-center gap-2">
          {/* Tooltip popup */}
          <div className="text-base flex flex-col absolute -bottom-19 right-0 bg-white dark:bg-zinc-950 min-w-max rounded-md py-2 px-3 border-zinc-200 dark:border-zinc-700 border-2">
            <span className="font-medium text-amber-600 dark:text-amber-400">
              Unsaved changes
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              Save or discard?
            </span>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSaveFromPrompt}
            disabled={isSaving}
            className="p-1.5 rounded bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckIcon className="size-6 text-white" />
            )}
          </button>
          {/* Discard */}
          <button
            type="button"
            onClick={handleDiscardClick}
            className="p-1.5 rounded bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            <XMarkIcon className="size-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      ) : mode === "editTitle" ? (
        // Edit title - save/cancel buttons only, input is inline in the header
        <div className="flex items-center gap-2">
          {/* Save */}
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
            className="p-1.5 rounded bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckIcon className="size-6 text-white" />
            )}
          </button>
          {/* Cancel */}
          <button
            type="button"
            onClick={handleCancelEdit}
            className="p-1.5 rounded bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            <XMarkIcon className="size-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      ) : (
        // Default state - show edit/delete icons (visible on header hover via group-hover)
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Delete */}
          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-1.5 rounded opacity-70 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <TrashIcon className="size-6 text-red-600 dark:text-red-400" />
          </button>
          {/* Edit */}
          <button
            type="button"
            onClick={handleEditClick}
            className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <PencilIcon className="size-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN BIDS PAGE
// ============================================
export default function BidsPage() {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortValue>("newest")
  const [newBidModalOpen, setNewBidModalOpen] = useState(false)
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false)

  // Track which tile has an active toolbar (only one at a time)
  const [activeToolbar, setActiveToolbar] = useState<{
    bidId: string
    mode: ToolbarMode
  } | null>(null)

  // Edited title lives at page level since only one tile edits at a time
  const [editedTitle, setEditedTitle] = useState("")
  const [originalTitle, setOriginalTitle] = useState("")
  const [isSavingTitle, setIsSavingTitle] = useState(false)
  const editInputRef = useRef<HTMLInputElement>(null)
  const editHeaderRef = useRef<HTMLDivElement>(null)

  const isDirty = editedTitle !== originalTitle

  // Focus input when entering edit mode
  useEffect(() => {
    if (activeToolbar?.mode === "editTitle" && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [activeToolbar])

  // Click outside handler
  useEffect(() => {
    if (
      !activeToolbar ||
      (activeToolbar.mode !== "editTitle" &&
        activeToolbar.mode !== "unsavedChanges")
    )
      return

    function handleClickOutside(e: MouseEvent) {
      if (
        editHeaderRef.current &&
        !editHeaderRef.current.contains(e.target as Node)
      ) {
        if (isDirty) {
          setActiveToolbar({
            bidId: activeToolbar!.bidId,
            mode: "unsavedChanges",
          })
        } else {
          setActiveToolbar(null)
          setEditedTitle("")
          setOriginalTitle("")
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeToolbar, isDirty])

  // Shared save handler — used by both Enter key and toolbar save button
  const handleSaveEditedTitle = useCallback(
    async (bidId: string) => {
      if (!editedTitle.trim()) {
        setActiveToolbar(null)
        setEditedTitle("")
        setOriginalTitle("")
        return
      }

      setIsSavingTitle(true)
      try {
        const res = await fetch(`/api/bids/${bidId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editedTitle.trim() }),
        })
        if (res.ok) {
          handleUpdateTitle(bidId, editedTitle.trim())
        }
      } catch (err) {
        console.error("Save failed:", err)
      } finally {
        setIsSavingTitle(false)
        setActiveToolbar(null)
        setEditedTitle("")
        setOriginalTitle("")
      }
    },
    [editedTitle],
  )

  // Discard handler
  const handleDiscardEdit = useCallback(() => {
    setActiveToolbar(null)
    setEditedTitle("")
    setOriginalTitle("")
  }, [])

  useEffect(() => {
    async function fetchBids() {
      try {
        setLoading(true)
        const res = await fetch("/api/bids")
        if (!res.ok) throw new Error("Failed to fetch bids")
        const data = await res.json()
        setBids(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchBids()
  }, [])

  const filteredBids = bids
    .filter((bid) => {
      const bidIsSent = isSent(bid.status)
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Sent" && bidIsSent) ||
        (selectedStatus === "Not sent" && !bidIsSent)

      const matchesSearch =
        searchQuery === "" ||
        getBidTitle(bid).toLowerCase().includes(searchQuery.toLowerCase())

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

  const handleDeleteBid = (bidId: string) => {
    setBids((prev) => prev.filter((b) => b.id !== bidId))
    setActiveToolbar(null)
  }

  const handleUpdateTitle = (bidId: string, newTitle: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, title: newTitle } : b)),
    )
  }

  const handleToolbarModeChange = (bidId: string, mode: ToolbarMode) => {
    if (mode === "idle") {
      setActiveToolbar(null)
      setEditedTitle("")
      setOriginalTitle("")
    } else {
      if (mode === "editTitle") {
        const bid = bids.find((b) => b.id === bidId)
        if (bid) {
          const title = getBidTitle(bid)
          setEditedTitle(title)
          setOriginalTitle(title)
        }
      }
      setActiveToolbar({ bidId, mode })
    }
  }

  const getToolbarMode = (bidId: string): ToolbarMode => {
    if (activeToolbar?.bidId === bidId) {
      return activeToolbar.mode
    }
    return "idle"
  }

  const handleEditKeyDown = (bidId: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSaveEditedTitle(bidId)
    } else if (e.key === "Escape") {
      if (isDirty) {
        setActiveToolbar({ bidId, mode: "unsavedChanges" })
      } else {
        setActiveToolbar(null)
        setEditedTitle("")
        setOriginalTitle("")
      }
    }
  }

  if (loading) {
    return (
      <div className="">
        <DashboardPageHeader
          title="Bids"
          subtitle="Create, edit, and manage your bid documents"
        />
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading bids...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="">
        <DashboardPageHeader
          title="Bids"
          subtitle="Create, edit, and manage your bid documents"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <NewBidModal
        open={newBidModalOpen}
        onClose={() => setNewBidModalOpen(false)}
        onSelectTemplate={() => setTemplateDrawerOpen(true)}
      />
      <TemplatePickerDrawer
        open={templateDrawerOpen}
        onClose={() => setTemplateDrawerOpen(false)}
      />

      <DashboardPageHeader
        title="Bids"
        subtitle="Create, edit, and manage your bid documents"
      />

      {/* FILTERS */}
      <div className="flex items-start flex-col gap-2 mb-6">
        <div className="flex flex-col items-start md:flex-row-reverse md:items-center justify-between gap-4 w-full">
          <div className="flex flex-row-reverse items-center gap-4">
            <Button
              as="button"
              variant="secondary"
              size="md"
              type="button"
              onClick={() => setTemplateDrawerOpen(true)}
              className="rounded-md px-3.5 py-2.5"
            >
              {/* <DocumentTextIcon
                className="size-5 sm:hidden"
                aria-hidden="true"
              /> */}
              <span className="">Templates</span>
            </Button>

            <Button
              as="button"
              variant="primary"
              size="md"
              type="button"
              onClick={() => setNewBidModalOpen(true)}
              className="rounded-md px-3.5 py-2.5"
            >
              <span className="sm:hidden flex">
                <PlusIcon className="size-6" aria-hidden="true" />
                New
              </span>
              <span className="hidden sm:inline-flex items-center gap-x-1">
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                New bid
              </span>
            </Button>
          </div>{" "}
          <FilterSearchBar
            searchPlaceholder="Search bids..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      {/* BIDS TILES ==========================================================================================================================================================*/}
      {filteredBids.length === 0 ? (
        bids.length === 0 ? (
          <EmptyState
            icon={<DocumentTextIcon className="size-12" />}
            title="No bids yet"
            subtitle="Get started by creating your first bid."
            action={{
              label: "Create bid",
              onClick: () => setNewBidModalOpen(true),
            }}
          />
        ) : (
          <EmptyState
            icon={<DocumentTextIcon className="size-12" />}
            title="No matching bids"
            subtitle="Try adjusting your search or filter."
          />
        )
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
            {filteredBids.map((bid) => {
              const currentMode = getToolbarMode(bid.id)
              const isEditing =
                currentMode === "editTitle" || currentMode === "unsavedChanges"

              return (
                <li
                  key={bid.id}
                  className="relative overflow-hidden rounded-xl border-2 border-zinc-200 dark:border-zinc-700"
                >
                  {/* Header with toolbar */}
                  <div
                    ref={isEditing ? editHeaderRef : undefined}
                    className="group relative flex items-center gap-x-4 border-b-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-6 pb-8"
                  >
                    <div className="size-12 flex-none rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center ring-2 ring-zinc-200 dark:ring-zinc-700">
                      <DocumentTextIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    {/* Title OR inline input */}
                    {isEditing ? (
                      <div className="min-w-0 flex-1 pr-24">
                        <EditorField
                          ref={editInputRef}
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onKeyDown={handleEditKeyDown(bid.id)}
                          onClick={(e) => e.stopPropagation()}
                          maxLength={BID_TITLE_MAX_LENGTH}
                          placeholder="Bid title..."
                        />
                      </div>
                    ) : (
                      <div className="text-base font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 min-w-0 flex-1">
                        {getBidTitle(bid)}
                      </div>
                    )}

                    {/* Toolbar - BlockShell style */}
                    <BidTileToolbar
                      bid={bid}
                      mode={currentMode}
                      onModeChange={(mode) =>
                        handleToolbarModeChange(bid.id, mode)
                      }
                      onDelete={() => handleDeleteBid(bid.id)}
                      onSave={() => handleSaveEditedTitle(bid.id)}
                      onDiscard={handleDiscardEdit}
                      isSaving={isSavingTitle}
                    />
                  </div>

                  {/* Details */}
                  <dl className="-my-3 divide-y-2 divide-zinc-200 dark:divide-zinc-700 px-6 py-4 bg-white dark:bg-zinc-950">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-base text-gray-600 dark:text-gray-400">
                        Created
                      </dt>
                      <dd className="text-base text-gray-800 dark:text-gray-200">
                        <time dateTime={bid.created_at}>
                          {formatDate(bid.created_at)}
                        </time>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-base text-gray-600 dark:text-gray-400">
                        Sent
                      </dt>
                      <dd className="flex items-center gap-x-2">
                        {isSent(bid.status) ? (
                          <Badge variant="success">Yes</Badge>
                        ) : (
                          <Badge variant="neutral">No</Badge>
                        )}
                      </dd>
                    </div>
                  </dl>

                  {/* Action */}
                  <div className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950">
                    <Link
                      href={`/dashboard/bids/${bid.id}/edit`}
                      className="flex items-center justify-center py-4 text-base font-semibold text-gray-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      Edit bid
                    </Link>
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
