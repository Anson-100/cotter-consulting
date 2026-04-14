"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import SignaturePad from "signature_pad"
import type { SignatureBlock, Signer } from "@/lib/validations/bid"
import { PlusIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid"
import EditorField from "@/components/bid/editor-field"
import BlockShell from "@/components/bid/block-shell"
import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"

interface SignatureBoxProps {
  block: SignatureBlock
  readOnly?: boolean
  onUpdate?: (updatedBlock: SignatureBlock) => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

// ============================================
// Signature Canvas — one per signer
// ============================================

function SignatureCanvas({
  signer,
  readOnly,
  onSign,
  onClear,
}: {
  signer: Signer
  readOnly: boolean
  onSign: (dataUrl: string) => void
  onClear: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePad | null>(null)
  const [hasStrokes, setHasStrokes] = useState(!!signer.signatureData)
  const isSaved = !!signer.dateSigned

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    const ctx = canvas.getContext("2d")
    ctx?.scale(ratio, ratio)
    if (padRef.current && signer.signatureData) {
      padRef.current.fromDataURL(signer.signatureData, {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
      })
    }
  }, [signer.signatureData])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgba(0,0,0,0)",
      penColor: "#1f2937",
    })
    padRef.current = pad

    if (readOnly || isSaved) {
      pad.off()
    }

    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    const ctx = canvas.getContext("2d")
    ctx?.scale(ratio, ratio)

    if (signer.signatureData) {
      pad.fromDataURL(signer.signatureData, {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
      })
    }

    pad.addEventListener("endStroke", () => {
      setHasStrokes(true)
      onSign(pad.toDataURL("image/png"))
    })

    const handleResize = () => resizeCanvas()
    window.addEventListener("resize", handleResize)

    return () => {
      pad.off()
      window.removeEventListener("resize", handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, isSaved])

  const handleClear = () => {
    padRef.current?.clear()
    setHasStrokes(false)
    onClear()
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        className={`w-full h-28 border rounded touch-none ${
          isSaved
            ? "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10"
            : "border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900"
        }`}
      />

      {/* Signature label + inline Clear */}
      <div className="flex items-center justify-between pt-1 mt-1">
        <span className="text-gray-500 dark:text-gray-400 tracking-wide">
          Signature
        </span>
        {!readOnly && !isSaved && hasStrokes && (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Saved confirmation */}
      {isSaved && (
        <div className="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400 font-semibold">
          <CheckIcon className="size-5" />
          Signed {signer.dateSigned}
        </div>
      )}
    </div>
  )
}

// ============================================
// Signer view — canvas + typeable fields + save
// ============================================

