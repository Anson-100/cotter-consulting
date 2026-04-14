"use client"

import { useState } from "react"
import type { PricingBlock, LineItem } from "@/lib/validations/bid"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid"
import { InformationCircleIcon } from "@heroicons/react/24/solid"
import EditorField from "@/components/bid/editor-field"
import BlockShell from "@/components/bid/block-shell"
import ToggleSwitch from "@/components/ui/toggle-switch"
import Checkbox from "@/components/ui/checkbox"

interface HourEntry {
  id: string
  description: string
  hours: number
}

interface PricingNote {
  id: string
  heading: string
  body: string
}

interface PricingBoxProps {
  block: PricingBlock
  readOnly?: boolean
  onUpdate?: (updatedBlock: PricingBlock) => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function PricingBox({
  block,
  readOnly = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: PricingBoxProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedHeader, setEditedHeader] = useState(block.header)
  const [editedItems, setEditedItems] = useState<LineItem[]>(block.lineItems)
  const [editedDepositPercent, setEditedDepositPercent] = useState(
    block.depositPercent,
  )
  const [editedPaymentTerms, setEditedPaymentTerms] = useState(
    block.paymentTerms || "",
  )

  // Toggle states
  const [editedShowLineItems, setEditedShowLineItems] = useState(
    block.showLineItems ?? true,
  )
  const [editedShowBillableHours, setEditedShowBillableHours] = useState(
    block.showBillableHours ?? false,
  )

  // Billable hours state
  const [editedHourlyRate, setEditedHourlyRate] = useState(
    block.hourlyRate ?? 0,
  )
  const [editedHourEntries, setEditedHourEntries] = useState<HourEntry[]>(
    block.hourEntries ?? [],
  )

  // Customer visibility
  const [editedShowBreakdown, setEditedShowBreakdown] = useState(
    block.showBreakdownToCustomer ?? false,
  )

  // Notes state
  const [editedNotes, setEditedNotes] = useState<PricingNote[]>(
    block.notes ?? [],
  )

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        header: editedHeader,
        lineItems: editedItems,
        depositPercent: editedDepositPercent,
        paymentTerms: editedPaymentTerms || undefined,
        showLineItems: editedShowLineItems,
        showBillableHours: editedShowBillableHours,
        hourlyRate: editedHourlyRate,
        hourEntries: editedHourEntries,
        showBreakdownToCustomer: editedShowBreakdown,
        notes: editedNotes,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedHeader(block.header)
    setEditedItems(block.lineItems)
    setEditedDepositPercent(block.depositPercent)
    setEditedPaymentTerms(block.paymentTerms || "")
    setEditedShowLineItems(block.showLineItems ?? true)
    setEditedShowBillableHours(block.showBillableHours ?? false)
    setEditedHourlyRate(block.hourlyRate ?? 0)
    setEditedHourEntries(block.hourEntries ?? [])
    setEditedShowBreakdown(block.showBreakdownToCustomer ?? false)
    setEditedNotes(block.notes ?? [])
    setIsEditing(false)
  }

