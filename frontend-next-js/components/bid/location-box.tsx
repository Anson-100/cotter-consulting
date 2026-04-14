"use client"
import { useState } from "react"
import type { LocationBlock } from "@/lib/validations/bid"
import EditorField from "@/components/bid/editor-field"
import BlockShell from "@/components/bid/block-shell"

interface LocationBoxProps {
  block: LocationBlock
  readOnly?: boolean
  onUpdate?: (updatedBlock: LocationBlock) => void
  onDelete?: () => void
  // Move controls
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function LocationBox({
  block,
  readOnly = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: LocationBoxProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedHeader, setEditedHeader] = useState(block.header)
  const [editedAddress, setEditedAddress] = useState(block.address)
  const [editedUrl, setEditedUrl] = useState(block.url || "")
  const addressLines = block.address.split("\n")

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        header: editedHeader,
        address: editedAddress,
        url: editedUrl || undefined,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedHeader(block.header)
    setEditedAddress(block.address)
    setEditedUrl(block.url || "")
    setIsEditing(false)
  }

  return (
    <BlockShell
      readOnly={readOnly}
      isEditing={isEditing}
      hasUnsavedChanges={
        editedHeader !== block.header ||
        editedAddress !== block.address ||
        editedUrl !== (block.url || "")
      }
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      {/* Header */}
      {isEditing ? (
        <div className="mb-4 pr-20">
          <EditorField
            value={editedHeader}
            onChange={(e) => setEditedHeader(e.target.value)}
            placeholder="Section header"
            className="text-xl font-bold"
          />
        </div>
      ) : (
        <h3 className="text-xl text-gray-800 dark:text-gray-200 mb-4 font-bold pr-20">
          {block.header}
        </h3>
      )}

      {/* Address & URL */}
      <div className="text-gray-600 dark:text-gray-300">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-gray-500 dark:text-gray-400 mb-1">
                Address
              </label>
              <EditorField
                as="textarea"
                value={editedAddress}
                onChange={(e) => setEditedAddress(e.target.value)}
                placeholder="Enter address (use new lines for multiple lines)"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-gray-500 dark:text-gray-400 mb-1">
                Link URL for Google Maps (optional)
              </label>
              <EditorField
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        ) : (
          <>
            {block.url ? (
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start hover:underline text-sky-500"
              >
                {addressLines.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </a>
            ) : (
              <div className="flex flex-col items-start">
                {addressLines.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </BlockShell>
  )
}
