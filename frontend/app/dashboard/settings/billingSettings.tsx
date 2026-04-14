"use client"

import { useState, useEffect, useRef, useCallback } from "react"

import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"
import { useRouter } from "next/navigation"
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js"
import StripeCardInput from "@/components/StripeCardInput"
import Dropdown from "@/components/ui/dropdown"
import { getAllPlanOptions, getPlanLabel } from "@/data/planUtils"
import ChangePlanInline from "@/components/ChangePlanInline"
import { PRICE_PLANS } from "@/data/pricePlans"
import Toast from "@/components/ui/toast"
import Skeleton from "@/components/ui/skeleton"

type CardInfo = {
  last4: string
  exp_month: number
  exp_year: number
  brand: string
} | null

const BillingSettings = () => {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const [dataLoading, setDataLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [planLoading, setPlanLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [useNewCard, setUseNewCard] = useState(false)
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  // Billing info state
  const [cardholderName, setCardholderName] = useState("")
  const [currentCard, setCurrentCard] = useState<CardInfo>(null)

  // Billing address state
  const [streetAddress, setStreetAddress] = useState("")
  const [country, setCountry] = useState("United States")
  const [city, setCity] = useState("")
  const [region, setRegion] = useState("")
  const [postalCode, setPostalCode] = useState("")

  // Original values for change detection
  const [originalCardholderName, setOriginalCardholderName] = useState("")
  const [originalStreetAddress, setOriginalStreetAddress] = useState("")
  const [originalCountry, setOriginalCountry] = useState("United States")
  const [originalCity, setOriginalCity] = useState("")
  const [originalRegion, setOriginalRegion] = useState("")
  const [originalPostalCode, setOriginalPostalCode] = useState("")

  // Plan state
  const [currentPlan, setCurrentPlan] = useState<string>("")
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [isPlanExpanded, setIsPlanExpanded] = useState(false)
  const [nextPaymentDate, setNextPaymentDate] = useState<number | null>(null)

  // INLINE PLAN SELECTION — REPORTED BY ChangePlanInline ==================
  const [inlineSelectedPlan, setInlineSelectedPlan] = useState<string>("")

  // SCROLL-BACK REF — ATTACHED TO THE PLAN SECTION =======================
  const planSectionRef = useRef<HTMLDivElement>(null)

  // STABLE CALLBACK FOR ChangePlanInline ==================================
  const handleSelectionChange = useCallback((planId: string) => {
    setInlineSelectedPlan(planId)
  }, [])

  // DERIVE BUTTON STATE FROM INLINE SELECTION =============================
  const inlineHasChanges = inlineSelectedPlan !== currentPlan

  const getInlinePlanInfo = () => {
    const planBase = inlineSelectedPlan
      .replace("_monthly", "")
      .replace("_annually", "")
    const plan = PRICE_PLANS.find((p) => p.id === planBase)
    if (!plan) return null

    const cycle = inlineSelectedPlan.endsWith("_annually")
      ? "annually"
      : "monthly"
    const price = plan.price[cycle]
    const cycleLabel = cycle === "monthly" ? "mo" : "yr"

    return { name: plan.name, price, cycleLabel }
  }

  // SCROLL BACK TO PLAN SECTION ===========================================
  const scrollBackToPlan = () => {
    setTimeout(() => {
      planSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 350) // WAITS FOR EXIT ANIMATION TO FINISH (300ms) + BUFFER ========
  }

  // COLLAPSE + SCROLL BACK ================================================
  const handleCollapse = () => {
    setIsPlanExpanded(false)
    scrollBackToPlan()
  }

  // CONFIRM PLAN CHANGE + COLLAPSE ========================================
  const handleConfirmPlan = async () => {
    if (!inlineHasChanges) return

    setPlanLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/stripe/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPlanId: inlineSelectedPlan }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage("Plan changed successfully!")
        setMessageType("success")
        setCurrentPlan(inlineSelectedPlan)
        setSelectedPlan(inlineSelectedPlan)
        setIsPlanExpanded(false)
        scrollBackToPlan()
      } else {
        setMessage(data.error || "Failed to change plan")
        setMessageType("error")
      }
    } catch (error) {
      console.error("Change plan error:", error)
      setMessage("Failed to change plan")
      setMessageType("error")
    } finally {
      setPlanLoading(false)
    }
  }

  // Change detection
  const cardInfoHasChanges =
    cardholderName !== originalCardholderName || useNewCard

  const addressHasChanges =
    cardholderName !== originalCardholderName ||
    streetAddress !== originalStreetAddress ||
    country !== originalCountry ||
    city !== originalCity ||
    region !== originalRegion ||
    postalCode !== originalPostalCode

  const hasExistingCard = !!currentCard

  useEffect(() => {
    async function loadBillingData() {
      const res = await fetch("/api/stripe/get-billing-info")

      if (!res.ok) {
        console.error("Failed to load billing info")
        setDataLoading(false)
        return
      }

      const data = await res.json()
      // Set billing info
      setCardholderName(data.billing.cardholderName || "")
      setOriginalCardholderName(data.billing.cardholderName || "")
      // Set address
      setStreetAddress(data.billing.streetAddress || "")
      setOriginalStreetAddress(data.billing.streetAddress || "")
      setCountry(data.billing.country || "United States")
      setOriginalCountry(data.billing.country || "United States")
      setCity(data.billing.city || "")
      setOriginalCity(data.billing.city || "")
      setRegion(data.billing.region || "")
      setOriginalRegion(data.billing.region || "")
      setPostalCode(data.billing.postalCode || "")
      setOriginalPostalCode(data.billing.postalCode || "")
      // Set card info
      setCurrentCard(data.card)
      // Set plan
      if (data.plan) {
        setCurrentPlan(data.plan)
        setSelectedPlan(data.plan)
      }
      // Set next payment date
      if (data.nextPaymentDate) {
        setNextPaymentDate(data.nextPaymentDate)
      }
      setDataLoading(false)
    }
    loadBillingData()
  }, [])

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setMessage("")

    try {
      const setupRes = await fetch("/api/stripe/setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: null }),
      })

      const { clientSecret } = await setupRes.json()

      const cardElement = elements.getElement(CardNumberElement)
      if (!cardElement) {
        setMessage("Card element not found")
        setLoading(false)
        return
      }

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
          },
        },
      })

      if (result.error) {
        setMessage(result.error.message || "Failed to update card")
        setLoading(false)
        return
      }

      const paymentMethodId = result.setupIntent.payment_method as string

      const updateRes = await fetch("/api/stripe/update-payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId }),
      })

      const updateData = await updateRes.json()

      if (updateData.success) {
        setMessage("Card updated successfully!")
      } else {
        setMessage(updateData.error || "Failed to update card")
      }
    } catch (error) {
      console.error("Card update error:", error)
      setMessage("Failed to update card")
    }

    setLoading(false)
  }

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/stripe/update-billing-address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardholderName,
        streetAddress,
        city,
        region,
        postalCode,
        country,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      setMessage("Billing address updated successfully!")
      setOriginalCardholderName(cardholderName)
      setOriginalStreetAddress(streetAddress)
      setOriginalCountry(country)
      setOriginalCity(city)
      setOriginalRegion(region)
      setOriginalPostalCode(postalCode)
    } else {
      setMessage(data.error || "Failed to update billing address")
    }
  }

  const maskedCardNumber = currentCard
    ? `•••• •••• •••• ${currentCard.last4}`
    : ""

  const maskedExpiry = currentCard
    ? `${String(currentCard.exp_month).padStart(2, "0")} / ${String(
        currentCard.exp_year,
      ).slice(-2)}`
    : ""

  const inlinePlanInfo = getInlinePlanInfo()

  return (
    <div>
      <div className="divide-y-2 divide-zinc-200 dark:divide-zinc-800">
        {/* BILLING INFO (CARD) ============================================== */}
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-800 dark:text-gray-200 ">
              Billing info
            </h2>
            <p className="mt-1  text-gray-600 dark:text-gray-300">
              Update your payment method
            </p>
          </div>

          {dataLoading ? (
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="sm:col-span-3">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="sm:col-span-2">
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="sm:col-span-1">
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
              <div className="mt-8">
                <Skeleton className="h-11 w-20" />
              </div>
            </div>
          ) : (
            <form className="md:col-span-2" onSubmit={handleUpdateCard}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <FormInput
                    id="cardholder-name"
                    label="Cardholder name"
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                  />
                </div>

                {hasExistingCard && !useNewCard ? (
                  <>
                    <div className="sm:col-span-3">
                      <label className="block font-semibold text-gray-600 dark:text-gray-300">
                        Card number
                      </label>
                      <div className="mt-2 flex items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2.5 text-gray-600 dark:text-gray-400 ring-2 ring-inset ring-zinc-200 dark:ring-zinc-700">
                        <span className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {currentCard?.brand}
                        </span>
                        <span>{maskedCardNumber}</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-600 dark:text-gray-300">
                        Expiration date
                      </label>
                      <div className="mt-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2.5 text-gray-600 dark:text-gray-400 ring-2 ring-inset ring-zinc-200 dark:ring-zinc-700">
                        {maskedExpiry}
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block font-semibold text-gray-600 dark:text-gray-300">
                        CVC
                      </label>
                      <div className="mt-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2.5 text-gray-600 dark:text-gray-400 ring-2 ring-inset ring-zinc-200 dark:ring-zinc-700">
                        •••
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <button
                        type="button"
                        onClick={() => setUseNewCard(true)}
                        className="font-medium text-sky-600 dark:text-sky-500 hover:text-sky-700 dark:hover:text-sky-400"
                      >
                        Use a different card
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sm:col-span-6">
                      <StripeCardInput />
                    </div>

                    {hasExistingCard && useNewCard && (
                      <div className="sm:col-span-6">
                        <button
                          type="button"
                          onClick={() => setUseNewCard(false)}
                          className="font-medium text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Cancel — use card on file
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-8 flex">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!cardInfoHasChanges || loading}
                >
                  {loading ? "Updating..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* BILLING ADDRESS ====================================== */}
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-800 dark:text-gray-200 ">
              Billing address
            </h2>
            <p className="mt-1  text-gray-600 dark:text-gray-300">
              Update your billing address
            </p>
          </div>

          {dataLoading ? (
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="sm:col-span-2">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="sm:col-span-3">
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="sm:col-span-1">
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="sm:col-span-2">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
              <div className="mt-8">
                <Skeleton className="h-11 w-20" />
              </div>
            </div>
          ) : (
            <form className="md:col-span-2" onSubmit={handleUpdateAddress}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <FormInput
                    id="street-address"
                    label="Street address"
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-600 dark:text-gray-300">
                    Country
                  </label>
                  <div className="mt-2">
                    <Dropdown
                      buttonClassName="w-full"
                      options={["United States", "Canada", "United Kingdom"]}
                      value={country}
                      onChange={setCountry}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <FormInput
                    id="city"
                    label="City"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-1">
                  <FormInput
                    id="state"
                    label="State"
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FormInput
                    id="zip"
                    label="Zip code"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 flex">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!addressHasChanges || loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* PRICE PLAN ====================================================== */}
        {/* SPLIT INTO 3 PARTS: INFO GRID → FULL-WIDTH EXPAND → BUTTON ====== */}
        {/* THIS LETS THE TILES USE FULL WIDTH WHILE THE PLAN CARD AND ======= */}
        {/* BUTTON STAY ALIGNED WITH THE RIGHT COLUMN ======================== */}
        <div className="relative">
          {message && (
            <Toast
              message={message}
              type={messageType}
              onDismiss={() => setMessage(null)}
            />
          )}

          {/* PART 1: PLAN INFO — GRID LAYOUT ============================== */}
          <div
            ref={planSectionRef}
            className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 pt-16 sm:px-6 md:grid-cols-3 lg:px-8 scroll-mt-24"
          >
            <div>
              <h2 className="text-base/7 font-semibold text-gray-800 dark:text-gray-200">
                Price plan
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Manage your subscription and billing cycle
              </p>
            </div>

            {dataLoading ? (
              <div className="md:col-span-2">
                <Skeleton className="h-24 w-56 rounded-lg" />
                <Skeleton className="h-5 w-48 mt-3" />
                <Skeleton className="h-11 w-56 mt-6" />
              </div>
            ) : (
              <div className="md:col-span-2">
                {/* Current Plan Card */}
                <div className="relative overflow-hidden rounded-lg pl-6 p-4 bg-white dark:bg-zinc-950 ring-inset ring-2 ring-zinc-200 dark:ring-zinc-700 w-56">
                  <div className="absolute left-0 h-full w-2 top-0 bg-sky-600 dark:bg-sky-500" />

                  {currentPlan === "deferred" ? (
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
                        {(() => {
                          const planBase = currentPlan
                            .replace("_monthly", "")
                            .replace("_annually", "")
                          const plan = PRICE_PLANS.find(
                            (p) => p.id === planBase,
                          )
                          return plan?.name || "Unknown Plan"
                        })()}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg">
                        {(() => {
                          const planBase = currentPlan
                            .replace("_monthly", "")
                            .replace("_annually", "")
                          const cycle = currentPlan.endsWith("_annually")
                            ? "annually"
                            : "monthly"
                          const plan = PRICE_PLANS.find(
                            (p) => p.id === planBase,
                          )
                          if (!plan) return ""
                          const price = plan.price[cycle]
                          const cycleLabel =
                            cycle === "monthly" ? "month" : "year"
                          return `${price}/${cycleLabel}`
                        })()}
                      </p>
                    </>
                  )}
                </div>

                {/* Next Payment Date */}
                {nextPaymentDate && currentPlan !== "deferred" && (
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    Next payment:{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {new Date(nextPaymentDate * 1000).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* PART 2: FULL-WIDTH INLINE EXPAND ============================= */}
          {/* LIVES OUTSIDE THE GRID SO TILES GET FULL WIDTH =============== */}
          <div className="sm:px-6 lg:px-8">
            <ChangePlanInline
              isExpanded={isPlanExpanded}
              onCollapse={handleCollapse}
              currentPlanId={currentPlan}
              onSelectionChange={handleSelectionChange}
            />
          </div>

          {/* PART 3: BUTTON — ALIGNED WITH RIGHT COLUMN =================== */}
          {/* USES MATCHING GRID SO IT SITS UNDER THE PLAN CARD ============ */}
          {!dataLoading && (
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 pb-16 pt-6 sm:px-6 md:grid-cols-3 lg:px-8">
              <div className="hidden md:block" />
              <div className="md:col-span-2">
                <Button
                  variant={
                    isPlanExpanded && inlineHasChanges
                      ? "primary"
                      : isPlanExpanded
                        ? "secondary"
                        : "primary"
                  }
                  onClick={
                    isPlanExpanded
                      ? inlineHasChanges
                        ? handleConfirmPlan
                        : handleCollapse
                      : () => setIsPlanExpanded(true)
                  }
                  disabled={planLoading}
                  type="button"
                  className="w-56 justify-center disabled:opacity-100 disabled:border-sky-600 dark:disabled:border-sky-500"
                >
                  {planLoading
                    ? "Updating..."
                    : isPlanExpanded
                      ? inlineHasChanges && inlinePlanInfo
                        ? `Update to ${inlinePlanInfo.name} – ${inlinePlanInfo.price}/${inlinePlanInfo.cycleLabel}`
                        : "Current Plan"
                      : "Change plan"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BillingSettings
