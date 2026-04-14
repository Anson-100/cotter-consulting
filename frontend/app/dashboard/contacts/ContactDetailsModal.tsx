// /app/dashboard/contacts/ContactDetailsModal.tsx

// Modal for viewing, editing, and deleting a contact
// Styled to match AuthModal pattern
// Switches between view mode and edit mode

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { XMarkIcon, ClipboardIcon } from "@heroicons/react/24/outline"
import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"

type Contact = {
  id: string
  organization_id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

type ContactDetailsModalProps = {
  open: boolean
  contact: Contact | null
  onClose: () => void
  onUpdated: (contact: Contact) => void
  onDeleted: (contactId: string) => void
}

export default function ContactDetailsModal({
  open,
  contact,
  onClose,
  onUpdated,
  onDeleted,
}: ContactDetailsModalProps) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  // Reset form when contact changes or modal opens
  useEffect(() => {
    if (contact && open) {
      setForm({
        name: contact.name,
        email: contact.email || "",
        phone: contact.phone || "",
        notes: contact.notes || "",
      })
      setMode("view")
      setError("")
    }
  }, [contact, open])

  // Format phone number as user types: 555-555-5555
  function formatPhoneNumber(input: string): string {
    const digits = input.replace(/\D/g, "").slice(0, 10)
    const a = digits.slice(0, 3)
    const b = digits.slice(3, 6)
    const c = digits.slice(6, 10)

    if (digits.length > 6) return `${a}-${b}-${c}`
    if (digits.length > 3) return `${a}-${b}`
    return a
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target

    if (name === "phone") {
      setForm((prev) => ({ ...prev, phone: formatPhoneNumber(value) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }

    setError("")
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()

    if (!contact) return

    if (!form.name.trim()) {
      setError("Name is required")
      return
    }

    // Validate phone format if provided
    if (form.phone && !/^\d{3}-\d{3}-\d{4}$/.test(form.phone)) {
      setError("Phone must be 10 digits (555-555-5555)")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        onUpdated(data.contact)
        setMode("view")
      } else {
        setError(data.error || "Failed to update contact")
      }
    } catch (err) {
      console.error("Update contact error:", err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!contact) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        onDeleted(contact.id)
        onClose()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to delete contact")
      }
    } catch (err) {
      console.error("Delete contact error:", err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    if (!loading) {
      setMode("view")
      setError("")
      onClose()
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  if (!contact) return null

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 backdrop-blur-md bg-zinc-950/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto p-2">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className="bg-zinc-100 dark:bg-zinc-950 rounded-b-lg rounded-t-xl shadow-lg relative 
              dark:ring-2 dark:ring-inset dark:ring-zinc-800 
              w-full sm:max-w-md
              data-closed:scale-95 data-closed:opacity-0 
              data-enter:duration-300 data-enter:ease-out 
              data-leave:duration-200 data-leave:ease-in"
          >
            {/* Indigo top bar */}
            <div className="w-full h-3 bg-indigo-600 dark:bg-indigo-500 rounded-t-lg" />

            {/* Header */}
            <div className="w-full px-6 pb-4 pt-4 border-b-2 border-zinc-200 dark:border-zinc-800">
              <DialogTitle
                as="h2"
                className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
              >
                {mode === "edit"
                  ? "Edit contact"
                  : mode === "delete"
                  ? "Delete contact"
                  : contact.name}
              </DialogTitle>
              <button
                onClick={handleClose}
                className="absolute top-6 right-4 text-zinc-600 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              >
                <XMarkIcon className="size-6" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-6">
              {/* DELETE CONFIRMATION */}
              {mode === "delete" && (
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">{contact.name}</span>? This
                    action cannot be undone.
                  </p>

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      as="button"
                      variant="secondary"
                      size="md"
                      type="button"
                      onClick={() => setMode("view")}
                      disabled={loading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      as="button"
                      variant="primary"
                      size="md"
                      type="button"
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              )}

              {/* EDIT MODE */}
              {mode === "edit" && (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <FormInput
                    id="edit-name"
                    name="name"
                    label="Name *"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                  />

                  <FormInput
                    id="edit-email"
                    name="email"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />

                  <FormInput
                    id="edit-phone"
                    name="phone"
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="555-555-5555"
                  />

                  {/* Notes textarea */}
                  <div className="w-full">
                    <label
                      htmlFor="edit-notes"
                      className="block font-semibold text-gray-600 dark:text-gray-300"
                    >
                      Notes
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="edit-notes"
                        name="notes"
                        rows={3}
                        value={form.notes}
                        onChange={handleChange}
                        className="block w-full rounded bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-base text-zinc-800 outline-2 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700 placeholder:text-gray-400 dark:text-gray-200 focus:outline-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 resize-none"
                        placeholder="Any additional info..."
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      as="button"
                      variant="secondary"
                      size="md"
                      type="button"
                      onClick={() => {
                        setMode("view")
                        // Reset form to original values
                        setForm({
                          name: contact.name,
                          email: contact.email || "",
                          phone: contact.phone || "",
                          notes: contact.notes || "",
                        })
                        setError("")
                      }}
                      disabled={loading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      as="button"
                      variant="primary"
                      size="md"
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              )}

              {/* VIEW MODE */}
              {mode === "view" && (
                <div className="space-y-6">
                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    {/* Email */}
                    <div className="flex items-center justify-between">
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {contact.email || "—"}
                      </p>
                      {contact.email && (
                        <button
                          onClick={() => copyToClipboard(contact.email!)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                          title="Copy email"
                        >
                          <ClipboardIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between">
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {contact.phone || "—"}
                      </p>
                      {contact.phone && (
                        <button
                          onClick={() => copyToClipboard(contact.phone!)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                          title="Copy phone"
                        >
                          <ClipboardIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Notes */}
                    {contact.notes && (
                      <p>
                        <span className="font-semibold">Notes:</span>{" "}
                        {contact.notes}
                      </p>
                    )}

                    {/* Date added */}
                    <p>
                      <span className="font-semibold">Date added:</span>{" "}
                      {new Date(contact.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      as="button"
                      variant="secondary"
                      size="md"
                      type="button"
                      onClick={() => setMode("delete")}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                    <Button
                      as="button"
                      variant="primary"
                      size="md"
                      type="button"
                      onClick={() => setMode("edit")}
                      className="flex-1"
                    >
                      Edit info
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
