// /app/dashboard/contacts/CreateContactModal.tsx

// Modal for creating a new contact
// Styled to match AuthModal pattern
// Uses FormInput component for consistent styling
// Phone field auto-formats to 555-555-5555

import { useState } from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
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

type CreateContactModalProps = {
  open: boolean
  onClose: () => void
  onCreated: (contact: Contact) => void
}

export default function CreateContactModal({
  open,
  onClose,
  onCreated,
}: CreateContactModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

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
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        onCreated(data.contact)
        setForm({ name: "", email: "", phone: "", notes: "" })
        onClose()
      } else {
        setError(data.error || "Failed to create contact")
      }
    } catch (err) {
      console.error("Create contact error:", err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    if (!loading) {
      setForm({ name: "", email: "", phone: "", notes: "" })
      setError("")
      onClose()
    }
  }

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
                New contact
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  id="name"
                  name="name"
                  label="Name *"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                />

                <FormInput
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />

                <FormInput
                  id="phone"
                  name="phone"
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="555-555-5555"
                />

                {/* Notes - textarea doesn't use FormInput */}
                <div className="w-full">
                  <label
                    htmlFor="notes"
                    className="block font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Notes
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="notes"
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
                    onClick={handleClose}
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
                    {loading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
