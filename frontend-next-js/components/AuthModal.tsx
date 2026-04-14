/* eslint-disable react-hooks/set-state-in-effect */
// components/AuthModal.tsx
"use client"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "./ui/button"
import { useForm, Controller } from "react-hook-form"
import {
  EyeSlashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid"
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import FormInput from "./ui/form-input"
import { useRouter, useSearchParams } from "next/navigation"
import Portal from "./ui/portal"
import { useAuthModal } from "@/hooks/useAuthModal"
import { PASSWORD_RULES, validatePassword } from "@/lib/validations/password"

type AuthMode = "signup" | "signin" | "forgot"

export default function AuthModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { isOpen, mode, openAuthModal, closeAuthModal } = useAuthModal()

  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // OTP Verification State
  const [showVerification, setShowVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [otpCode, setOtpCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      )
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Listen for ?signin=open URL param
  useEffect(() => {
    if (searchParams.get("signin") === "open") {
      openAuthModal("signin")
      router.replace("/")
    }
  }, [searchParams, router, openAuthModal])

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowPassword(false)
      setResetEmailSent(false)
      setAuthError(null)
      setShowVerification(false)
      setPendingEmail(null)
      setOtpCode("")
    }
  }, [isOpen])

  const switchMode = (newMode: AuthMode) => {
    openAuthModal(newMode)
    setShowPassword(false)
    setResetEmailSent(false)
    setAuthError(null)
    setShowVerification(false)
    setPendingEmail(null)
    setOtpCode("")
  }

  type FormValues = {
    email: string
    password: string
    confirmPassword?: string
    remember?: boolean
  }

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors, isSubmitting, isSubmitted, submitCount },
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldUnregister: true,
    shouldFocusError: true,
    defaultValues: {
      remember:
        typeof window !== "undefined"
          ? localStorage.getItem("rememberMe") === "true"
          : false,
    },
  })

  const showErrors = isSubmitted || submitCount > 0
  const isSignup = mode === "signup"
  const isForgot = mode === "forgot"
  const watchedPassword = watch("password", "")

  // Handle forgot password submission
  const handleForgotPassword = async (email: string) => {
    setAuthError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback`,
    })
    if (error) {
      setAuthError(error.message)
      return
    }
    setResetEmailSent(true)
  }

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    if (!pendingEmail || otpCode.length !== 8) return

    setIsVerifying(true)
    setAuthError(null)

    const { error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token: otpCode,
      type: "signup",
    })

    setIsVerifying(false)

    if (error) {
      setAuthError(error.message)
      return
    }

    // Success! Close modal and redirect to onboarding
    closeAuthModal()
    router.push("/signup/onboarding")
  }

  // Handle Resend Code
  const handleResendCode = async () => {
    if (!pendingEmail || resendCooldown > 0) return

    setAuthError(null)
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
    })

    if (error) {
      setAuthError(error.message)
      return
    }

    setResendCooldown(60)
  }

  // Get modal title based on state
  const getModalTitle = () => {
    if (showVerification) return "Verify your email"
    if (isForgot) return "Reset password"
    if (isSignup) return "Create your account"
    return "Sign in"
  }

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed flex backdrop-blur-md bg-zinc-950/80 justify-center items-center inset-0 z-9999 p-2  "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-100 dark:bg-zinc-950 rounded-b-xl rounded-t-xl shadow-lg relative 
             dark:ring-2 dark:ring-inset dark:ring-zinc-800 
             max-h-full flex flex-col w-full sm:w-md z-10000"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full h-3 bg-indigo-600 dark:bg-indigo-500 rounded-t-xl"></div>
              <div className="w-full px-6 lg:px-8 pb-4 pt-4 border-b-2 border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {getModalTitle()}
                  </h2>
                  <button
                    onClick={() => !isRedirecting && closeAuthModal()}
                    className="absolute top-6 right-4 text-zinc-600 dark:text-zinc-500 hover:cursor-pointer"
                    disabled={isRedirecting}
                  >
                    <XMarkIcon className="size-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] overscroll-contain px-6 lg:px-8 pb-8 min-h-0">
                <div className="mx-auto w-full max-w-sm lg:w-96 mt-10">
                  {/* OTP VERIFICATION VIEW */}
                  {showVerification ? (
                    <div className="space-y-6">
                      {/* Icon and instructions */}
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400 dark:ring-indigo-700 rounded-full flex items-center justify-center">
                          <EnvelopeIcon className="size-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          We sent an 8-digit code to{" "}
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {pendingEmail}
                          </span>
                        </p>
                      </div>

                      {/* Code input */}
                      <div>
                        <FormInput
                          id="otp-code"
                          label="Verification code"
                          type="text"
                          inputMode="numeric"
                          maxLength={8}
                          placeholder="00000000"
                          value={otpCode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "")
                            setOtpCode(value)
                          }}
                          autoFocus
                        />
                      </div>

                      {/* Error message */}
                      {authError && <p className="text-red-600">{authError}</p>}

                      {/* Verify button */}
                      <Button
                        type="button"
                        variant="primary"
                        className="w-full justify-center"
                        disabled={otpCode.length !== 8 || isVerifying}
                        onClick={handleVerifyOtp}
                      >
                        {isVerifying ? "Verifying..." : "Verify email"}
                      </Button>

                      {/* Resend code */}
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                          Didn't receive a code?{" "}
                          {resendCooldown > 0 ? (
                            <span className="text-gray-500">
                              Resend in {resendCooldown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendCode}
                              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400"
                            >
                              Resend code
                            </button>
                          )}
                        </p>
                      </div>

                      {/* Back button */}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setShowVerification(false)
                          setPendingEmail(null)
                          setOtpCode("")
                          setAuthError(null)
                        }}
                        className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold w-full border-none bg-zinc-100 hover:bg-zinc-100 dark:bg-transparent"
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to sign up
                      </Button>
                    </div>
                  ) : isForgot ? (
                    /* FORGOT PASSWORD VIEW */
                    resetEmailSent ? (
                      // Success message
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-emerald-200/60 dark:bg-emerald-900/30 ring-2 ring-emerald-400 dark:ring-emerald-800 rounded-full flex items-center justify-center">
                          <CheckIcon className="size-8 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Check your email
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          We've sent a password reset link to your email
                          address. Click the link to reset your password.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          You can close this tab.
                        </p>
                        <Button
                          variant="secondary"
                          className="w-full justify-center mt-6"
                          onClick={() => switchMode("signin")}
                        >
                          Back to sign in
                        </Button>
                      </div>
                    ) : (
                      // Forgot password form
                      <form
                        className="space-y-6"
                        noValidate
                        onSubmit={handleSubmit(async ({ email }) => {
                          await handleForgotPassword(email)
                        })}
                      >
                        <p className="text-gray-700 dark:text-gray-200">
                          Enter your email address and we will send a reset link
                          to your inbox
                        </p>
                        <FormInput
                          id="email"
                          label="Email address"
                          type="email"
                          error={showErrors ? errors.email?.message : undefined}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email address",
                            },
                          })}
                        />{" "}
                        <div className="flex flex-col space-y-3">
                          {authError && (
                            <p className="text-red-600 mt-2">{authError}</p>
                          )}
                          <Button
                            type="submit"
                            variant="primary"
                            className="w-full justify-center"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Sending..." : "Send reset link"}
                          </Button>{" "}
                          <Button
                            variant="secondary"
                            onClick={() => switchMode("signin")}
                            className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold w-full border-none bg-zinc-100 hover:bg-zinc-100"
                          >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to sign in
                          </Button>
                        </div>
                      </form>
                    )
                  ) : (
                    // SIGN IN / SIGN UP VIEW
                    <form
                      className="space-y-6"
                      noValidate
                      onSubmit={handleSubmit(
                        async ({ email, password, remember }) => {
                          setAuthError(null)

                          // Save preference and clear old session if unchecking
                          localStorage.setItem(
                            "rememberMe",
                            remember ? "true" : "false",
                          )
                          if (!remember) {
                            const projectId =
                              process.env.NEXT_PUBLIC_SUPABASE_URL?.split(
                                "//",
                              )[1]?.split(".")[0]
                            localStorage.removeItem(
                              `sb-${projectId}-auth-token`,
                            )
                          }

                          if (isSignup) {
                            const { error } = await supabase.auth.signUp({
                              email,
                              password,
                            })
                            if (error) return setAuthError(error.message)
                            setPendingEmail(email)
                            setShowVerification(true)
                            setResendCooldown(60)
                            return
                          }
                          const { error } =
                            await supabase.auth.signInWithPassword({
                              email,
                              password,
                            })
                          if (error) return setAuthError(error.message)
                          const {
                            data: { user },
                          } = await supabase.auth.getUser()
                          if (user) {
                            const { data: profile } = await supabase
                              .from("profiles")
                              .select("id")
                              .eq("id", user.id)
                              .maybeSingle()

                            setIsRedirecting(true)
                            if (profile) {
                              router.push("/dashboard")
                            } else {
                              router.push("/signup/onboarding")
                            }
                            // Modal stays open — it'll unmount when the new page loads
                          } else {
                            closeAuthModal()
                            router.push("/signup/onboarding")
                          }
                        },
                      )}
                    >
                      {/* EMAIL */}
                      <div>
                        <FormInput
                          id="email"
                          label="Email address"
                          type="email"
                          error={showErrors ? errors.email?.message : undefined}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email address",
                            },
                          })}
                        />
                      </div>

                      {/* PASSWORD */}
                      <div>
                        <div className="relative">
                          <FormInput
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            error={
                              showErrors ? errors.password?.message : undefined
                            }
                            {...register("password", {
                              required: "Password is required",
                              ...(isSignup
                                ? { validate: validatePassword }
                                : {
                                    minLength: {
                                      value: 8,
                                      message: "Minimum 8 characters",
                                    },
                                  }),
                            })}
                            rightElement={
                              <button
                                type="button"
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                                onClick={() => setShowPassword((v) => !v)}
                                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            }
                          />
                        </div>
                      </div>

                      {/* PASSWORD REQUIREMENTS CHECKLIST */}
                      {isSignup && watchedPassword.length > 0 && (
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

                      {authError && (
                        <p className="text-red-600 mt-2">{authError}</p>
                      )}

                      {/* CONFIRM PASSWORD */}
                      {isSignup && (
                        <div>
                          <FormInput
                            id="confirm-password"
                            label="Confirm Password"
                            type={showPassword ? "text" : "password"}
                            error={
                              showErrors
                                ? errors.confirmPassword?.message
                                : undefined
                            }
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (val) =>
                                val === getValues("password") ||
                                "Passwords do not match",
                            })}
                          />
                        </div>
                      )}

                      {/* REMEMBER ME */}
                      <div className="flex flex-col items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex h-6 shrink-0 items-center">
                            <div className="group grid size-5 grid-cols-1">
                              <Controller
                                name="remember"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    checked={!!field.value}
                                    onChange={(e) =>
                                      field.onChange(e.target.checked)
                                    }
                                  />
                                )}
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
                            </div>
                          </div>
                          <label
                            htmlFor="remember-me"
                            className="block font-semibold text-gray-800 dark:text-gray-300"
                          >
                            Remember me
                          </label>
                        </div>

                        {!isSignup && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => switchMode("forgot")}
                              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400"
                            >
                              Forgot password?
                            </button>
                          </div>
                        )}
                      </div>

                      {/* SUBMIT */}
                      <div>
                        <Button
                          type="submit"
                          variant="primary"
                          className="w-full justify-center"
                          disabled={isSubmitting || isRedirecting}
                        >
                          {isRedirecting
                            ? "Redirecting..."
                            : isSubmitting
                              ? "Logging in..."
                              : isSignup
                                ? "Sign up"
                                : "Sign in"}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* MODE TOGGLE */}
                  {!isForgot && !showVerification && (
                    <p className="mt-6 text-center dark:text-gray-300 text-gray-600">
                      {isSignup
                        ? "Already have an account?"
                        : "Need an account?"}{" "}
                      <button
                        onClick={() =>
                          switchMode(isSignup ? "signin" : "signup")
                        }
                        className="text-indigo-600 dark:text-indigo-500 hover:underline"
                      >
                        {isSignup ? "Login here" : "Sign up here"}
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
