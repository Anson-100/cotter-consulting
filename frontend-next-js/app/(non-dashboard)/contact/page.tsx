"use client"

import { useForm, Controller } from "react-hook-form"
import { useState } from "react"
import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"
import SceneHeader from "@/components/ui/scene-header"

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
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

  const onSubmit = async (data: FormData) => {
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      message: data.message,
    }

    try {
      setSubmissionStatus(null)

      const res = await fetch(
        "https://m1ffj58tfe.execute-api.us-east-1.amazonaws.com/LawnHarmonySendEmail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      )

      const resData = await res.json()
      console.log("Form submitted successfully:", resData.message)

      setSubmissionStatus("success")
      reset()
    } catch (err) {
      console.error("Form submission error:", err)
      setSubmissionStatus("error")
    }
  }

  return (
    <section id="contact" className="min-h-screen relative isolate">
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SceneHeader
            eyebrow=""
            title={
              <>
                Let&apos;s{" "}
                <span className="text-sky-600 dark:text-sky-500">talk</span>
              </>
            }
            caption={<></>}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-16 max-w-xl sm:mt-20"
        >
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

            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block font-semibold text-gray-800 dark:text-gray-300"
              >
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  rows={4}
                  {...register("message", {
                    required: "Message is required",
                  })}
                  className="block w-full rounded-md bg-white dark:bg-zinc-950 px-3.5 py-2 text-base text-zinc-800 outline-2 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700 placeholder:text-gray-400 dark:text-gray-200 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-end gap-3">
            {submissionStatus === "success" && (
              <p className="text-sm text-emerald-600 font-medium">
                Message sent!
              </p>
            )}
            {submissionStatus === "error" && (
              <p className="text-sm text-red-600 font-medium">
                Error sending message. Please try again.
              </p>
            )}

            <Button
              as="button"
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {isSubmitting ? "Submitting..." : "Send message"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
