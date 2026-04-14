/* eslint-disable react-hooks/refs */
"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ContentBlock, ContentItem } from "@/lib/validations/bid"
import {
  InformationCircleIcon,
  PaintBrushIcon,
  ClockIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BoltIcon,
  StarIcon,
  TruckIcon,
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid"
import EditorField from "@/components/bid/editor-field"
import BlockShell from "@/components/bid/block-shell"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  InformationCircleIcon,
  PaintBrushIcon,
  ClockIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BoltIcon,
  StarIcon,
  TruckIcon,
}

const iconOptions = [
  { key: "InformationCircleIcon", label: "Info" },
  { key: "PaintBrushIcon", label: "Paint" },
  { key: "ClockIcon", label: "Clock" },
  { key: "CurrencyDollarIcon", label: "Dollar" },
  { key: "WrenchScrewdriverIcon", label: "Tools" },
  { key: "ShieldCheckIcon", label: "Shield" },
  { key: "DocumentTextIcon", label: "Document" },
  { key: "BoltIcon", label: "Bolt" },
  { key: "StarIcon", label: "Star" },
  { key: "TruckIcon", label: "Delivery" },
]

type EditableItem = ContentItem & { _id: string }

interface ContentBoxProps {
  block: ContentBlock
  readOnly?: boolean
  onUpdate?: (updatedBlock: ContentBlock) => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function ContentBox({
  block,
  readOnly = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ContentBoxProps) {
  const idCounter = useRef(0)
  const generateId = () => `item-${++idCounter.current}`

  const [isEditing, setIsEditing] = useState(false)
  const [editedHeader, setEditedHeader] = useState(block.header)
  const [editedItems, setEditedItems] = useState<EditableItem[]>(() =>
    block.items.map((item) => ({ ...item, _id: generateId() })),
  )
  const [editedIcon, setEditedIcon] = useState(block.icon)

  const IconComponent =
    iconMap[isEditing ? editedIcon : block.icon] || InformationCircleIcon

  const handleEdit = () => {
    setEditedHeader(block.header)
    setEditedItems(block.items.map((item) => ({ ...item, _id: generateId() })))
    setEditedIcon(block.icon)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        header: editedHeader,
        items: editedItems.map(({ _id, ...item }) => item),
        icon: editedIcon,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedHeader(block.header)
    setEditedItems(block.items.map((item) => ({ ...item, _id: generateId() })))
    setEditedIcon(block.icon)
    setIsEditing(false)
  }

  const updateItem = (
    index: number,
    field: keyof ContentItem,
    value: string,
  ) => {
    const newItems = [...editedItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setEditedItems(newItems)
  }

  const addItem = () => {
    setEditedItems([
      ...editedItems,
      { title: "", content: "", _id: generateId() },
    ])
  }

  const removeItem = (index: number) => {
    setEditedItems(editedItems.filter((_, i) => i !== index))
  }

  const moveItemUp = (index: number) => {
    if (index === 0) return
    const newItems = [...editedItems]
    ;[newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ]
    setEditedItems(newItems)
  }

  const moveItemDown = (index: number) => {
    if (index === editedItems.length - 1) return
    const newItems = [...editedItems]
    ;[newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ]
    setEditedItems(newItems)
  }

  const strippedItems = editedItems.map(({ _id, ...item }) => item)
  const hasUnsavedChanges =
    editedHeader !== block.header ||
    editedIcon !== block.icon ||
    JSON.stringify(strippedItems) !== JSON.stringify(block.items)

  return (
    <BlockShell
      readOnly={readOnly}
      isEditing={isEditing}
      hasUnsavedChanges={hasUnsavedChanges}
      onEdit={handleEdit}
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

      {/* Icon picker (edit mode only) */}
      {isEditing && (
        <div className="mb-4">
          <label className="block text-base font-medium text-gray-500 dark:text-gray-400 mb-2">
            Icon
          </label>
          <div className="flex flex-wrap gap-2">
            {iconOptions.map((opt) => {
              const Icon = iconMap[opt.key]
              const isSelected = editedIcon === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setEditedIcon(opt.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border-2 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <Icon
                    className={`size-5 ${
                      isSelected
                        ? "text-indigo-600"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-base ${
                      isSelected
                        ? "text-indigo-600 font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="text-gray-600 dark:text-gray-300 space-y-5">
        {isEditing ? (
          <>
            <AnimatePresence initial={false}>
              {editedItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2"
                >
                  <IconComponent className="size-5 text-indigo-600 mt-[3px] shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <EditorField
                      value={item.title}
                      onChange={(e) =>
                        updateItem(index, "title", e.target.value)
                      }
                      placeholder="Item title"
                      className="font-semibold text-gray-800 dark:text-gray-200"
                    />
                    <EditorField
                      as="textarea"
                      value={item.content}
                      onChange={(e) =>
                        updateItem(index, "content", e.target.value)
                      }
                      placeholder="Item content"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveItemUp(index)}
                      disabled={index === 0}
                      className={`p-1.5 rounded ${
                        index === 0
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <ChevronUpIcon className="size-5 text-gray-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItemDown(index)}
                      disabled={index === editedItems.length - 1}
                      className={`p-1.5 rounded ${
                        index === editedItems.length - 1
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <ChevronDownIcon className="size-5 text-gray-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <TrashIcon className="size-5 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500"
            >
              <PlusIcon className="size-5" />
              <span>Add item</span>
            </button>
          </>
        ) : (
          block.items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <IconComponent className="size-5 text-indigo-600 mt-[3px] shrink-0" />
              <div>
                <div className="text-gray-800 dark:text-gray-200 font-semibold">
                  {item.title}
                </div>
                <div>{item.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </BlockShell>
  )
}
