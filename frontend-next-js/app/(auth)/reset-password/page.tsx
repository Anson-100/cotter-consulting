"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  EyeSlashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  DocumentCurrencyDollarIcon,
} from "@heroicons/react/24/solid"
import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"
import { useDarkModeStore } from "@/lib/useDarkModeStore"
import { PASSWORD_RULES, validatePassword } from "@/lib/validations/password"

type FormValues = {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  const { initialize } = useDarkModeStore()

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<FormValues>()

  const watchedPassword = watch("password", "")

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    // User should already have a session from the callback route
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsValidSession(!!session)
    }
    checkSession()
  }, [supabase])

  const onSubmit = async ({ password }: FormValues) => {
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      return
    }

    await supabase.auth.signOut()
    setSuccess(true)
    setTimeout(() => router.push("/?signin=open"), 3000) // Add query param
  }

  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Invalid or expired link
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Button variant="primary" onClick={() => router.push("/")}>
            Go to homepage
          </Button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-emerald-200/60 dark:bg-emerald-900/30 ring-2 ring-emerald-400 dark:ring-emerald-800 rounded-full flex items-center justify-center">
            <CheckIcon className="size-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Password updated!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your password has been reset successfully. Redirecting you to sign
            in...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col space-y-12 items-center justify-center p-4 bg-zinc-200 dark:bg-zinc-950">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <DocumentCurrencyDollarIcon className="h-10 text-indigo-600" />
          <div className="flex items-center text-white">
            <h1 className="text-5xl font-semibold m-0">Pirate</h1>
            <h1 className="text-5xl ml-1 text-gray-300">Ship</h1>
          </div>
        </div>
      </div>
      <div className="max-w-md w-full bg-zinc-100 dark:bg-zinc-950 rounded-xl shadow-lg p-8 dark:ring-2 dark:ring-inset dark:ring-zinc-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Set new password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            id="password"
            label="New password"
            type={showPassword ? "text" : "password"}
            error={isSubmitted ? errors.password?.message : undefined}
            {...register("password", {
              required: "Password is required",
              validate: validatePassword,
            })}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
          />

          {watchedPassword.length > 0 && (
            <ul className="space-y-1 text-sm">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(watchedPassword)
                return (
                  <li key={rule.key} className="flex items-center gap-2">
                    {passed ? (
                      <CheckIcon className="size-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XMarkIcon className="size-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
                    )}
                    <span className={passed ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}>
                      {rule.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          <FormInput
            id="confirmPassword"
            label="Confirm new password"
            type={showPassword ? "text" : "password"}
            error={isSubmitted ? errors.confirmPassword?.message : undefined}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) =>
                val === getValues("password") || "Passwords do not match",
            })}
          />

          {error && <p className="text-red-600">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
