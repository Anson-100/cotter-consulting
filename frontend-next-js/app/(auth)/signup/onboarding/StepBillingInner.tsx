"use client"

import { useForm, Controller } from "react-hook-form"
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid"
import { useEffect, useState } from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import FormInput from "@/components/ui/form-input"
import { useSignupStore } from "@/app/(auth)/signup/_components/useSignupStore"
import StripeCardInput from "@/components/StripeCardInput"
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js"

export type StepBillingValues = {
  cardholderName: string
  cardNumber: string
  expirationDate: string
  cvc: string
  country: string
  streetAddress: string
  city: string
  region: string
  postalCode: string
}

export type BillingForSupabase = Omit<
  StepBillingValues,
  "cardNumber" | "expirationDate" | "cvc"
>

export type StepBillingProps = {
  onSubmit?: (values: StepBillingValues) => void
  defaultValues?: Partial<StepBillingValues>
  registerSubmit?: (fn: () => Promise<boolean>) => void
}

const countries = ["US", "CA", "GB", "AU", "NZ"] // not "USA", "Mars", "IDK"

export default function StepBillingInner({
  onSubmit,
  registerSubmit,
}: StepBillingProps) {
  const setBilling = useSignupStore((s) => s.setBilling)
  const setCardPreview = useSignupStore((s) => s.setCardPreview)
  const setPaymentMethodId = useSignupStore((s) => s.setPaymentMethodId)
  const setStripeCustomerId = useSignupStore((s) => s.setStripeCustomerId)

  const savedBilling = useSignupStore((s) => s.billing)
  const stripe = useStripe()
  const elements = useElements()

  const cardPreview = useSignupStore((s) => s.cardPreview)
  const paymentMethodId = useSignupStore((s) => s.paymentMethodId)

  const hasExistingCard = !!(cardPreview && paymentMethodId)
  const [useNewCard, setUseNewCard] = useState(false)

  async function createSetupIntent() {
    const res = await fetch("/api/stripe/setup-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: null }), // or an actual ID
    })

    if (!res.ok) throw new Error("Failed to create setup intent")
    return res.json()
  }

  const { handleSubmit, control, trigger, reset } = useForm<StepBillingValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: savedBilling ?? {
      cardholderName: "",
      cardNumber: "",
      expirationDate: "",
      cvc: "",
      country: countries[0],
      streetAddress: "",
      city: "",
      region: "",
      postalCode: "",
    },
  })

  useEffect(() => {
    if (savedBilling) reset(savedBilling)
  }, [savedBilling, reset])

  const handleFormSubmit = async (values: StepBillingValues) => {
    console.log("Form submitted", values) // Add this

    // If using existing card, skip Stripe flow entirely
    if (hasExistingCard && !useNewCard) {
      setBilling({
        cardholderName: values.cardholderName,
        country: values.country,
        streetAddress: values.streetAddress,
        city: values.city,
        region: values.region,
        postalCode: values.postalCode,
      })
      onSubmit?.(values)
      return true
    }

    if (!stripe || !elements) {
      console.error("Stripe not loaded")
      return false
    }

    try {
      // 1. Create Setup Intent
      const { clientSecret, customerId } = await createSetupIntent()

      // 2. Confirm card setup
      const cardElement = elements.getElement(CardNumberElement)
      if (!cardElement) {
        console.error("Card element not found")
        return false
      }

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: values.cardholderName,
            address: {
              country: values.country,
              line1: values.streetAddress,
              city: values.city,
              state: values.region,
              postal_code: values.postalCode,
            },
          },
        },
      })

      if (result.error) {
        console.error("Stripe error:", result.error.message)
        return false
      }

      const paymentMethodId = result.setupIntent.payment_method as string

      // 🔥 Save paymentMethodId to Zustand for the finalize step
      // 🔥 Save paymentMethodId to Zustand for the finalize step
      setPaymentMethodId(paymentMethodId)
      setStripeCustomerId(customerId)

      // 3. Tell your server to attach this payment method and store billing
      const completeRes = await fetch("/api/stripe/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId,
          billing: {
            cardholderName: values.cardholderName,
            country: values.country,
            streetAddress: values.streetAddress,
            city: values.city,
            region: values.region,
            postalCode: values.postalCode,
          },
        }),
      })

      if (!completeRes.ok) {
        console.error("Complete API failed:", await completeRes.text())
        return false
      }

      // 🔥 Parse response and save card preview
      const completeData = await completeRes.json()
      if (completeData.card) {
        setCardPreview(completeData.card)
      }

      // 4. Save billing locally

      // 4. Save billing locally
      console.log("Setting billing in Zustand", values) // Add this
      setBilling({
        cardholderName: values.cardholderName,
        country: values.country,
        streetAddress: values.streetAddress,
        city: values.city,
        region: values.region,
        postalCode: values.postalCode,
      })

      // 5. Continue onboarding
      onSubmit?.(values)
      return true
    } catch (error) {
      console.error("Payment error:", error)
      return false
    }
  }

  if (registerSubmit) {
    registerSubmit(async () => {
      const isValid = await trigger()

      if (isValid) {
        await handleSubmit(handleFormSubmit)()
      }

      return isValid
    })
  }

  const maskedCardNumber = cardPreview
    ? `•••• •••• •••• ${cardPreview.last4}`
    : ""

  const maskedExpiry = cardPreview
    ? `${String(cardPreview.exp_month).padStart(2, "0")} / ${String(
        cardPreview.exp_year
      ).slice(-2)}`
    : ""

  return (
    <form
      className="max-w-7xl mx-auto"
      noValidate
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-lg/7 font-semibold text-gray-800 dark:text-gray-200">
              Billing Information
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Enter your payment details. All transactions are secure.
            </p>
          </div>

          <div className="max-w-2xl md:col-span-2 space-y-4">
            <div className="col-span-1 sm:col-span-6">
              <h2 className=" font-semibold text-sky-600 dark:text-sky-500">
                Card info
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-6 mb-12">
              {/* Cardholder Name */}
              <div className="sm:col-span-6">
                <Controller
                  name="cardholderName"
                  control={control}
                  rules={{
                    required: "Cardholder name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 80,
                      message: "Name must be less than 80 characters",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormInput
                      label="Cardholder name"
                      id="card-name"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Card Number / Expiration / CVC handled inside StripeCardInput */}
            </div>

            {hasExistingCard && !useNewCard ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                  {/* Masked Card Number */}
                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-gray-600 dark:text-gray-300">
                      Card number
                    </label>
                    <div className="mt-2 flex items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2.5 text-gray-600 dark:text-gray-400 ring-2 ring-inset ring-zinc-200 dark:ring-zinc-700">
                      <span className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {cardPreview?.brand}
                      </span>
                      <span>{maskedCardNumber}</span>
                    </div>
                  </div>

                  {/* Masked Expiration */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-600 dark:text-gray-300">
                      Expiration date
                    </label>
                    <div className="mt-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2.5 text-gray-600 dark:text-gray-400 ring-2 ring-inset ring-zinc-200 dark:ring-zinc-700">
                      {maskedExpiry}
                    </div>
                  </div>

                  {/* Masked CVC */}
                  <div className="sm:col-span-1">
                    <label className="block font-semibold text-gray-600 dark:text-gray-300">
                      CVC
                    </label>
                    <div className="mt-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2.5 text-gray-600 dark:text-gray-400 ring-2 ring-inset ring-zinc-200 dark:ring-zinc-700">
                      •••
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUseNewCard(true)}
                  className="font-medium text-sky-600 dark:text-sky-500 hover:text-sky-700 dark:hover:text-sky-400"
                >
                  Use a different card
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <StripeCardInput />

                {hasExistingCard && useNewCard && (
                  <button
                    type="button"
                    onClick={() => setUseNewCard(false)}
                    className="font-medium text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300 "
                  >
                    Cancel — use card on file
                  </button>
                )}
              </div>
            )}

            {/* Billing Address */}
            <div className="col-span-1 sm:col-span-6 mt-12">
              <h2 className="font-semibold text-sky-600 dark:text-sky-500">
                Billing address
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-6">
              {/* Country */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block font-semibold text-gray-600 dark:text-gray-300"
                >
                  Country
                </label>

                <div className="grid grid-cols-1 mt-2">
                  <div className="flex flex-col">
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Listbox
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <div className="relative">
                              <ListboxButton className="flex justify-between items-center w-full rounded-md bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-base text-zinc-800 outline-2 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700 placeholder:text-gray-400 dark:text-gray-200 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500">
                                {field.value}
                                <ChevronDownIcon className="-mr-1 size-5 text-gray-400" />
                              </ListboxButton>

                              <ListboxOptions className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white dark:bg-zinc-950 overflow-hidden shadow-lg ring-2 ring-zinc-200 dark:ring-zinc-700 focus:outline-none">
                                {countries.map((opt) => (
                                  <ListboxOption
                                    key={opt}
                                    value={opt}
                                    className={({ active }) =>
                                      `block cursor-pointer px-4 py-2 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                                        active
                                          ? "text-gray-600 dark:text-gray-300 bg-zinc-100 dark:bg-zinc-900"
                                          : "text-gray-600 dark:text-gray-300"
                                      }`
                                    }
                                  >
                                    {({ selected }) => (
                                      <span className="flex justify-between items-center">
                                        {opt}
                                        {selected && (
                                          <CheckIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                                        )}
                                      </span>
                                    )}
                                  </ListboxOption>
                                ))}
                              </ListboxOptions>
                            </div>
                          </Listbox>

                          {fieldState.error?.message && (
                            <p className="mt-1 text-sm text-red-600">
                              {fieldState.error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Street */}
              <div className="sm:col-span-3">
                <Controller
                  name="streetAddress"
                  control={control}
                  rules={{
                    required: "Street address is required",
                    minLength: {
                      value: 3,
                      message: "Address must be at least 3 characters",
                    },
                    maxLength: {
                      value: 60,
                      message: "Address must be less than 60 characters",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormInput
                      label="Street address"
                      id="street-address"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* City */}
              <div className="sm:col-span-2 sm:col-start-1">
                <Controller
                  name="city"
                  control={control}
                  rules={{
                    required: "City is required",
                    minLength: {
                      value: 2,
                      message: "City must be at least 2 characters",
                    },
                    maxLength: {
                      value: 60,
                      message: "City must be less than 60 characters",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormInput
                      label="City"
                      id="city"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* State */}
              <div className="sm:col-span-2">
                <Controller
                  name="region"
                  control={control}
                  rules={{
                    required: "State / Province is required",
                    pattern: {
                      value: /^[A-Za-z]{2}$/,
                      message: "Use 2-letter code (e.g., FL)",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormInput
                      label="State / Province"
                      id="region"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* ZIP */}
              <div className="sm:col-span-2">
                <Controller
                  name="postalCode"
                  control={control}
                  rules={{
                    required: "Postal code is required",
                    pattern: {
                      value: /^\d{5}(-\d{4})?$/,
                      message: "Enter a valid ZIP code",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormInput
                      label="ZIP / Postal code"
                      id="postal-code"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
