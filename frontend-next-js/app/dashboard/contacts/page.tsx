"use client"

import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import Button from "@/components/ui/button"
import EmptyState from "@/components/ui/empty-state"
import CreateContactModal from "./CreateContactModal"
import ContactDetailsModal from "./ContactDetailsModal"
import {
  EnvelopeIcon,
  PlusIcon,
  PhoneIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"

// Contact type matching our database schema
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

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  // Fetch contacts on mount
  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch("/api/contacts")
        const data = await res.json()
        if (res.ok) {
          setContacts(data.contacts)
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchContacts()
  }, [])

  return (
    <div className="">
      <DashboardPageHeader
        title="Contacts"
        subtitle="View and manage your contacts"
      />
      <div className="">
        <div className="flex items-start flex-col gap-2 mb-6">
          <div className="flex items-center sm:gap-0 justify-between w-full">
            <div className="sm:flex-auto">
              <div className="">
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search contacts..."
                  className="block w-50 rounded-md bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-base text-zinc-800 outline-2 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700 placeholder:text-gray-600 dark:placeholder:text-gray-300 dark:text-gray-200 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 dark:focus:outline-indigo-500"
                />
              </div>
            </div>
            <div className="sm:mt-0 sm:ml-16 sm:flex-none">
              <Button
                as="button"
                variant="primary"
                size="md"
                type="button"
                onClick={() => setCreateOpen(true)}
                className="rounded-md sm:w-auto sm:h-auto px-3.5 py-2.5"
              >
                <span className="sm:hidden flex">
                  <PlusIcon className="size-6" aria-hidden="true" />
                  Add
                </span>
                <span className="hidden sm:inline-flex items-center gap-x-1">
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  New contact
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* CONTACT CARDS */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Loading contacts...</span>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="size-12" />}
            title="No contacts yet"
            subtitle="Add your first contact to get started."
            action={{
              label: "Add contact",
              onClick: () => setCreateOpen(true),
            }}
          />
        ) : (
          <div className="">
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
            >
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="col-span-1 divide-y-2 divide-zinc-200 dark:divide-zinc-700 rounded-lg bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-700"
                >
                  <div
                    onClick={() => {
                      setSelectedContact(contact)
                      setOpen(true)
                    }}
                    className="flex w-full items-center justify-between space-x-6 p-6 hover:cursor-pointer"
                  >
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3 mt-1">
                        <h3 className="truncate font-semibold text-gray-800 dark:text-gray-200">
                          {contact.name}
                        </h3>
                      </div>
                      <p className="mt-1 truncate text-gray-600 dark:text-gray-300">
                        {contact.email || contact.phone || "No contact info"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                      <div className="flex w-0 flex-1 rounded-bl-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 border-t">
                        <a
                          href={contact.email ? `mailto:${contact.email}` : "#"}
                          className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 font-semibold text-gray-800 dark:text-gray-200"
                        >
                          <EnvelopeIcon
                            aria-hidden="true"
                            className="size-5 text-gray-600 dark:text-gray-300"
                          />
                          Email
                        </a>
                      </div>
                      <div className="-ml-px flex w-0 flex-1 rounded-br-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 border-t border-l border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                        <a
                          href={contact.phone ? `tel:${contact.phone}` : "#"}
                          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 font-semibold text-gray-800 dark:text-gray-200"
                        >
                          <PhoneIcon
                            aria-hidden="true"
                            className="size-5 text-gray-600 dark:text-gray-300"
                          />
                          Call
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DETAIL MODAL ======================================================================================*/}
        <ContactDetailsModal
          open={open}
          contact={selectedContact}
          onClose={() => setOpen(false)}
          onUpdated={(updated) => {
            setContacts((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            )
            setSelectedContact(updated)
          }}
          onDeleted={(id) => {
            setContacts((prev) => prev.filter((c) => c.id !== id))
          }}
        />
      </div>
      <CreateContactModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(contact) => setContacts((prev) => [contact, ...prev])}
      />
    </div>
  )
}