  // Line item helpers
  const updateItem = (
    index: number,
    field: keyof LineItem,
    value: string | number,
  ) => {
    const newItems = [...editedItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setEditedItems(newItems)
  }

  const addItem = () => {
    setEditedItems([
      ...editedItems,
      { id: generateId(), description: "", amount: 0 },
    ])
  }

  const removeItem = (index: number) => {
    setEditedItems(editedItems.filter((_, i) => i !== index))
  }

  // Hour entry helpers
  const updateHourEntry = (
    index: number,
    field: keyof HourEntry,
    value: string | number,
  ) => {
    const newEntries = [...editedHourEntries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setEditedHourEntries(newEntries)
  }

  const addHourEntry = () => {
    setEditedHourEntries([
      ...editedHourEntries,
      { id: generateId(), description: "", hours: 0 },
    ])
  }

  const removeHourEntry = (index: number) => {
    setEditedHourEntries(editedHourEntries.filter((_, i) => i !== index))
  }

  // Note helpers
  const updateNote = (
    index: number,
    field: keyof PricingNote,
    value: string,
  ) => {
    const newNotes = [...editedNotes]
    newNotes[index] = { ...newNotes[index], [field]: value }
    setEditedNotes(newNotes)
  }

  const addNote = () => {
    setEditedNotes([
      ...editedNotes,
      { id: generateId(), heading: "", body: "" },
    ])
  }

  const removeNote = (index: number) => {
    setEditedNotes(editedNotes.filter((_, i) => i !== index))
  }

  // Determine which sections to show
  const hideBreakdown = !isEditing && !(block.showBreakdownToCustomer ?? false)
  const showLineItems = isEditing
    ? editedShowLineItems
    : hideBreakdown
      ? false
      : (block.showLineItems ?? true)
  const showBillableHours = isEditing
    ? editedShowBillableHours
    : hideBreakdown
      ? false
      : (block.showBillableHours ?? false)
  const hourlyRate = isEditing ? editedHourlyRate : (block.hourlyRate ?? 0)
  const hourEntries = isEditing ? editedHourEntries : (block.hourEntries ?? [])
  const items = isEditing ? editedItems : block.lineItems
  const depositPct = isEditing ? editedDepositPercent : block.depositPercent
  const notes = isEditing ? editedNotes : (block.notes ?? [])

  // Computed totals — sums both sections when active
  const lineItemsTotal = showLineItems
    ? items.reduce((sum, item) => sum + item.amount, 0)
    : 0
  const totalHours = hourEntries.reduce((sum, entry) => sum + entry.hours, 0)
  const billableTotal = showBillableHours
    ? Math.round(totalHours * hourlyRate)
    : 0
  // When breakdown is hidden, still compute from raw data for totals
  const rawLineItemsTotal = items.reduce((sum, item) => sum + item.amount, 0)
  const rawBillableTotal = Math.round(
    hourEntries.reduce((sum, entry) => sum + entry.hours, 0) *
      (block.hourlyRate ?? 0),
  )
  const total = hideBreakdown
    ? rawLineItemsTotal +
      ((block.showBillableHours ?? false) ? rawBillableTotal : 0)
    : lineItemsTotal + billableTotal
  const deposit = Math.round(total * (depositPct / 100))
  const balance = total - deposit

  const hasUnsavedChanges =
    editedHeader !== block.header ||
    JSON.stringify(editedItems) !== JSON.stringify(block.lineItems) ||
    editedDepositPercent !== block.depositPercent ||
    editedPaymentTerms !== (block.paymentTerms || "") ||
    editedShowLineItems !== (block.showLineItems ?? true) ||
    editedShowBillableHours !== (block.showBillableHours ?? false) ||
    editedHourlyRate !== (block.hourlyRate ?? 0) ||
    JSON.stringify(editedHourEntries) !==
      JSON.stringify(block.hourEntries ?? []) ||
    editedShowBreakdown !== (block.showBreakdownToCustomer ?? false) ||
    JSON.stringify(editedNotes) !== JSON.stringify(block.notes ?? [])

  return (
    <BlockShell
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

      {/* Toggles (edit mode only) */}
      {isEditing && (
        <div className="flex items-center gap-6 mb-6">
          <ToggleSwitch
            checked={editedShowLineItems}
            onChange={setEditedShowLineItems}
            label="Line items"
            ariaLabel="Show line items"
          />
          <ToggleSwitch
            checked={editedShowBillableHours}
            onChange={setEditedShowBillableHours}
            label="Billable hours"
            ariaLabel="Show billable hours"
          />
        </div>
      )}

      {/* ============================== */}
      {/* LINE ITEMS SECTION             */}
      {/* ============================== */}
      {showLineItems && (
        <div className="space-y-3">
          {/* Section label when both are active */}
          {showBillableHours && (
            <h4 className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Line items
            </h4>
          )}

          {isEditing ? (
            <>
              {editedItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <EditorField
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder="Line item description"
                    />
                  </div>
                  <div className="w-28">
                    <EditorField
                      value={item.amount === 0 ? "" : String(item.amount)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "")
                        updateItem(
                          index,
                          "amount",
                          val === "" ? 0 : parseFloat(val) || 0,
                        )
                      }}
                      placeholder="$0"
                      className="text-right"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <TrashIcon className="size-5 text-red-500" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500"
              >
                <PlusIcon className="size-5" />
                <span>Add line item</span>
              </button>
            </>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-gray-600 font-semibold dark:text-gray-300">
                  {item.description}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 shrink-0">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))
          )}

          {/* Subtotal when both sections are active */}
          {showBillableHours && lineItemsTotal > 0 && (
            <div className="flex items-center justify-between pt-2 text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>{formatCurrency(lineItemsTotal)}</span>
            </div>
          )}
        </div>
      )}

      {/* Spacer between sections when both active */}
      {showLineItems && showBillableHours && (
        <div className="mt-5 mb-5 border-t border-zinc-200 dark:border-zinc-700 border-dashed" />
      )}

      {/* ============================== */}
      {/* BILLABLE HOURS SECTION         */}
      {/* ============================== */}
      {showBillableHours && (
        <div className="space-y-3">
          {/* Section label when both are active */}
          {showLineItems && (
            <h4 className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Billable hours
            </h4>
          )}

          {/* Hourly Rate (edit mode) */}
          {isEditing && (
            <div className="flex items-center gap-3 mb-4">
              <label className="font-medium text-gray-700 dark:text-gray-300 shrink-0">
                Hourly rate
              </label>
              <div className="w-28">
                <EditorField
                  value={hourlyRate === 0 ? "" : String(hourlyRate)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "")
                    setEditedHourlyRate(val === "" ? 0 : parseFloat(val) || 0)
                  }}
                  placeholder="$0/hr"
                  className="text-right"
                />
              </div>
              <span className="text-gray-500 dark:text-gray-400">/ hr</span>
            </div>
          )}

          {/* View mode: show rate */}
          {!isEditing && hourlyRate > 0 && (
            <div className="flex items-center justify-between mb-4 text-gray-600 dark:text-gray-400">
              <span className="font-medium">Rate</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {formatCurrency(hourlyRate)} / hr
              </span>
            </div>
          )}

          {/* Hour entries */}
          {isEditing ? (
            <>
              {editedHourEntries.map((entry, index) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <EditorField
                      value={entry.description}
                      onChange={(e) =>
                        updateHourEntry(index, "description", e.target.value)
                      }
                      placeholder="Work description"
                    />
                  </div>
                  <div className="w-24">
                    <EditorField
                      value={entry.hours === 0 ? "" : String(entry.hours)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "")
                        updateHourEntry(
                          index,
                          "hours",
                          val === "" ? 0 : parseFloat(val) || 0,
                        )
                      }}
                      placeholder="0 hrs"
                      className="text-right"
                    />
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 shrink-0 w-6">
                    hrs
                  </span>
                  <button
                    type="button"
                    onClick={() => removeHourEntry(index)}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <TrashIcon className="size-5 text-red-500" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addHourEntry}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500"
              >
                <PlusIcon className="size-5" />
                <span>Add hour entry</span>
              </button>
            </>
          ) : (
            hourEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-gray-600 font-semibold dark:text-gray-300">
                  {entry.description}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 shrink-0">
                  {entry.hours} hrs — {formatCurrency(entry.hours * hourlyRate)}
                </span>
              </div>
            ))
          )}

          {/* Hours summary */}
          {!isEditing && hourEntries.length > 1 && (
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-1">
              <span>
                {totalHours} total hours × {formatCurrency(hourlyRate)}/hr
              </span>
            </div>
          )}

          {/* Subtotal when both sections are active */}
          {showLineItems && billableTotal > 0 && (
            <div className="flex items-center justify-between pt-2 text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>{formatCurrency(billableTotal)}</span>
            </div>
          )}
        </div>
      )}

      {/* Totals section */}
      <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-2 border-dotted">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-800 dark:text-gray-200">
            Total
          </span>
          <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Deposit / Balance */}
        {total > 0 && (
          <>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>
                Deposit ({isEditing ? editedDepositPercent : depositPct}%)
              </span>
              <span>{formatCurrency(deposit)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Balance on completion</span>
              <span>{formatCurrency(balance)}</span>
            </div>
          </>
        )}
      </div>

      {/* ============================== */}
      {/* NOTES SECTION                  */}
      {/* ============================== */}
      {(isEditing ||
        notes.length > 0 ||
        (block.paymentTerms && !isEditing)) && (
        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-4 border-dotted">
          {/* Legacy paymentTerms (view mode only, for backward compat) */}
          {!isEditing && block.paymentTerms && notes.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400">
              {block.paymentTerms}
            </div>
          )}

          {/* Notes in view mode */}
          {!isEditing &&
            notes.map((note) => (
              <div key={note.id} className="flex gap-3">
                <InformationCircleIcon className="size-6 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {note.heading}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {note.body}
                  </p>
                </div>
              </div>
            ))}

          {/* Notes in edit mode */}
          {isEditing && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Notes
              </h4>

              {editedNotes.map((note, index) => (
                <div key={note.id} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <EditorField
                      value={note.heading}
                      onChange={(e) =>
                        updateNote(index, "heading", e.target.value)
                      }
                      placeholder="Heading (e.g. Payment terms)"
                      className="font-bold"
                    />
                    <EditorField
                      as="textarea"
                      value={note.body}
                      onChange={(e) =>
                        updateNote(index, "body", e.target.value)
                      }
                      placeholder="Details..."
                      rows={2}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNote(index)}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 mt-1"
                  >
                    <TrashIcon className="size-5 text-red-500" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addNote}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500"
              >
                <PlusIcon className="size-5" />
                <span>Add note</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Settings (edit mode) */}
      {isEditing && (
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700 dark:text-gray-300 shrink-0">
              Deposit %
            </label>
            <div className="w-20">
              <EditorField
                value={String(editedDepositPercent)}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "")
                  const num = val === "" ? 0 : Math.min(100, parseInt(val, 10))
                  setEditedDepositPercent(num)
                }}
                placeholder="50"
                className="text-right"
              />
            </div>
          </div>

          {/* Customer visibility checkbox */}
          <div className="pt-2">
            <Checkbox
              checked={editedShowBreakdown}
              onChange={setEditedShowBreakdown}
              label="Show breakdown to customer"
              description="When unchecked, customers only see the total, deposit, and balance"
            />
          </div>
        </div>
      )}
    </BlockShell>
  )
}
