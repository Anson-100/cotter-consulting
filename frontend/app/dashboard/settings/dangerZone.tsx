"use client"

import { useAuthStore } from "@/lib/useAuthStore"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import DeleteAccountModal from "@/components/DeleteAccountModal"

const DangerZone = () => {
  const router = useRouter()
  const supabase = createClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | undefined>()

  // Fetch user email for display in modal
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? undefined)
    }
    fetchUser()
  }, [supabase])

  const handleDeleteAccount = async () => {
    const response = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete account")
    }

    // Clear client-side auth state before redirect
    await useAuthStore.getState().logout()

    // Redirect to homepage after successful deletion
    router.push("/?deleted=true")
  }

  return (
    <div>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-800 dark:text-gray-200">
              Walk the plank
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              No longer want to use our service? If so, you can delete your
              account here. Just know this action is not reversible.
            </p>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              All information related to this account will be deleted
              permanently.
            </p>
          </div>
          <div className="flex items-start md:col-span-1">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-md border-3 border-red-700 bg-red-600 px-3 py-2 font-semibold 
                         text-white hover:bg-red-700 hover:cursor-pointer
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 
                         focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900
                         active:translate-y-px transition-all"
            >
              Yes, delete my account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        userEmail={userEmail}
      />
    </div>
  )
}

export default DangerZone
