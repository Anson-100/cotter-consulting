"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid"
import Button from "@/components/ui/button"
import FormInput from "@/components/ui/form-input"
import Skeleton from "@/components/ui/skeleton"
import Toast from "@/components/ui/toast"
import { PASSWORD_RULES, validatePassword } from "@/lib/validations/password"

const UserSettings = () => {
  const supabase = createClient()
  const router = useRouter()
  const [dataLoading, setDataLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  // Personal info state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  // AVATAR STATE ==========================================================
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Original values for change detection
  const [originalFirstName, setOriginalFirstName] = useState("")
  const [originalLastName, setOriginalLastName] = useState("")
  const [originalEmail, setOriginalEmail] = useState("")

  // Password state
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Change detection
  const profileHasChanges =
    firstName !== originalFirstName ||
    lastName !== originalLastName ||
    email !== originalEmail

  const passwordHasChanges =
    newPassword.length > 0 && confirmPassword.length > 0

  useEffect(() => {
    async function loadUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", user.id)
        .single()

      if (profile) {
        setFirstName(profile.first_name || "")
        setLastName(profile.last_name || "")
        setOriginalFirstName(profile.first_name || "")
        setOriginalLastName(profile.last_name || "")
        setAvatarUrl(profile.avatar_url || null)
      }
      setEmail(user.email || "")
      setOriginalEmail(user.email || "")
      setDataLoading(false)
    }
    loadUserData()
  }, [])

  // AVATAR UPLOAD HANDLER =================================================
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setMessage("Please upload a JPG, PNG, GIF, or WebP image")
      setMessageType("error")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be under 5MB")
      setMessageType("error")
      return
    }

    setAvatarUploading(true)
    setMessage(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const fileExt = file.name.split(".").pop()
      const filePath = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          cacheControl: "3600",
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        setMessage("Failed to upload image")
        setMessageType("error")
        return
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id)

      if (updateError) {
        console.error("Profile update error:", updateError)
        setMessage("Image uploaded but failed to save to profile")
        setMessageType("error")
        return
      }

      setAvatarUrl(publicUrl)
      setMessage("Avatar updated!")
      setMessageType("success")
    } catch (err) {
      console.error("Avatar upload error:", err)
      setMessage("Failed to upload avatar")
      setMessageType("error")
    } finally {
      setAvatarUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const res = await fetch("/api/user/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      setMessage("Profile updated successfully!")
      setMessageType("success")
      setOriginalFirstName(firstName)
      setOriginalLastName(lastName)
      setOriginalEmail(email)
    } else {
      setMessage(data.error || "Failed to update profile")
      setMessageType("error")
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    const result = validatePassword(newPassword)
    if (result !== true) {
      setPasswordError(result)
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    setLoading(true)
    setMessage(null)

    const res = await fetch("/api/user/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword, confirmPassword }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      setMessage("Password updated successfully!")
      setMessageType("success")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordError("")
    } else {
      setMessage(data.error || "Failed to update password")
      setMessageType("error")
    }
  }

  return (
    <div>
      {/* TOAST — FIXED POSITION, NO LAYOUT SHIFT ========================= */}
      {message && (
        <Toast
          message={message}
          type={messageType}
          onDismiss={() => setMessage(null)}
        />
      )}

      <div className="divide-y-2 divide-zinc-200 dark:divide-zinc-800">
        {/* PERSONAL INFO============================================== */}
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10  py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-800 dark:text-gray-200">
              Personal information
            </h2>
            <p className="mt-1  text-gray-600 dark:text-gray-300">
              This is the place to change your username or whatever else
            </p>
          </div>

          {dataLoading ? (
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full flex items-center gap-x-8">
                  <Skeleton className="size-28 rounded-lg" />
                  <div>
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-24 mt-2" />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="sm:col-span-3">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="col-span-full">
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
              <div className="mt-8">
                <Skeleton className="h-11 w-20" />
              </div>
            </div>
          ) : (
            <form className="md:col-span-2" onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                {/* AVATAR UPLOAD ========================================== */}
                <div className="col-span-full flex items-center gap-x-8">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />

                  {avatarUrl ? (
                    <Image
                      alt="Profile avatar"
                      src={avatarUrl}
                      className="size-28 flex-none rounded-lg bg-gray-800 object-cover"
                      height={260}
                      width={260}
                    />
                  ) : (
                    <div className="size-28 flex-none rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                      <span className="text-3xl font-bold text-zinc-400 dark:text-zinc-600">
                        {firstName?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}

                  <div>
                    <Button
                      variant="secondary"
                      type="button"
                      disabled={avatarUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {avatarUploading
                        ? "Uploading..."
                        : avatarUrl
                          ? "Change avatar"
                          : "Add avatar"}
                    </Button>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <FormInput
                    id="first-name"
                    label="First name"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormInput
                    id="last-name"
                    label="Last name"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="col-span-full">
                  <FormInput
                    id="email"
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 flex">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!profileHasChanges || loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* CHANGE PASSWORD====================================== */}
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10  py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-800 dark:text-gray-200">
              Change your password
            </h2>
            <p className="mt-1  text-gray-600 dark:text-gray-300">
              Pick a new password if the old one isn't working for you
            </p>
          </div>

          {dataLoading ? (
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="col-span-full">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
              <div className="mt-8">
                <Skeleton className="h-11 w-20" />
              </div>
            </div>
          ) : (
            <form className="md:col-span-2" onSubmit={handleUpdatePassword}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <FormInput
                    id="new-password"
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="col-span-full">
                  <FormInput
                    id="confirm-password"
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {newPassword.length > 0 && (
                  <div className="col-span-full">
                    <ul className="space-y-1 text-sm">
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(newPassword)
                        return (
                          <li
                            key={rule.key}
                            className="flex items-center gap-2"
                          >
                            {passed ? (
                              <CheckIcon className="size-4 text-emerald-500 shrink-0" />
                            ) : (
                              <XMarkIcon className="size-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
                            )}
                            <span
                              className={
                                passed
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-zinc-500 dark:text-zinc-400"
                              }
                            >
                              {rule.label}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                {passwordError && (
                  <div className="col-span-full">
                    <p className="text-sm text-red-600">{passwordError}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!passwordHasChanges || loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* NOTIFICATION SETTINGS===================================== */}
        <div className=" space-y-10 sm:px-6 py-16 sm:space-y-0   ">
          <fieldset>
            <legend className="sr-only">By email</legend>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:pb-6">
              <div
                aria-hidden="true"
                className="font-semibold text-gray-800 dark:text-gray-200"
              >
                By email
              </div>
              <div className="mt-4 sm:col-span-2 sm:mt-0">
                <div className="max-w-lg space-y-6">
                  <div className="flex gap-3">
                    <div className="flex h-6 shrink-0 items-center">
                      <div className="group grid size-5 grid-cols-1">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          aria-describedby="candidates-description"
                          className="col-start-1 row-start-1 appearance-none rounded-sm border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        />
                        <svg
                          fill="none"
                          viewBox="0 0 14 14"
                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100"
                          />
                          <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="">
                      <label
                        htmlFor="comments"
                        className="font-medium text-gray-800 dark:text-gray-200"
                      >
                        Bids
                      </label>
                      <p
                        id="comments-description"
                        className="text-gray-600 dark:text-gray-300"
                      >
                        Get notified when a client accepts or declines
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 shrink-0 items-center">
                      <div className="group grid size-5 grid-cols-1">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          aria-describedby="candidates-description"
                          className="col-start-1 row-start-1 appearance-none rounded-sm border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        />
                        <svg
                          fill="none"
                          viewBox="0 0 14 14"
                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100"
                          />
                          <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="">
                      <label
                        htmlFor="comments"
                        className="font-medium text-gray-800 dark:text-gray-200"
                      >
                        Tasks
                      </label>
                      <p
                        id="comments-description"
                        className="text-gray-600 dark:text-gray-300"
                      >
                        Get notified when a task is completed
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 shrink-0 items-center">
                      <div className="group grid size-5 grid-cols-1">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          aria-describedby="candidates-description"
                          className="col-start-1 row-start-1 appearance-none rounded-sm border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        />
                        <svg
                          fill="none"
                          viewBox="0 0 14 14"
                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100"
                          />
                          <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="">
                      <label
                        htmlFor="comments"
                        className="font-medium text-gray-800 dark:text-gray-200"
                      >
                        Questions
                      </label>
                      <p
                        id="comments-description"
                        className="text-gray-600 dark:text-gray-300"
                      >
                        Get notified when a client submits a question
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend className="sr-only">Push notifications</legend>
            <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 sm:pt-6">
              <div
                aria-hidden="true"
                className=" font-semibold text-gray-800 dark:text-gray-200"
              >
                Push notifications
              </div>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div className="max-w-lg">
                  <p className=" text-gray-600 dark:text-gray-300">
                    These are delivered via SMS to your mobile phone.
                  </p>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center gap-x-3">
                      <input
                        defaultChecked
                        id="push-everything"
                        name="push-notifications"
                        type="radio"
                        className="relative size-5 appearance-none rounded-full border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 before:absolute before:inset-1 before:rounded-full before:bg-white dark:before:bg-zinc-950 not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                      />
                      <label
                        htmlFor="push-everything"
                        className=" font-medium text-gray-800 dark:text-gray-200"
                      >
                        Everything
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-email"
                        name="push-notifications"
                        type="radio"
                        className="relative size-5 appearance-none rounded-full border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 before:absolute before:inset-1 before:rounded-full before:bg-white dark:before:bg-zinc-950 not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                      />
                      <label
                        htmlFor="push-email"
                        className=" font-medium text-gray-800 dark:text-gray-200"
                      >
                        Same as email
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-nothing"
                        name="push-notifications"
                        type="radio"
                        className="relative size-5 appearance-none rounded-full border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 before:absolute before:inset-1 before:rounded-full before:bg-white dark:before:bg-zinc-950 not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                      />
                      <label
                        htmlFor="push-nothing"
                        className=" font-medium text-gray-800 dark:text-gray-200"
                      >
                        No push notifications
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex ">
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </fieldset>{" "}
        </div>
      </div>
    </div>
  )
}

export default UserSettings
