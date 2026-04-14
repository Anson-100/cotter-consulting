"use client"

import { useState, useEffect } from "react"
import CloseButton from "@/components/ui/close-button"
import type { BidBlock, HeaderBlock } from "@/lib/validations/bid"
import HeaderBox from "@/components/bid/header-box"
import GreetingBox from "@/components/bid/greeting-box"
import StepTrackerBox from "@/components/bid/step-tracker-box"
import LocationBox from "@/components/bid/location-box"
import ContentBox from "@/components/bid/content-box"
import PricingBox from "@/components/bid/pricing-box"
import PhotoBox from "@/components/bid/photo-box"
import SignatureBox from "@/components/bid/signature-box"
import BidActionFooter from "@/components/bid/bid-action-footer"
import BidStatusFooter from "@/components/bid/bid-status-footer"
import ConfirmAcceptModal from "@/components/bid/confirm-accept-modal"
import ConfirmDeclineModal from "@/components/bid/confirm-decline-modal"
import SendQuestionModal from "@/components/bid/send-question-modal"

interface PreviewOverlayProps {
  blocks: BidBlock[]
  bidId: string
  onClose: () => void
}

export default function PreviewOverlay({
  blocks,
  bidId,
  onClose,
}: PreviewOverlayProps) {
  // Toggle for testing interactions
  const [testMode, setTestMode] = useState(false)

  // Modal states (only used when testMode is true)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [questionDefaultMessage, setQuestionDefaultMessage] = useState("")

  // Status state for testing the full flow
  const [localStatus, setLocalStatus] = useState<
    "pending" | "accepted" | "declined"
  >("pending")
  const [statusDate, setStatusDate] = useState<Date | null>(null)
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Reset status when toggling test mode off
  useEffect(() => {
    if (!testMode) {
      setLocalStatus("pending")
      setStatusDate(null)
      setCustomerEmail(null)
    }
  }, [testMode])

  const headerBlock = blocks.find((b): b is HeaderBlock => b.type === "header")
  const bodyBlocks = blocks.filter((b) => b.type !== "header")

  // Extract contact info from header for the footer
  const contactPhone = headerBlock?.phone
  const contactEmail = headerBlock?.email

  const renderBlock = (block: BidBlock, index: number) => {
    switch (block.type) {
      case "header":
        return <HeaderBox key={`header-${index}`} block={block} readOnly />
      case "greeting":
        return <GreetingBox key={`greeting-${index}`} block={block} readOnly />
      case "stepTracker":
        return <StepTrackerBox key={`steps-${index}`} block={block} readOnly />
      case "location":
        return <LocationBox key={`location-${index}`} block={block} readOnly />
      case "content":
        return <ContentBox key={`content-${index}`} block={block} readOnly />
      case "pricing":
        return <PricingBox key={`pricing-${index}`} block={block} readOnly />
      case "photo":
        return (
          <PhotoBox
            key={`photo-${index}`}
            block={block}
            bidId={bidId}
            readOnly
          />
        )
      case "signature":
        return (
          <SignatureBox key={`signature-${index}`} block={block} readOnly />
        )
      default:
        return null
    }
  }

  // Test handlers
  const handleAcceptConfirm = async (email?: string) => {
    setLocalStatus("accepted")
    setStatusDate(new Date())
    if (email) setCustomerEmail(email)
  }

  const handleDeclineConfirm = async () => {
    setLocalStatus("declined")
    setStatusDate(new Date())
  }

  const handleSendQuestion = async (message: string, email: string) => {
    console.log("Test - Question sent:", message, "From:", email)
  }

  const handleChangedMind = () => {
    setQuestionDefaultMessage("I'd like to reconsider this bid.")
    setShowQuestionModal(true)
  }

  // Determine which footer to show
  const showActionFooter = !testMode || localStatus === "pending"
  const showStatusFooter =
    testMode && (localStatus === "accepted" || localStatus === "declined")

  return (
    <>
      {/* Modals (only functional in test mode) */}
      <ConfirmAcceptModal
        open={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleAcceptConfirm}
        existingEmail={customerEmail || undefined}
      />

      <ConfirmDeclineModal
        open={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onConfirm={handleDeclineConfirm}
      />

      <SendQuestionModal
        open={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false)
          setQuestionDefaultMessage("")
        }}
        onSend={handleSendQuestion}
        existingEmail={customerEmail || undefined}
        defaultMessage={questionDefaultMessage}
      />

      <div className="fixed inset-0 z-50 bg-zinc-100 dark:bg-zinc-900 overflow-auto">
        {/* Close button */}
        <CloseButton onClick={onClose} className="fixed top-4 right-4 z-50" />

        {/* Preview label + Test toggle */}
        <div className="fixed top-5 left-4 z-50 flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-800 text-base font-medium">
            Preview Mode
          </div>

          {/* Test mode toggle */}
          <button
            type="button"
            onClick={() => setTestMode(!testMode)}
            className={`px-3 py-1.5 rounded-full text-base font-medium ring-2 ${
              testMode
                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-zinc-200 dark:ring-zinc-700 hover:ring-zinc-300 dark:hover:ring-zinc-600"
            }`}
          >
            {testMode ? "Testing On" : "Test Interactions"}
          </button>
        </div>

        {/* Bid content - extra bottom padding for footer */}
        <div className="pb-32">
          {headerBlock && <HeaderBox block={headerBlock} readOnly />}
          <div className="relative isolate w-11/12 lg:max-w-7xl mx-auto">
            <div className="mb-8 mt-12"></div>
            {bodyBlocks.map((block, index) => renderBlock(block, index))}
          </div>
        </div>

        {/* Action Footer */}
        {showActionFooter && (
          <BidActionFooter
            bidId={bidId}
            mode={testMode ? "live" : "preview"}
            contactPhone={contactPhone}
            contactEmail={contactEmail}
            onAccept={() => setShowAcceptModal(true)}
            onDecline={() => setShowDeclineModal(true)}
            onQuestions={() => setShowQuestionModal(true)}
          />
        )}

        {/* Status Footer - shows after accept/decline in test mode */}
        {showStatusFooter && statusDate && (
          <BidStatusFooter
            status={localStatus as "accepted" | "declined"}
            statusDate={statusDate}
            projectStatus={
              localStatus === "accepted" ? "starting_soon" : undefined
            }
            onChangedMind={
              localStatus === "declined" ? handleChangedMind : undefined
            }
          />
        )}
      </div>
    </>
  )
}
