"use client"

import { useState, ReactNode } from "react"
import DialogShell from "@/components/ui/dialog-shell"

const sections = [
  {
    id: 1,
    heading: "What The Pirate Ship Does",
    body: "The Pirate Ship is a software platform that helps contractors create and send professional bid presentations to their customers. We provide the tools — you run your business. We don't act as a contractor, general contractor, or middleman in any transaction between you and your customers.",
  },
  {
    id: 2,
    heading: "Your Account",
    body: "You're responsible for keeping your login credentials secure and for everything that happens under your account. If you suspect unauthorized access, let us know immediately. We reserve the right to suspend or terminate accounts that violate these terms or are used for fraudulent activity.",
  },
  {
    id: 3,
    heading: "Subscriptions & Billing",
    body: "Paid plans are billed monthly or annually through Stripe. You can cancel anytime, and your access continues through the end of your current billing period — no partial refunds. We may adjust pricing with 30 days' notice. Free-tier users get 2 bid sends before a subscription is required.",
  },
  {
    id: 4,
    heading: "Your Content",
    body: "Anything you upload or create on the platform — bids, photos, contact info — remains yours. By using the service, you grant us a limited license to store, display, and transmit that content solely to operate the platform on your behalf. We won't sell your content or use it for advertising.",
  },
  {
    id: 5,
    heading: "Acceptable Use",
    body: "Use The Pirate Ship for legitimate business purposes. Don't use it to send spam, harass anyone, misrepresent your services, or do anything illegal. We reserve the right to remove content or suspend accounts that cross the line.",
  },
  {
    id: 6,
    heading: "Limitation of Liability",
    body: "We build and maintain this platform in good faith, but we provide it \"as is\" without warranties of any kind. We're not liable for lost bids, missed jobs, downtime, or any indirect damages arising from your use of the service. Our total liability is limited to the amount you've paid us in the previous 12 months.",
  },
  {
    id: 7,
    heading: "Disputes Between You & Your Customers",
    body: "The Pirate Ship facilitates communication between contractors and their customers but is not a party to any agreement, contract, or transaction between you. Any disputes about pricing, scope of work, or payment are between you and your customer.",
  },
  {
    id: 8,
    heading: "Changes to These Terms",
    body: "We may update these terms from time to time. If we make significant changes, we'll notify you via email or an in-app notice. Continued use of the platform after changes take effect means you accept the updated terms.",
  },
  {
    id: 9,
    heading: "Termination",
    body: "You can delete your account at any time. We can terminate or suspend your access if you violate these terms. Upon termination, your data will be retained for 30 days in case you change your mind, then permanently deleted.",
  },
]

export default function TermsModal({
  trigger,
}: {
  trigger?: (open: (v: boolean) => void) => ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <span>
      {trigger ? (
        trigger(setIsOpen)
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="font-semibold hover:underline text-indigo-600 dark:text-indigo-500 hover:cursor-pointer"
        >
          terms and conditions
        </button>
      )}

      <DialogShell
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Terms & Conditions"
        size="lg"
      >
        <div className="px-6 lg:px-8 pb-8">
          <p className="mt-6 text-base text-gray-600 dark:text-gray-400">
            Last updated: February 2026. By creating an account or using The
            Pirate Ship, you agree to the following.
          </p>

          <dl className="mt-8 space-y-8">
            {sections.map((section) => (
              <div key={section.id}>
                <dt className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {section.id}. {section.heading}
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  {section.body}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 text-base text-gray-500 dark:text-gray-500">
            Questions? Reach out at{" "}
            <a
              href="mailto:support@thepirateship.co"
              className="font-semibold text-indigo-600 dark:text-indigo-500 hover:underline"
            >
              support@thepirateship.co
            </a>
          </p>
        </div>
      </DialogShell>
    </span>
  )
}
