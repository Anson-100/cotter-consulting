"use client"

import { useState, useEffect, useRef } from "react"
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline"

interface BlockShellProps {
  children: React.ReactNode
  variant?: "default" | "header" | "photo" | "flush" | "bare"
  readOnly?: boolean
  isEditing?: boolean
  hasUnsavedChanges?: boolean
  /** When true, clicking the block body does NOT enter edit mode — only the pencil icon does. */
  disableClickToEdit?: boolean
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
  onDelete?: () => void
  // Reorder props
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function BlockShell({
  children,
  variant = "default",
  readOnly = false,
  isEditing = false,
  hasUnsavedChanges = false,
  disableClickToEdit = false,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: BlockShellProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Determine if toolbar should show
  const showToolbar = !readOnly && (onEdit || onSave || onCancel)

  // Show move controls for non-header, non-readOnly blocks
  const showMoveControls =
    variant !== "header" && !readOnly && (onMoveUp || onMoveDown)

  // Container classes based on variant
  const containerClasses = {
    default:
      "mt-6 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 px-6 py-4",
    header:
      "bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4",
    photo:
      "mt-6 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 px-6 py-4",
    flush:
      "mt-6 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950",
    bare: "mt-6 py-4",
  }

  // Header variant doesn't get delete button (there's always exactly one header)
  const showDelete = variant !== "header" && onDelete

  // Can click to edit when: not editing, not readOnly, onEdit exists, and not disabled
  const canClickToEdit =
    !isEditing && !readOnly && onEdit && !disableClickToEdit

  // Handle escape key
  useEffect(() => {
    if (!isEditing && !showDeleteConfirm) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false)
        } else if (hasUnsavedChanges) {
          setShowUnsavedWarning(true)
        } else {
          onCancel?.()
        }
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isEditing, showDeleteConfirm, hasUnsavedChanges, onCancel])

  // Handle click outside
  useEffect(() => {
    if (!isEditing) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (hasUnsavedChanges) {
          setShowUnsavedWarning(true)
        } else {
          onCancel?.()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isEditing, hasUnsavedChanges, onCancel])

  const handleContainerClick = () => {
    if (canClickToEdit && !showDeleteConfirm) {
      onEdit?.()
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
    onDelete?.()
  }

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.()
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowUnsavedWarning(false)
    onSave?.()
  }

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowUnsavedWarning(false)
    onCancel?.()
  }

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMoveUp?.()
  }

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMoveDown?.()
  }

  return (
    <div
      ref={containerRef}
      className={`${containerClasses[variant]} relative ${
        variant === "flush" ? "overflow-visible" : ""
      } ${
        canClickToEdit
          ? "cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 "
          : ""
      }`}
      onClick={handleContainerClick}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
          {isEditing ? (
            <>
              {/* Unsaved changes warning */}
              {showUnsavedWarning && (
                <div className="text-base flex flex-col absolute bottom-12 right-0 bg-white dark:bg-zinc-950 w-56 rounded-md py-2 px-3 border-zinc-200 dark:border-zinc-700 border-2">
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    Unsaved changes
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Click save or cancel first
                  </span>
                </div>
              )}
              {/* Save */}
              {onSave && (
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="p-1.5 rounded bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  <CheckIcon className="size-6 text-white" />
                </button>
              )}
              {/* Cancel */}
              {onCancel && (
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="p-1.5 rounded bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                >
                  <XMarkIcon className="size-6 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </>
          ) : showDeleteConfirm ? (
            // Delete confirmation
            <div className="flex relative items-center gap-2 bg-white dark:bg-zinc-950  border-zinc-100 dark:border-zinc-700 rounded-lg  ">
              <div className="text-base flex flex-col absolute bottom-12 bg-white dark:bg-zinc-950 w-26 rounded-md py-2 px-3 border-zinc-200 dark:border-zinc-700 border-2">
                <span className="font-medium text-red-600 dark:text-red-400 ">
                  Delete?
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 ">
                  No undo
                </span>
              </div>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="p-1.5 rounded bg-red-600 hover:bg-red-700"
              >
                <CheckIcon className="size-6 text-white" />
              </button>
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="p-1.5 rounded bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                <XMarkIcon className="size-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          ) : (
            <>
              {/* Delete - subtle (not shown for header) */}
              {showDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="p-1.5 rounded opacity-70 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <TrashIcon className="size-6 text-red-600 dark:text-red-400" />
                </button>
              )}
              {/* Edit */}
              {onEdit && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <PencilIcon className="size-6 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Content */}
      {children}

      {/* Move controls - bottom bar */}
      {showMoveControls && (
        <div className="mt-8 py-4">
          <div className="absolute bottom-0 left-0 w-full">
            <div className=" flex gap-2 mt-4 border-t border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <button
                type="button"
                onClick={handleMoveUp}
                disabled={!canMoveUp}
                className={`flex-1 flex items-center justify-center gap-2 py-2  font-medium  ${
                  canMoveUp
                    ? "text-gray-700 dark:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                <ChevronUpIcon className="size-5" />
                Move up
              </button>
              <button
                type="button"
                onClick={handleMoveDown}
                disabled={!canMoveDown}
                className={`flex-1 flex items-center justify-center gap-2 py-2  font-medium  ${
                  canMoveDown
                    ? "text-gray-700 dark:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                Move down
                <ChevronDownIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
