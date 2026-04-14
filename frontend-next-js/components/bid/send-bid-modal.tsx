"use client"

import { useState, useEffect } from "react"
import DialogShell from "@/components/ui/dialog-shell"
import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ClipboardIcon,
  ArrowLeftIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import { CheckIcon as CheckIconSolid } from "@heroicons/react/24/solid"
import Toast from "@/components/ui/toast"

type Step = "recipient" | "method" | "success"

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
}

interface SendBidModalProps {
  open: boolean
  onClose: () => void
  bidId: string
  companyName?: string
  onSent?: () => void
  /** Enable when email service (SES) is wired up */
  enableEmail?: boolean
  /** Enable when text service (Twilio) is wired up */
  enableText?: boolean
}

const MAX_RECENT_CONTACTS = 2
const CLOSE_ANIMATION_MS = 200

export default function SendBidModal({
  open,
  onClose,
  bidId,
  companyName = "our company",
  onSent,
  enableEmail = false,
  enableText = false,
}: SendBidModalProps) {
  const [step, setStep] = useState<Step>("recipient")

  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [saveToContacts, setSaveToContacts] = useState(false)
  const [isNewRecipient, setIsNewRecipient] = useState(false)

  const [showMarkSent, setShowMarkSent] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchContacts()
      return
    }

    const timeout = setTimeout(() => {
      resetState()
    }, CLOSE_ANIMATION_MS)

    return () => clearTimeout(timeout)
  }, [open])

  const fetchContacts = async () => {
    setIsLoadingContacts(true)
    try {
      const res = await fetch("/api/contacts")
      if (res.ok) {
        const data = await res.json()
        setContacts(data.contacts || [])
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err)
    } finally {
      setIsLoadingContacts(false)
    }
  }

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery),
  )

  const displayedContacts = searchQuery
    ? filteredContacts
    : filteredContacts.slice(0, MAX_RECENT_CONTACTS)

  const resetState = () => {
    setStep("recipient")
    setSelectedContact(null)
    setSearchQuery("")
    setName("")
    setEmail("")
    setPhone("")
    setSaveToContacts(false)
    setIsNewRecipient(false)
    setShowMarkSent(false)
    setShowToast(false)
    setIsSending(false)
    setError(null)
  }

  const handleClose = () => {
    onClose()
  }

  const handleBack = () => {
    if (step === "method") {
      setStep("recipient")
      setSelectedContact(null)
      setIsNewRecipient(false)
      setName("")
      setEmail("")
      setPhone("")
      setShowMarkSent(false)
      setShowToast(false)
    }
    setError(null)
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    setName(contact.name)
    setEmail(contact.email || "")
    setPhone(contact.phone || "")
    setIsNewRecipient(false)
    setSaveToContacts(false)
    setShowMarkSent(false)
    setError(null)
    setStep("method")
  }

  const handleNewRecipient = () => {
    setSelectedContact(null)
    setIsNewRecipient(true)
    setName("")
    setEmail("")
    setPhone("")
    setSaveToContacts(true)
    setShowMarkSent(false)
    setError(null)
    setStep("method")
  }

  const bidUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/bid/${bidId}`
      : `/bid/${bidId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bidUrl)
      setShowMarkSent(true)
      setShowToast(true)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const updateBidStatus = async () => {
    const res = await fetch(`/api/bids/${bidId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "sent",
        sent_at: new Date().toISOString(),
        sent_to_email: email || null,
        sent_to_phone: phone ? phone.replace(/\D/g, "") : null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to update bid")
    }
  }

  const createContact = async () => {
    const phoneDigits = phone.replace(/\D/g, "")
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || email || phoneDigits,
        email: email || "",
        phone: phoneDigits || "",
      }),
    })

    if (!res.ok) {
      console.error("Failed to create contact")
    }
  }

  const handleMarkAsSent = async () => {
    setIsSending(true)
    setError(null)

    try {
      await updateBidStatus()

      if (isNewRecipient && saveToContacts && name) {
        await createContact()
      }

      onSent?.()
      setStep("success")
      setShowMarkSent(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update bid")
    } finally {
      setIsSending(false)
    }
  }

  const getTitle = () => {
    if (step === "recipient") return "Send Bid"
    if (step === "method") return "Send Bid"
    return "Bid sent"
  }

  const getSubtitle = () => {
    if (step === "recipient") return "Who is this for?"
    if (step === "method") return "How do you want to send this?"
    return ""
  }

  return (
    <DialogShell
      open={open}
      onClose={handleClose}
      title={getTitle()}
      subtitle={getSubtitle()}
      size="sm"
    >
      <div className="relative p-6">
        {showToast && (
          <Toast
            message="Link copied to clipboard"
            type="success"
            duration={2500}
            onDismiss={() => setShowToast(false)}
          />
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 ring-2 ring-sky-200 dark:bg-sky-950/40 dark:ring-sky-900">
              <CheckIconSolid className="size-7 text-sky-600 dark:text-sky-400" />
            </div>

            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
              You can close this window and continue working.
            </p>

            <div className="flex w-full justify-center">
              <Button type="button" variant="primary" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {step === "recipient" && (
          <div className="space-y-3">
            {contacts.length > MAX_RECENT_CONTACTS && (
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border-2 border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-200"
                />
              </div>
            )}

            <div style={contacts.length > 0 ? { minHeight: 160 } : undefined}>
              {isLoadingContacts ? (
                <p className="py-4 text-center text-gray-500">Loading...</p>
              ) : displayedContacts.length > 0 ? (
                <div className="space-y-2">
                  {displayedContacts.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => handleSelectContact(contact)}
                      className="w-full rounded-lg border-2 border-zinc-200 p-3 text-left hover:border-indigo-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-indigo-500 dark:hover:bg-zinc-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 flex-none items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-gray-800 dark:text-gray-200">
                            {contact.name}
                          </p>
                          <p className="truncate text-base text-gray-500">
                            {contact.email ||
                              contact.phone ||
                              "No contact info"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}

                  {searchQuery && filteredContacts.length === 0 && (
                    <p className="py-4 text-center text-gray-500">
                      No contacts found
                    </p>
                  )}
                </div>
              ) : !searchQuery ? null : (
                <p className="py-4 text-center text-gray-500">
                  No contacts found
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleNewRecipient}
              className="w-full rounded-lg border-2 border-dashed border-zinc-300 p-3 text-left hover:border-indigo-500 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:border-indigo-500 dark:hover:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 flex-none items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <UserPlusIcon className="size-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    New recipient
                  </p>
                  <p className="text-base text-gray-500">
                    Enter email or phone manually
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {step === "method" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleBack}
              className="mb-2 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeftIcon className="size-4" />
              <span className="text-base">Back</span>
            </button>

            {(selectedContact || isNewRecipient) && (
              <div className="mb-1">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {selectedContact ? selectedContact.name : "New recipient"}
                </p>
                {selectedContact && (
                  <p className="text-base text-gray-500">
                    {selectedContact.email || selectedContact.phone}
                  </p>
                )}
              </div>
            )}

            {isNewRecipient && (
              <div className="space-y-3 pb-2">
                <FormInput
                  label="Name (optional)"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                />

                <div className="flex items-start gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-5 grid-cols-1">
                      <input
                        id="save-contact"
                        name="save-contact"
                        type="checkbox"
                        checked={saveToContacts}
                        onChange={(e) => setSaveToContacts(e.target.checked)}
                        className="col-start-1 row-start-1 appearance-none rounded-sm border-2 border-zinc-200 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-zinc-700 dark:bg-zinc-950"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor="save-contact" className="cursor-pointer">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      Save to contacts
                    </p>
                  </label>
                </div>
              </div>
            )}

            {!showMarkSent ? (
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full rounded-lg border-2 border-zinc-200 p-4 text-left hover:border-indigo-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-indigo-500 dark:hover:bg-zinc-900"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 flex-none items-center justify-center rounded-lg bg-indigo-100 ring-2 ring-zinc-200 dark:bg-indigo-900/50 dark:ring-zinc-700">
                    <ClipboardIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      Copy Link
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      Copy link to share anywhere
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border-2 border-zinc-200 p-4 dark:border-zinc-700">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleMarkAsSent}
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Mark as sent"}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowMarkSent(false)}
                  className="rounded-lg px-4 py-2 text-base font-medium text-gray-600 hover:bg-zinc-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={!enableEmail}
              onClick={
                enableEmail
                  ? () => {
                      /* TODO: wire up email send flow */
                    }
                  : undefined
              }
              className={`w-full rounded-lg border-2 border-zinc-200 p-4 text-left dark:border-zinc-700 ${
                enableEmail
                  ? "hover:border-indigo-500 hover:bg-zinc-50 dark:hover:border-indigo-500 dark:hover:bg-zinc-900"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-12 flex-none items-center justify-center rounded-lg ring-2 ring-zinc-200 dark:ring-zinc-700 ${
                    enableEmail
                      ? "bg-indigo-100 dark:bg-indigo-900/50"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  }`}
                >
                  <EnvelopeIcon
                    className={`size-6 ${
                      enableEmail
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Send via Email
                  </p>
                  <p className="text-base text-gray-500">
                    {enableEmail ? "Opens your email app" : "Coming soon"}
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              disabled={!enableText}
              onClick={
                enableText
                  ? () => {
                      /* TODO: wire up text send flow */
                    }
                  : undefined
              }
              className={`w-full rounded-lg border-2 border-zinc-200 p-4 text-left dark:border-zinc-700 ${
                enableText
                  ? "hover:border-indigo-500 hover:bg-zinc-50 dark:hover:border-indigo-500 dark:hover:bg-zinc-900"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-12 flex-none items-center justify-center rounded-lg ring-2 ring-zinc-200 dark:ring-zinc-700 ${
                    enableText
                      ? "bg-indigo-100 dark:bg-indigo-900/50"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  }`}
                >
                  <DevicePhoneMobileIcon
                    className={`size-6 ${
                      enableText
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Send via Text
                  </p>
                  <p className="text-base text-gray-500">
                    {enableText ? "Opens your messaging app" : "Coming soon"}
                  </p>
                </div>
              </div>
            </button>

            {error && <p className="text-base text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </DialogShell>
  )
}