function SignerView({
  signer,
  readOnly,
  onSign,
  onClear,
  onSave,
  onFieldChange,
}: {
  signer: Signer
  readOnly: boolean
  onSign: (dataUrl: string) => void
  onClear: () => void
  onSave: () => void
  onFieldChange: (updates: Partial<Signer>) => void
}) {
  const isSaved = !!signer.dateSigned
  const hasSignature = !!signer.signatureData
  const hasName = !!(signer.signerName && signer.signerName.trim())

  // Save requires signature + printed name at minimum
  const canSave = hasSignature && hasName

  return (
    <div className="space-y-4">
      {signer.label && (
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {signer.label}
        </span>
      )}

      {/* Signature canvas */}
      <SignatureCanvas
        signer={signer}
        readOnly={readOnly}
        onSign={onSign}
        onClear={onClear}
      />

      {/* Typeable fields — dotted underline style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <FormInput
          variant="signature"
          label="Printed name"
          placeholder="Full name"
          value={signer.signerName || ""}
          onChange={(e) => onFieldChange({ signerName: e.target.value })}
          disabled={isSaved}
        />
        <FormInput
          variant="signature"
          label="Title"
          placeholder="e.g. Property Owner"
          value={signer.signerTitle || ""}
          onChange={(e) => onFieldChange({ signerTitle: e.target.value })}
          disabled={isSaved}
        />
        {/* Date — auto-filled on save, always disabled */}
        <div className="w-full">
          <div className="relative">
            <input
              type="text"
              value={signer.dateSigned || ""}
              disabled
              placeholder="Auto-filled on save"
              className="
                block w-full bg-transparent
                px-0 py-1.5 text-base
                text-zinc-800 dark:text-gray-200
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                border-b-2 border-dotted border-zinc-300 dark:border-zinc-600
                outline-none
                disabled:opacity-60
              "
            />
          </div>
          <span className="block mt-1 text-gray-500 dark:text-gray-400 tracking-wide">
            Date
          </span>
        </div>
      </div>

      {/* Save button — locks everything in */}
      {!readOnly && !isSaved && (
        <div className="pt-2">
          <Button
            variant="primary"
            disabled={!canSave}
            onClick={onSave}
            className="w-full justify-center"
          >
            <CheckIcon className="size-5" />
            Save signature
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================
// Main component
// ============================================

export default function SignatureBox({
  block,
  readOnly = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SignatureBoxProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedHeader, setEditedHeader] = useState(block.header)
  const [editedBodyText, setEditedBodyText] = useState(block.bodyText || "")
  const [editedSigners, setEditedSigners] = useState<Signer[]>(
    block.signers || [],
  )

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        header: editedHeader,
        bodyText: editedBodyText || undefined,
        signers: editedSigners,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedHeader(block.header)
    setEditedBodyText(block.bodyText || "")
    setEditedSigners(block.signers || [])
    setIsEditing(false)
  }

  const addSigner = () => {
    setEditedSigners([...editedSigners, { id: generateId(), label: "Signer" }])
  }

  const removeSigner = (index: number) => {
    setEditedSigners(editedSigners.filter((_, i) => i !== index))
  }

  const updateSigner = (index: number, updates: Partial<Signer>) => {
    const next = [...editedSigners]
    next[index] = { ...next[index], ...updates }
    setEditedSigners(next)
  }

  // Live sign — saves signature data directly
  const handleLiveSign = (signerIndex: number, dataUrl: string) => {
    if (onUpdate) {
      const next = [...(block.signers || [])]
      next[signerIndex] = { ...next[signerIndex], signatureData: dataUrl }
      onUpdate({ ...block, signers: next })
    }
  }

  // Field change — updates name/title in real time
  const handleFieldChange = (signerIndex: number, updates: Partial<Signer>) => {
    if (onUpdate) {
      const next = [...(block.signers || [])]
      next[signerIndex] = { ...next[signerIndex], ...updates }
      onUpdate({ ...block, signers: next })
    }
  }

  // Save — locks in signature + fields with a date stamp
  const handleLiveSave = (signerIndex: number) => {
    if (onUpdate) {
      const next = [...(block.signers || [])]
      const today = new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      next[signerIndex] = { ...next[signerIndex], dateSigned: today }
      onUpdate({ ...block, signers: next })
    }
  }

  // Clear — resets signature data and date
  const handleLiveClear = (signerIndex: number) => {
    if (onUpdate) {
      const next = [...(block.signers || [])]
      next[signerIndex] = {
        ...next[signerIndex],
        signatureData: undefined,
        dateSigned: undefined,
      }
      onUpdate({ ...block, signers: next })
    }
  }

  const hasUnsavedChanges =
    editedHeader !== block.header ||
    editedBodyText !== (block.bodyText || "") ||
    JSON.stringify(editedSigners) !== JSON.stringify(block.signers || [])

  const signers = isEditing ? editedSigners : block.signers || []

  return (
    <BlockShell
      readOnly={readOnly}
      isEditing={isEditing}
      hasUnsavedChanges={hasUnsavedChanges}
      disableClickToEdit
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

      {/* Body / agreement text */}
      {isEditing ? (
        <div className="mb-6">
          <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
            Agreement text
          </label>
          <EditorField
            as="textarea"
            value={editedBodyText}
            onChange={(e) => setEditedBodyText(e.target.value)}
            placeholder="By signing below, I authorize the work described in this estimate..."
            rows={3}
          />
        </div>
      ) : (
        block.bodyText && (
          <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">
            {block.bodyText}
          </p>
        )
      )}

      {/* Signers */}
      <div className="space-y-8">
        {signers.map((signer, index) => (
          <div key={signer.id} className="pt-4">
            {isEditing ? (
              /* ---- Edit mode: configure signer fields ---- */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <EditorField
                    value={signer.label}
                    onChange={(e) =>
                      updateSigner(index, { label: e.target.value })
                    }
                    placeholder="e.g. Contractor, Customer"
                    className="font-semibold "
                  />
                  {editedSigners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSigner(index)}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 ml-2 shrink-0"
                    >
                      <TrashIcon className="size-5 text-red-500" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      Name
                    </label>
                    <EditorField
                      value={signer.signerName || ""}
                      onChange={(e) =>
                        updateSigner(index, { signerName: e.target.value })
                      }
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      Title / role
                    </label>
                    <EditorField
                      value={signer.signerTitle || ""}
                      onChange={(e) =>
                        updateSigner(index, { signerTitle: e.target.value })
                      }
                      placeholder="e.g. Property Owner"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* ---- View mode: canvas + typeable fields + save ---- */
              <SignerView
                signer={signer}
                readOnly={readOnly}
                onSign={(dataUrl) => handleLiveSign(index, dataUrl)}
                onClear={() => handleLiveClear(index)}
                onSave={() => handleLiveSave(index)}
                onFieldChange={(updates) => handleFieldChange(index, updates)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add signer button (edit mode only) */}
      {isEditing && (
        <button
          type="button"
          onClick={addSigner}
          className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium"
        >
          <PlusIcon className="size-5" />
          <span>Add signature</span>
        </button>
      )}
    </BlockShell>
  )
}
