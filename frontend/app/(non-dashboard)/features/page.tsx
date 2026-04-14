"use client"

import { useEffect } from "react"
import FeatureSectionHeader from "./featureSectionHeader"
import FeatureSectionContent from "./featureSectionContent"
import SceneHeader from "@/components/ui/scene-header"

import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  LinkIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline"

export default function FeaturesPage() {
  // Scroll to hash anchors when navigated with #id
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: "instant" })
        }
      } else {
        window.scrollTo({ top: 0 })
      }
    }

    handleHashChange() // run on load
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <div className="px-6 py-24 sm:py-32 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <SceneHeader
          eyebrow=""
          title={
            <>
              Learn more about our{" "}
              <span className="text-sky-600 dark:text-sky-500">platform</span>
            </>
          }
          caption={<></>}
        />

        <div className="flex flex-col gap-12 bg-white rounded-3xl mt-20 sm:px-6 border-2 dark:bg-zinc-950 dark:border-zinc-700 border-zinc-200">
          {/* SECTION 1 */}
          <section id="send-bids">
            <FeatureSectionHeader
              icon={
                <LinkIcon className="h-14 w-14 text-indigo-600 dark:text-indigo-500" />
              }
              title="Send bids as links"
              description="Share clean, professional bids via a simple link your clients can view anywhere."
            />
            <FeatureSectionContent
              title="Send bids as links"
              subtitle="Frictionless communication"
              description="Clients receive a clean, clickable link — no downloads or clunky PDFs."
              bullets={[
                {
                  icon: <CloudArrowUpIcon className="h-6 w-6" />,
                  name: "Instant delivery",
                  description:
                    "Send bids in seconds without attachments or file size limits.",
                },
                {
                  icon: <LockClosedIcon className="h-6 w-6" />,
                  name: "Secure and reliable",
                  description:
                    "All bids are hosted securely and accessible only by link.",
                },
                {
                  icon: <ServerIcon className="h-6 w-6" />,
                  name: "Works on any device",
                  description:
                    "Bids are responsive and look great on desktop or mobile.",
                },
              ]}
              image="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            />
          </section>

          <section id="track-progress">
            <FeatureSectionHeader
              icon={
                <ChartBarIcon className="h-14 w-14 text-indigo-600 dark:text-indigo-500" />
              }
              title="Track progress"
              description="See approvals, payments, and project updates in one clear dashboard."
            />
            <FeatureSectionContent
              title="Track progress"
              subtitle="Project clarity at a glance"
              description="Track approvals, payments, and updates all in one place so you never miss a beat."
              flip
              bullets={[
                {
                  icon: <ChartBarIcon className="h-6 w-6" />,
                  name: "Approval status",
                  description:
                    "See which bids have been approved or are pending.",
                },
                {
                  icon: <CreditCardIcon className="h-6 w-6" />,
                  name: "Payment tracking",
                  description:
                    "Monitor received and outstanding payments with ease.",
                },
                {
                  icon: <DevicePhoneMobileIcon className="h-6 w-6" />,
                  name: "Real-time updates",
                  description: "Get updates as they happen, on any device.",
                },
              ]}
              image="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            />
          </section>

          <section id="keep-records">
            <FeatureSectionHeader
              icon={
                <ArchiveBoxIcon className="h-14 w-14 text-indigo-600 dark:text-indigo-500" />
              }
              title="Keep records"
              description="All your bids, approvals, and changes are saved for quick access and reference."
            />
            <FeatureSectionContent
              title="Keep records"
              subtitle="Everything in one place"
              description="Access your complete history of bids, approvals, and changes whenever you need."
              bullets={[
                {
                  icon: <ArchiveBoxIcon className="h-6 w-6" />,
                  name: "Organized history",
                  description:
                    "All your records are neatly categorized and searchable.",
                },
                {
                  icon: <LockClosedIcon className="h-6 w-6" />,
                  name: "Secure storage",
                  description:
                    "Your data is stored safely with encrypted backups.",
                },
                {
                  icon: <CloudArrowUpIcon className="h-6 w-6" />,
                  name: "Easy retrieval",
                  description: "Find and download any record in seconds.",
                },
              ]}
              image="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            />
          </section>

          <section id="mobile-friendly">
            <FeatureSectionHeader
              icon={
                <DevicePhoneMobileIcon className="h-14 w-14 text-indigo-600 dark:text-indigo-500" />
              }
              title="Mobile friendly"
              description="Send, review, and approve bids from any device with a simple responsive design."
            />
            <FeatureSectionContent
              title="Mobile friendly"
              subtitle="Optimized for every device"
              description="Our responsive design ensures a seamless experience on mobile, tablet, and desktop."
              flip
              bullets={[
                {
                  icon: <DevicePhoneMobileIcon className="h-6 w-6" />,
                  name: "Responsive design",
                  description: "Automatically adapts to any screen size.",
                },
                {
                  icon: <ChartBarIcon className="h-6 w-6" />,
                  name: "Full functionality",
                  description: "Access all features, even on smaller devices.",
                },
                {
                  icon: <LockClosedIcon className="h-6 w-6" />,
                  name: "Secure on mobile",
                  description:
                    "Enjoy the same security whether on desktop or mobile.",
                },
              ]}
              image="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            />
          </section>
        </div>
      </div>
    </div>
  )
}
