"use client"

import { useState, useEffect, useCallback } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { useBid } from "@/hooks/useBid"
import { getStarterBlocks } from "@/lib/bid-templates"
import HeaderBox from "@/components/bid/header-box"
import GreetingBox from "@/components/bid/greeting-box"
import StepTrackerBox from "@/components/bid/step-tracker-box"
import LocationBox from "@/components/bid/location-box"
import ContentBox from "@/components/bid/content-box"
import PricingBox from "@/components/bid/pricing-box"
import PhotoBox from "@/components/bid/photo-box"
import SignatureBox from "@/components/bid/signature-box"
import EditorToolbar from "@/components/bid/editor-toolbar"
import PreviewOverlay from "@/components/bid/preview-overlay"
import SendBidModal from "@/components/bid/send-bid-modal"
import Toast from "@/components/ui/toast"
import type { BidBlock } from "@/lib/validations/bid"

// Module-level stable ID system (not a ref, so safe to access during render)
let blockIdCounter = 0
const blockIdMap = new WeakMap<BidBlock, string>()

function getStableBlockId(block: BidBlock): string {
  if (!blockIdMap.has(block)) {
    blockIdMap.set(block, `block-${blockIdCounter++}`)
  }
  return blockIdMap.get(block)!
}

interface BidEditorProps {
  bidId?: string
  isMobileView?: boolean
  onToggleMobileView?: () => void
}

// Move controls passed to block components
interface MoveControls {
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

export default function BidEditor({
  bidId,
  isMobileView,
  onToggleMobileView,
}: BidEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")
  const [toastLoading, setToastLoading] = useState(false)

  const {
    bidId: currentBidId,
    blocks,
    isLoading,
    saveStatus,
    error,
    updateBlock,
    addBlock,
    removeBlock,
    reorderBlocks,
  } = useBid(bidId, {
    initialBlocks: getStarterBlocks(),
  })

  // Drive toast from saveStatus changes
  useEffect(() => {
    if (saveStatus === "saving") {
      setToastMessage("Saving...")
      setToastType("success")
      setToastLoading(true)
      setShowToast(true)
    } else if (saveStatus === "saved") {
      setToastMessage("Bid saved")
      setToastType("success")
      setToastLoading(false)
    } else if (saveStatus === "error") {
      setToastMessage(error || "Save failed")
      setToastType("error")
      setToastLoading(false)
    }
  }, [saveStatus, error])

  const handleToastDismiss = useCallback(() => {
    setShowToast(false)
  }, [])

  const renderBlock = (
    block: BidBlock,
    index: number,
    moveControls?: MoveControls,
  ) => {
    switch (block.type) {
      case "header":
        return (
          <HeaderBox
            key={`header-${index}`}
            block={block}
            bidId={currentBidId}
            onUpdate={(updated) => updateBlock(index, updated)}
          />
        )

      case "greeting":
        return (
          <GreetingBox
            key={`greeting-${index}`}
            block={block}
            onUpdate={(updated) => updateBlock(index, updated)}
            onDelete={() => removeBlock(index)}
            {...moveControls}
          />
        )

      case "stepTracker":
        return (
          <StepTrackerBox
            key={`steps-${index}`}
            block={block}
            onUpdate={(updated) => updateBlock(index, updated)}
            onDelete={() => removeBlock(index)}
            {...moveControls}
          />
        )

      case "location":
        return (
          <LocationBox
            key={`location-${index}`}
            block={block}
            onUpdate={(updated) => updateBlock(index, updated)}
            onDelete={() => removeBlock(index)}
            {...moveControls}
          />
        )

      case "content":
        return (
          <ContentBox
            key={`content-${index}`}
            block={block}
            onUpdate={(updated) => updateBlock(index, updated)}
            onDelete={() => removeBlock(index)}
            {...moveControls}
          />
        )

      case "pricing":
        return (
          <PricingBox
            key={`pricing-${index}`}
            block={block}
            onUpdate={(updated) => updateBlock(index, updated)}
            onDelete={() => removeBlock(index)}
            {...moveControls}
          />
        )

      case "photo":
        return (
          <PhotoBox
            key={`photo-${index}`}
            block={block}
            bidId={currentBidId || ""}
            onUpdate={(updated) => updateBlock(index, updated)}
            onDelete={() => removeBlock(index)}
            {...moveControls}
          />
        )

      case "signature":
        return (
          <SignatureBox
            key={`signature-${index}`}
            block={block}
            onUpdate={(updated) => updateBlock(index, updated)}
            onDelete={() => removeBlock(index)}
            {...moveControls}
          />
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-zinc-900 bg-zinc-100">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading bid...</span>
        </div>
      </div>
    )
  }

  const headerBlock = blocks.find((b) => b.type === "header")
  const headerIndex = blocks.findIndex((b) => b.type === "header")
  const bodyBlocks = blocks.filter((b) => b.type !== "header")

  return (
    <>
      {/* Preview Overlay */}
      {showPreview && currentBidId && (
        <PreviewOverlay
          blocks={blocks}
          bidId={currentBidId}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Send Modal — always mounted, `open` controls visibility so AnimatePresence can animate exit */}
      {currentBidId && (
        <SendBidModal
          open={showSendModal}
          onClose={() => setShowSendModal(false)}
          bidId={currentBidId}
        />
      )}

      <section
        id="home"
        className="min-h-screen pb-20 relative isolate overflow-hidden dark:bg-zinc-900 bg-zinc-100"
      >
        {/* Save toast */}
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            loading={toastLoading}
            onDismiss={handleToastDismiss}
            duration={3000}
          />
        )}

        {/* Editor Toolbar - fixed bottom nav */}
        <EditorToolbar
          bidId={currentBidId}
          blocks={blocks}
          onAddBlock={addBlock}
          onPreview={() => setShowPreview(true)}
          onSend={() => setShowSendModal(true)}
          isMobileView={isMobileView}
          onToggleMobileView={onToggleMobileView}
        />

        {headerBlock && headerBlock.type === "header" && (
          <HeaderBox
            block={headerBlock}
            bidId={currentBidId}
            onUpdate={(updated) => updateBlock(headerIndex, updated)}
          />
        )}

        <div className="relative isolate w-11/12 @lg:max-w-7xl mx-auto">
          <div className="mb-8 mt-12"></div>

          <LayoutGroup>
            {bodyBlocks.map((block, bodyIndex) => {
              const actualIndex = blocks.findIndex((b) => b === block)
              const canMoveUp = bodyIndex > 0
              const canMoveDown = bodyIndex < bodyBlocks.length - 1

              const moveControls: MoveControls = {
                canMoveUp,
                canMoveDown,
                onMoveUp: () => {
                  if (canMoveUp) {
                    const prevBlock = bodyBlocks[bodyIndex - 1]
                    const prevActualIndex = blocks.findIndex(
                      (b) => b === prevBlock,
                    )
                    reorderBlocks(actualIndex, prevActualIndex)
                  }
                },
                onMoveDown: () => {
                  if (canMoveDown) {
                    const nextBlock = bodyBlocks[bodyIndex + 1]
                    const nextActualIndex = blocks.findIndex(
                      (b) => b === nextBlock,
                    )
                    reorderBlocks(actualIndex, nextActualIndex)
                  }
                },
              }

              return (
                <motion.div
                  key={getStableBlockId(block)}
                  layout
                  transition={{
                    layout: { duration: 0.25, ease: "easeInOut" },
                  }}
                >
                  {renderBlock(block, actualIndex, moveControls)}
                </motion.div>
              )
            })}
          </LayoutGroup>
        </div>
      </section>
    </>
  )
}
