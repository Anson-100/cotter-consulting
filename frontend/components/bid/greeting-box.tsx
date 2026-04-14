/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import type { GreetingBlock } from "@/lib/validations/bid"
import EditorField from "@/components/bid/editor-field"
import BlockShell from "@/components/bid/block-shell"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

interface GreetingBoxProps {
  block: GreetingBlock
  readOnly?: boolean
  onUpdate?: (updatedBlock: GreetingBlock) => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function GreetingBox({
  block,
  readOnly = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: GreetingBoxProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedJobName, setEditedJobName] = useState(block.jobName)
  const [editedRecipientName, setEditedRecipientName] = useState(
    block.recipientName || "",
  )
  const [greeting, setGreeting] = useState(getGreeting())

  useEffect(() => {
    setGreeting(getGreeting())
    const interval = setInterval(() => setGreeting(getGreeting()), 60000)
    return () => clearInterval(interval)
  }, [])

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        jobName: editedJobName,
        recipientName: editedRecipientName || undefined,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedJobName(block.jobName)
    setEditedRecipientName(block.recipientName || "")
    setIsEditing(false)
  }

  const hasUnsavedChanges =
    editedJobName !== block.jobName ||
    editedRecipientName !== (block.recipientName || "")

  return (
    <BlockShell
      variant="bare"
      readOnly={readOnly}
      isEditing={isEditing}
      hasUnsavedChanges={hasUnsavedChanges}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      {isEditing ? (
        <div className="pr-20">
          <div className="flex items-baseline gap-0">
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 shrink-0">
              {greeting}
              {editedRecipientName ? "," : ""}
            </p>
            <div className="max-w-64">
              <EditorField
                value={editedRecipientName}
                onChange={(e) => setEditedRecipientName(e.target.value)}
                placeholder=""
                className="text-lg font-semibold text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>
          <EditorField
            value={editedJobName}
            onChange={(e) => setEditedJobName(e.target.value)}
            placeholder="Your job title here"
            className="text-4xl font-semibold"
          />
        </div>
      ) : (
        <div>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-2">
            {greeting}
            {block.recipientName || "" ? `, ${block.recipientName}` : ""}
          </p>
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-200">
            {block.jobName}
          </h2>
        </div>
      )}
    </BlockShell>
  )
}
