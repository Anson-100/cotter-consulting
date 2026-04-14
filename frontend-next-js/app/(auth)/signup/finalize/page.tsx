"use client"

import OnboardingHeader from "@/components/ui/onboarding-header"
import { useNavActions } from "../layout"
import FinalizeActions from "../_components/nav/FinalizeActions"
import { useEffect } from "react"
import { useSignupStore } from "../_components/useSignupStore"
import { getSelectedPlan } from "@/data/getSelectedPlan"

export default function Finalize() {
  const { setActions } = useNavActions()
  const { plan, profile, billing, cardPreview } = useSignupStore()

  const isDeferred = plan === "deferred"
  const planInfo = isDeferred ? null : getSelectedPlan(plan)

  useEffect(() => {
    setActions(<FinalizeActions />)
  }, [])

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : ""

  const cityStateZip = [billing?.city, billing?.region, billing?.postalCode]
    .filter(Boolean)
    .join(" ")

  const streetAddress = [billing?.streetAddress, cityStateZip, billing?.country]
    .filter(Boolean)
    .join(", ")

  const formattedCard =
    cardPreview &&
    `${cardPreview.brand.toUpperCase()} ending in ${cardPreview.last4}`

  const formattedExp =
    cardPreview &&
    `${cardPreview.exp_month}/${cardPreview.exp_year.toString().slice(2)}`

  const details = [
    { label: "Full name", value: fullName },
    { label: "Email address", value: profile?.email },
    { label: "Billing address", value: streetAddress },
    { label: "Cardholder name", value: billing?.cardholderName },
    { label: "Card", value: formattedCard },
    { label: "Expiration", value: formattedExp },
  ]

  return (
    <div className="max-w-7xl mx-auto pb-16 px-6">
      {/* HEADER */}
      <OnboardingHeader
        stepNumber={3}
        titleText="Confirm your"
        titleTextAccent={isDeferred ? "free trial" : "plan and info"}
        caption={
          isDeferred
            ? "You're starting with 2 free bid sends. We'll ask you to choose a plan after that."
            : "This is the final step! Double check all the details and then click the button to enter dashboard with full access."
        }
      />

      {/* SELECTED PLAN */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {isDeferred ? "Your free trial" : "Selected plan"}
        </h3>
        <p className="mt-1 max-w-2xl text-gray-600 dark:text-gray-300">
          {isDeferred
            ? "No charge until you send your 3rd bid."
            : `Billed ${
                planInfo?.cycle === "annually" ? "annually" : "monthly"
              }. Upgrade or cancel anytime.`}
        </p>

        <div className="mt-6 flex flex-col gap-2 relative overflow-hidden rounded-lg pl-6 p-4 bg-white dark:bg-zinc-950 ring-inset ring-2 ring-zinc-200 dark:ring-zinc-700">
          <div
            className={`absolute left-0 h-full w-2 top-0 ${
              isDeferred
                ? "bg-sky-600 dark:bg-sky-500"
                : "bg-sky-600 dark:bg-sky-500"
            }`}
          />

          {isDeferred ? (
            <>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-2xl">
                2 Free Bid Sends
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Then choose Starter, Pro, or Unlimited
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-2xl">
                {planInfo?.name || ""}
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-semibold text-xl">
                {planInfo ? `${planInfo.price}/${planInfo.cycle}` : ""}
              </p>
            </>
          )}
        </div>
      </div>

      {/* CUSTOMER DETAILS */}
      <div className="mt-20">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Customer details
        </h3>
        <p className="mt-1 max-w-2xl text-gray-600 dark:text-gray-300">
          {isDeferred
            ? "Your card is saved securely. You won't be charged until you choose a plan."
            : "Information you entered on the previous page."}
        </p>

        <div className="mt-6 border-t-2 border-zinc-200 dark:border-zinc-700">
          <dl className="divide-y-2 divide-zinc-200 dark:divide-zinc-700">
            {details.map((d) => (
              <div
                key={d.label}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="font-medium text-gray-900 dark:text-gray-200">
                  {d.label}
                </dt>
                <dd className="mt-1 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                  {d.value || ""}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
