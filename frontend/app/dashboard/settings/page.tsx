"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import DashboardPageHeader from "@/components/ui/dashboard-page-header"
import Dropdown from "@/components/ui/dropdown"
import DangerZone from "./dangerZone"
import BillingSettings from "./billingSettings"
import UserSettings from "./userSettings"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const settingsTabs = [
  { label: "User info", value: "user" },
  { label: "Billing and plan", value: "billing" },
  { label: "Danger zone", value: "danger" },
] as const

type TabValue = (typeof settingsTabs)[number]["value"]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get current tab from URL, default to "user"
  const tabParam = searchParams.get("tab")
  const currentTab: TabValue =
    settingsTabs.find((t) => t.value === tabParam)?.value ?? "user"

  const currentLabel =
    settingsTabs.find((t) => t.value === currentTab)?.label ?? "User info"

  const handleTabChange = (label: string) => {
    const tab = settingsTabs.find((t) => t.label === label)
    if (tab) {
      router.replace(`/dashboard/settings?tab=${tab.value}`, { scroll: false })
    }
  }

  const renderContent = () => {
    switch (currentTab) {
      case "user":
        return <UserSettings />
      case "billing":
        return (
          <Elements stripe={stripePromise}>
            <BillingSettings />
          </Elements>
        )
      case "danger":
        return <DangerZone />
      default:
        return <UserSettings />
    }
  }

  return (
    <div className="">
      <DashboardPageHeader
        title="Settings"
        subtitle="View and manage your settings"
      />
      <div className="flex flex-col mb-6">
        <Dropdown
          menuClassName="w-56"
          buttonClassName="w-56"
          options={settingsTabs.map((t) => t.label)}
          value={currentLabel}
          onChange={handleTabChange}
        />
      </div>
      <div className="w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full border-y-2 border-zinc-200 dark:border-zinc-800"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
