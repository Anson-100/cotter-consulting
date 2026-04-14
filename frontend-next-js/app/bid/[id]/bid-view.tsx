"use client"

import { useState } from "react"
import type {
  Bid,
  BidBlock,
  HeaderBlock,
  BidStatus,
} from "@/lib/validations/bid"
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

interface BidViewProps {
  bid: Bid
}

export default function BidView({ bid }: BidViewProps) {
  // Modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [questionDefaultMessage, setQuestionDefaultMessage] = useState("")

  // Initialize from database values if they exist
  const [localStatus, setLocalStatus] = useState<BidStatus>(bid.status)
  const [statusDate, setStatusDate] = useState<Date | null>(
    bid.accepted_at
      ? new Date(bid.accepted_at)
      : bid.declined_at
        ? new Date(bid.declined_at)
        : null,
  )
  const [customerEmail, setCustomerEmail] = useState<string | null>(
    bid.accepted_email || null,
  )
  const [projectStatus, setProjectStatus] = useState(bid.project_status || null)

  const blocks = bid.blocks || []
  const headerBlock = blocks.find((b): b is HeaderBlock => b.type === "header")
  const bodyBlocks = blocks.filter((b) => b.type !== "header")

  // Extract contact info from header for the questions flow
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
            bidId={bid.id || ""}
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

  // Handle accept confirmation
  const handleAcceptConfirm = async (email?: string) => {
    const res = await fetch(`/api/bids/${bid.id}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accepted_email: email }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to accept bid")
    }

    const data = await res.json()
    setLocalStatus("accepted")
    setStatusDate(new Date(data.accepted_at))
    setProjectStatus("starting_soon")
    if (email) setCustomerEmail(email)
  }

  // Handle decline confirmation
  const handleDeclineConfirm = async () => {
    const res = await fetch(`/api/bids/${bid.id}/decline`, {
      method: "POST",
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to decline bid")
    }

    const data = await res.json()
    setLocalStatus("declined")
    setStatusDate(new Date(data.declined_at))
  }

  // Handle sending a question
  const handleSendQuestion = async (message: string, email: string) => {
    const res = await fetch(`/api/bids/${bid.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sender_email: email }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to send message")
    }
  }

  // Handle "Changed your mind?" click
  const handleChangedMind = () => {
    setQuestionDefaultMessage("I'd like to reconsider this bid.")
    setShowQuestionModal(true)
  }

  // CUSTOMER ACTION FOOTER; CHANGE THiS BACK WHEN FEATURE IS BUILT OUT
  // =============================================================================================================================================
  // const showActionButtons =
  //   localStatus === "draft" ||
  //   localStatus === "sent" ||
  //   localStatus === "viewed"

  const showActionButtons = false

  const showStatusFooter =
    localStatus === "accepted" || localStatus === "declined"

  return (
    <>
      {/* Modals */}
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

      <section
        className={`min-h-screen relative isolate overflow-hidden dark:bg-zinc-900 bg-zinc-100 ${
          showActionButtons || showStatusFooter ? "pb-32" : "pb-20"
        }`}
      >
        {/* Header */}
        {headerBlock && <HeaderBox block={headerBlock} readOnly />}

        {/* Body blocks */}
        <div className="relative isolate w-11/12 lg:max-w-7xl mx-auto">
          <div className="mb-8 mt-12"></div>
          {bodyBlocks.map((block, index) => renderBlock(block, index))}
        </div>

        {/* Action Footer - for bids that can be acted upon */}
        {showActionButtons && (
          <BidActionFooter
            bidId={bid.id || ""}
            mode={localStatus === "draft" ? "preview" : "live"}
            contactPhone={contactPhone}
            contactEmail={contactEmail}
            onAccept={() => setShowAcceptModal(true)}
            onDecline={() => setShowDeclineModal(true)}
            onQuestions={() => setShowQuestionModal(true)}
          />
        )}

        {/* Status Footer - for bids already acted upon */}
        {showStatusFooter && statusDate && (
          <BidStatusFooter
            status={localStatus as "accepted" | "declined"}
            statusDate={statusDate}
            projectStatus={projectStatus ?? undefined}
            onChangedMind={
              localStatus === "declined" ? handleChangedMind : undefined
            }
          />
        )}
      </section>
    </>
  )
}
