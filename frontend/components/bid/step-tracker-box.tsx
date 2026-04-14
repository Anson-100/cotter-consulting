"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import type { StepTrackerBlock, Step, Substep } from "@/lib/validations/bid"
import EditorField from "@/components/bid/editor-field"
import BlockShell from "@/components/bid/block-shell"

function classNames(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ")
}

interface StepTrackerBoxProps {
  block: StepTrackerBlock
  readOnly?: boolean
  onUpdate?: (updatedBlock: StepTrackerBlock) => void
  onDelete?: () => void
  // Move controls
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

const MIN_STEPS = 1
const MAX_STEPS = 3

export default function StepTrackerBox({
  block,
  readOnly = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: StepTrackerBoxProps) {
  const [openStep, setOpenStep] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Editing state
  const [editedHeader, setEditedHeader] = useState(block.header)
  const [editedSubtitle, setEditedSubtitle] = useState(block.subtitle || "")
  const [editedSteps, setEditedSteps] = useState<Step[]>(block.steps)

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        header: editedHeader,
        subtitle: editedSubtitle || undefined,
        steps: editedSteps,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedHeader(block.header)
    setEditedSubtitle(block.subtitle || "")
    setEditedSteps(block.steps)
    setIsEditing(false)
  }

  // Step operations
  const addStep = () => {
    if (editedSteps.length >= MAX_STEPS) return
    const newStep: Step = {
      id: String(editedSteps.length + 1),
      name: `Step ${editedSteps.length + 1}`,
      description: "Description",
      status: "upcoming",
      substeps: [],
    }
    setEditedSteps([...editedSteps, newStep])
  }

  const removeStep = (index: number) => {
    if (editedSteps.length <= MIN_STEPS) return
    const newSteps = editedSteps.filter((_, i) => i !== index)
    // Re-number the step IDs
    const renumbered = newSteps.map((step, i) => ({
      ...step,
      id: String(i + 1),
    }))
    setEditedSteps(renumbered)
  }

  const updateStep = (index: number, field: keyof Step, value: string) => {
    const newSteps = [...editedSteps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setEditedSteps(newSteps)
  }

  // Substep operations
  const addSubstep = (stepIndex: number) => {
    const newSteps = [...editedSteps]
    const step = newSteps[stepIndex]
    const substeps = step.substeps || []
    const newSubstep: Substep = {
      id: String(substeps.length + 1),
      name: "New substep",
      status: "upcoming",
    }
    newSteps[stepIndex] = {
      ...step,
      substeps: [...substeps, newSubstep],
    }
    setEditedSteps(newSteps)
  }

  const removeSubstep = (stepIndex: number, substepIndex: number) => {
    const newSteps = [...editedSteps]
    const step = newSteps[stepIndex]
    const substeps = (step.substeps || []).filter((_, i) => i !== substepIndex)
    // Re-number substep IDs
    const renumbered = substeps.map((sub, i) => ({
      ...sub,
      id: String(i + 1),
    }))
    newSteps[stepIndex] = { ...step, substeps: renumbered }
    setEditedSteps(newSteps)
  }

  const updateSubstep = (
    stepIndex: number,
    substepIndex: number,
    value: string,
  ) => {
    const newSteps = [...editedSteps]
    const step = newSteps[stepIndex]
    const substeps = [...(step.substeps || [])]
    substeps[substepIndex] = { ...substeps[substepIndex], name: value }
    newSteps[stepIndex] = { ...step, substeps }
    setEditedSteps(newSteps)
  }

  // View mode - use block data
  // Edit mode - use edited state
  const displaySteps = isEditing ? editedSteps : block.steps

  return (
    <BlockShell
      variant="flush"
      readOnly={readOnly}
      isEditing={isEditing}
      hasUnsavedChanges={
        editedHeader !== block.header ||
        editedSubtitle !== (block.subtitle || "") ||
        JSON.stringify(editedSteps) !== JSON.stringify(block.steps)
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
      {/* Header Section */}
      <div className="text-xl font-bold px-6 py-4 text-gray-800 dark:text-gray-200 pr-24">
        {isEditing ? (
          <div className="space-y-2">
            <EditorField
              value={editedHeader}
              onChange={(e) => setEditedHeader(e.target.value)}
              placeholder="Section header"
              className="text-xl font-bold"
            />
            <EditorField
              value={editedSubtitle}
              onChange={(e) => setEditedSubtitle(e.target.value)}
              placeholder="Subtitle (optional)"
              className="text-base"
            />
          </div>
        ) : (
          <>
            <p>
              <span className="text-gray-800 dark:text-gray-200">
                {block.header}
              </span>
            </p>
            {block.subtitle && (
              <p className="text-base text-gray-600 dark:text-gray-300">
                {block.subtitle}
              </p>
            )}
          </>
        )}
      </div>

      <div className="w-full h-px bg-zinc-200 dark:bg-zinc-700 mx-auto"></div>

      {/* Steps */}
      <nav aria-label="Progress" className="mx-auto">
        <ol className="overflow-visible rounded-md @lg:flex @lg:rounded-md @lg:border-zinc-200 dark:border-zinc-700">
          {displaySteps.map((step, stepIdx) => (
            <li key={step.id} className="relative overflow-visible @lg:flex-1">
              <div
                className={classNames(
                  stepIdx === displaySteps.length - 1
                    ? "rounded-b-md border-b-0"
                    : "border-b",
                  "overflow-visible border-zinc-200 dark:border-zinc-700 @lg:border-0 relative",
                )}
              >
                {/* Step Content */}
                {isEditing ? (
                  // Edit mode step
                  <div
                    className={classNames(
                      stepIdx !== 0 ? "@lg:pl-9" : "",
                      "px-6 py-6",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step number indicator */}
                      <span className="shrink-0">
                        <span className="flex size-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700">
                          <span className="font-semibold text-gray-600 dark:text-gray-300">
                            {stepIdx + 1}
                          </span>
                        </span>
                      </span>

                      {/* Step fields */}
                      <div className="flex-1 space-y-2">
                        <EditorField
                          value={step.name}
                          onChange={(e) =>
                            updateStep(stepIdx, "name", e.target.value)
                          }
                          placeholder="Step name"
                          className="font-semibold"
                        />
                        <EditorField
                          value={step.description || ""}
                          onChange={(e) =>
                            updateStep(stepIdx, "description", e.target.value)
                          }
                          placeholder="Description (optional)"
                        />

                        {/* Substeps */}
                        <div className="mt-3 space-y-2">
                          <p className=" font-semibold text-gray-500 dark:text-gray-400">
                            Substeps
                          </p>
                          {(step.substeps || []).map((sub, subIdx) => (
                            <div
                              key={sub.id}
                              className="flex items-center gap-2"
                            >
                              <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                              <EditorField
                                value={sub.name}
                                onChange={(e) =>
                                  updateSubstep(stepIdx, subIdx, e.target.value)
                                }
                                placeholder="Substep name"
                                className="flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => removeSubstep(stepIdx, subIdx)}
                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                              >
                                <TrashIcon className="size-4 text-red-500" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addSubstep(stepIdx)}
                            className="flex items-center gap-1  text-indigo-600 hover:text-indigo-500"
                          >
                            <PlusIcon className="size-4" />
                            <span>Add substep</span>
                          </button>
                        </div>
                      </div>

                      {/* Remove step button */}
                      {editedSteps.length > MIN_STEPS && (
                        <button
                          type="button"
                          onClick={() => removeStep(stepIdx)}
                          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <TrashIcon className="size-6 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // View mode step (original UI)
                  <button
                    type="button"
                    onClick={() =>
                      setOpenStep(openStep === step.id ? null : step.id)
                    }
                    className="group w-full text-left hover:cursor-pointer"
                  >
                    <span
                      className={classNames(
                        stepIdx !== 0 ? "@lg:pl-9" : "",
                        "flex items-center px-6 py-8 font-semibold",
                      )}
                    >
                      {/* Step Indicator */}
                      <span className="shrink-0">
                        <span
                          className={classNames(
                            "flex size-10 items-center justify-center rounded-full",
                            step.status === "complete"
                              ? "bg-indigo-600"
                              : step.status === "current"
                                ? "border border-indigo-600"
                                : "border border-zinc-200 dark:border-zinc-700",
                          )}
                        >
                          {step.status === "complete" ? (
                            <CheckIcon
                              aria-hidden="true"
                              className="size-6 text-white"
                            />
                          ) : (
                            <span
                              className={classNames(
                                "font-semibold",
                                step.status === "current"
                                  ? "text-indigo-600"
                                  : "text-gray-600 dark:text-gray-300",
                              )}
                            >
                              {step.id}
                            </span>
                          )}
                        </span>
                      </span>

                      {/* Step Title and Description */}
                      <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
                        <span
                          className={classNames(
                            "text-base font-semibold",
                            step.status === "current"
                              ? "text-indigo-600"
                              : step.status === "complete"
                                ? "text-indigo-600"
                                : "text-gray-600 dark:text-gray-300",
                          )}
                        >
                          {step.name}
                        </span>
                        {step.description && (
                          <span
                            className={classNames(
                              "font-semibold",
                              step.status === "current"
                                ? "text-gray-600 dark:text-gray-300"
                                : step.status === "complete"
                                  ? "text-gray-700"
                                  : "text-gray-600 dark:text-gray-300",
                            )}
                          >
                            {step.description}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                )}

                {/* Dropdown Substeps - only in view mode */}
                {!isEditing && (
                  <AnimatePresence initial={false} mode="wait">
                    {openStep === step.id &&
                      step.substeps &&
                      step.substeps.length > 0 && (
                        <motion.div
                          key="dropdown"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.1, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <ul className="@lg:mt-2 px-6 pt-4 pb-4 space-y-2 bg-white dark:bg-zinc-950 @lg:absolute @lg:left-0 @lg:right-0 @lg:top-full @lg:z-20 border-t @lg:border border-zinc-200 dark:border-zinc-700 @lg:rounded-md rounded-b-md shadow-xl">
                            {step.substeps.map((sub) => (
                              <li
                                key={sub.id}
                                className="flex items-center gap-2 font-semibold"
                              >
                                {sub.status === "complete" ? (
                                  <CheckIcon className="w-5 text-indigo-500 p-0.5 border shrink-0 border-indigo-500 rounded-full" />
                                ) : sub.status === "current" ? (
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-gray-500 shrink-0" />
                                )}
                                <span
                                  className={classNames(
                                    sub.status === "current"
                                      ? "text-indigo-600"
                                      : sub.status === "complete"
                                        ? "text-gray-700"
                                        : "text-gray-600 dark:text-gray-300",
                                  )}
                                >
                                  {sub.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                  </AnimatePresence>
                )}
              </div>

              {/* Jagged Divider - hidden during edit mode */}
              {stepIdx !== 0 && !isEditing && (
                <div
                  aria-hidden="true"
                  className="hidden @lg:block absolute top-0 bottom-0 left-0 w-3"
                >
                  <svg
                    className="h-full w-full text-zinc-200 dark:text-zinc-700"
                    viewBox="0 0 12 82"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0.5 0V31L10.5 41L0.5 51V82"
                      stroke="currentColor"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Add Step Button - only in edit mode */}
      {isEditing && editedSteps.length < MAX_STEPS && (
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-semibold"
          >
            <PlusIcon className="size-6" />
            <span>Add step</span>
          </button>
        </div>
      )}
    </BlockShell>
  )
}
