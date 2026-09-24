"use client"

import { useForm, Controller } from "react-hook-form"
import { useState, useRef, useEffect } from "react"
import { PhoneIcon } from "@heroicons/react/24/outline"

import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"
import SceneHeader from "@/components/ui/scene-header"
import Toast from "@/components/ui/toast"
import GridBackground from "@/components/ui/grid-background"

// TODO: replace with Raeann's real number
const PHONE = "941-555-0123"
const PHONE_HREF = "tel:+19415550123"

// Module scope — keeps Date.now() out of the component body so the
// react-hooks purity rule doesn't flag it
const now = () => Date.now()

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  company: string // honeypot — humans never see or fill this
}

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormData>()

  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | null
  >(null)

  const mountedAtRef = useRef(0)

  useEffect(() => {
    mountedAtRef.current = now()
  }, [])

  const onSubmit = async (data: FormData) => {
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      message: data.message,
      company: data.company,
      elapsedMs: now() - mountedAtRef.current,
    }

    try {
      setSubmissionStatus(null)

      const res = await fetch(process.env.NEXT_PUBLIC_CONTACT_ENDPOINT!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`Request failed: ${res.status}`)

      setSubmissionStatus("success")
      reset()
    } catch (err) {
      console.error("Form submission error:", err)
      setSubmissionStatus("error")
    }
  }

  return (
    <section id="contact" className="relative isolate scroll-mt-[70px]">
      <GridBackground />

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* LEFT — header + phone */}
        <div className="px-6 pt-16 pb-16 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <SceneHeader
              className="text-left"
              icon="paperAirplane"
              eyebrow="Contact"
              title={<>Get in touch</>}
              caption={
                <>
                  Send a brief description of the case. You'll have a response
                  within one business day.
                </>
              }
            />

            <dl className="mt-10 space-y-4 text-base/7 text-zinc-600 dark:text-zinc-400">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>

                  <PhoneIcon
                    aria-hidden="true"
                    className="h-7 w-6 text-zinc-400 dark:text-zinc-500"
                  />
                </dt>

                <dd>
                  <a
                    href={PHONE_HREF}
                    className="hover:text-succulent transition-colors"
                  >
                    {PHONE}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* RIGHT — form */}
        <form
          // eslint-disable-next-line react-hooks/refs
          onSubmit={handleSubmit(onSubmit)}
          className="relative px-6 pt-8 pb-24 lg:px-8 lg:py-32"
        >
          {/* Honeypot — offscreen, not display:none (bots skip hidden fields) */}
          <div className="absolute -left-[9999px] top-0" aria-hidden="true">
            <label htmlFor="company">Company</label>

            <input
              id="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("company")}
            />
          </div>

          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <FormInput
                id="first-name"
                label="First name"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "First name is required",
                })}
              />

              <FormInput
                id="last-name"
                label="Last name"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />

              <div className="sm:col-span-2">
                <FormInput
                  id="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>

              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{3}-\d{3}-\d{4}$/,
                    message: "Format must be 123-456-7890",
                  },
                }}
                render={({
                  field: { onChange, value, ...field },
                  fieldState: { error },
                }) => {
                  const formatPhoneNumber = (input: string) => {
                    const digits = input.replace(/\D/g, "").slice(0, 10)
                    const a = digits.slice(0, 3)
                    const b = digits.slice(3, 6)
                    const c = digits.slice(6, 10)

                    if (digits.length > 6) return `${a}-${b}-${c}`
                    if (digits.length > 3) return `${a}-${b}`

                    return a
                  }

                  return (
                    <div className="sm:col-span-2">
                      <FormInput
                        id="phone-number"
                        label="Phone number"
                        type="tel"
                        value={value || ""}
                        onChange={(e) =>
                          onChange(formatPhoneNumber(e.target.value))
                        }
                        error={error?.message}
                        {...field}
                      />
                    </div>
                  )
                }}
              />

              {/* Message textarea */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block font-semibold text-gray-600 dark:text-gray-300"
                >
                  Message
                </label>

                <div className="mt-2.5">
                  <div className="relative group">
                    <textarea
                      id="message"
                      rows={4}
                      {...register("message", {
                        required: "Message is required",
                      })}
                      className="
                        block w-full rounded-md
                        bg-white dark:bg-zinc-950
                        px-3.5 py-2 text-base
                        text-gray-800 dark:text-gray-200
                        outline-1 -outline-offset-1
                        outline-zinc-300 dark:outline-zinc-700
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-1 focus:outline-succulent
                      "
                    />

                    {/* Left accent bar — matches FormInput */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-px top-px bottom-px w-1 rounded-l bg-succulent opacity-0 transition-opacity duration-200 group-focus-within:opacity-100"
                    />
                  </div>

                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Toast is absolute here — floats above the button, no layout shift */}
            <div className="relative mt-8 flex justify-end">
              {submissionStatus && (
                <Toast
                  message={
                    submissionStatus === "success"
                      ? "Message sent!"
                      : "Error sending message. Please try again."
                  }
                  type={submissionStatus}
                  from="bottom"
                  onDismiss={() => setSubmissionStatus(null)}
                  className="absolute top-auto bottom-full right-0 mb-3 w-auto max-w-sm"
                />
              )}

              <Button
                as="button"
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full sm:w-auto disabled:bg-succulent disabled:text-white disabled:border-sand disabled:brightness-125 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
