"use client"

import { useForm } from "react-hook-form"
import { useEffect } from "react"
import TermsModal from "./TermsModal"
import FormInput from "@/components/ui/form-input"
import { useSignupStore } from "@/app/(auth)/signup/_components/useSignupStore"
import { createClient } from "@/lib/supabase/client"

export type StepProfileValues = {
  firstName: string
  lastName: string
  email: string
  country: string
  city?: string
  region?: string
  postalCode?: string
  tosAccepted: boolean
  marketingOk?: boolean
}

type StepProfileProps = {
  onSubmit?: (values: StepProfileValues) => void
  defaultValues?: Partial<StepProfileValues>
  registerSubmit?: (submitFn: () => Promise<boolean>) => void // ★ NEW
}

const countries = ["USA", "Mars", "IDK"]

export default function StepProfile({
  onSubmit,
  registerSubmit, // ★ NEW
}: StepProfileProps) {
  const setProfile = useSignupStore((s) => s.setProfile)
  const savedProfile = useSignupStore((s) => s.profile)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitted, submitCount },
  } = useForm<StepProfileValues>({
    defaultValues: savedProfile ?? {
      firstName: "",
      lastName: "",
      email: "",
      country: countries[0],
      city: "",
      region: "",
      postalCode: "",
      tosAccepted: false,
      marketingOk: false,
    },
  })

  useEffect(() => {
    if (savedProfile) {
      reset(savedProfile)
    }
  }, [savedProfile, reset])

  // Prefill email from the authenticated user
  useEffect(() => {
    async function loadAuthEmail() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setValue("email", user.email)
      }
    }
    loadAuthEmail()
  }, [setValue])

  const handleFormSubmit = (values: StepProfileValues) => {
    setProfile(values)
    onSubmit?.(values)
    return true // ★ REQUIRED for navbar sequence logic
  }

  // EXPOSE SUBMIT FUNCTION UPWARD
  if (registerSubmit) {
    registerSubmit(
      async () =>
        new Promise<boolean>((resolve) => {
          handleSubmit(
            (values) => {
              handleFormSubmit(values) // 🔥 REQUIRED
              resolve(true)
            },
            () => resolve(false),
          )()
        }),
    )
  }

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
              Personal Information
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Just enter your name and email and an optional avatar.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-6 md:col-span-2">
            {/* First name */}
            {/* First name */}
            <div className="sm:col-span-3">
              <FormInput
                label="First name"
                id="first-name"
                type="text"
                autoComplete="given-name"
                error={
                  isSubmitted || submitCount > 0
                    ? errors.firstName?.message
                    : ""
                }
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 40,
                    message: "First name must be less than 40 characters",
                  },
                })}
              />
            </div>

            {/* Last name */}
            <div className="sm:col-span-3">
              <FormInput
                label="Last name"
                id="last-name"
                type="text"
                autoComplete="family-name"
                error={
                  isSubmitted || submitCount > 0 ? errors.lastName?.message : ""
                }
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 40,
                    message: "Last name must be less than 40 characters",
                  },
                })}
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-5">
              <FormInput
                label="Email address"
                id="email"
                type="email"
                autoComplete="email"
                readOnly
                tabIndex={-1}
                className="cursor-default opacity-80 focus:outline-zinc-200 dark:focus:outline-zinc-700"
                {...register("email")}
              />
              <p className="mt-2  text-gray-600 dark:text-gray-300">
                You can change your email later in settings.
              </p>
            </div>

            {/* CHECKBOXES */}
            {/* CHECKBOXES */}
            <div className="sm:col-span-6">
              {/* TOS */}
              <div className="flex items-center gap-3 mt-4">
                <span className="group grid size-5 grid-cols-1 shrink-0">
                  <input
                    type="checkbox"
                    {...register("tosAccepted", {
                      required: "You must accept the terms to continue",
                    })}
                    className="col-start-1 row-start-1 appearance-none rounded-sm border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                  />
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center justify-self-center stroke-white opacity-0 group-has-checked:opacity-100 transition"
                  >
                    <path
                      d="M5 10l3 3 7-7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <div className="flex gap-1 text-gray-800 dark:text-gray-200">
                  I agree to The Pirate Ship's <TermsModal />
                </div>
              </div>

              {errors.tosAccepted && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tosAccepted.message}
                </p>
              )}

              {/* Marketing */}
              <div className="flex items-center gap-3 mt-4">
                <span className="group grid size-5 grid-cols-1 shrink-0">
                  <input
                    type="checkbox"
                    {...register("marketingOk")}
                    className="col-start-1 row-start-1 appearance-none rounded-sm border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                  />
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center justify-self-center stroke-white opacity-0 group-has-checked:opacity-100 transition"
                  >
                    <path
                      d="M5 10l3 3 7-7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="text-gray-800 dark:text-gray-200">
                  I would like to receive updates about new features and stuff
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
