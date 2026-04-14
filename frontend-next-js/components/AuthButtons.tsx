// components/AuthButtons.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/useAuthStore"
import { useAuthModal } from "@/hooks/useAuthModal"
import Button from "./ui/button"
import {
  ArrowLeftStartOnRectangleIcon,
  HomeIcon,
  UserCircleIcon,
  UserPlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"

type Props = {
  variant?: "desktop" | "mobile"
}

export default function AuthButtons({ variant = "desktop" }: Props) {
  const { user, hasProfile, loading, initialized, initialize, logout } =
    useAuthStore()
  const { openAuthModal } = useAuthModal()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // ── Loading skeleton ──────────────────────────────────────────────
  if (!initialized || loading) {
    return variant === "desktop" ? (
      <div className="flex gap-2">
        {/* Secondary button skeleton — hidden on mobile since we hide that button */}
        <div className="hidden sm:block w-24 h-10 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="w-20 h-10 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
    ) : null
  }

  // ── Shared values for logged-in state ─────────────────────────────
  const destination =
    user && hasProfile === false ? "/signup/onboarding" : "/dashboard"
  const buttonText = user && hasProfile === false ? "Resume" : "Dashboard"
  const ButtonIcon = user && hasProfile === false ? ArrowPathIcon : HomeIcon

  // ══════════════════════════════════════════════════════════════════
  // LOGGED IN
  // ══════════════════════════════════════════════════════════════════
  if (user) {
    return variant === "desktop" ? (
      // ── Desktop nav: Logout + Dashboard ───────────────────────────
      // Logout hidden below sm — lives in burger menu on mobile instead
      <>
        <Button
          as="button"
          variant="secondary"
          onClick={handleLogout}
          className="hidden sm:inline-flex"
        >
          Logout
        </Button>
        <Button
          as="button"
          variant="primary"
          onClick={() => router.push(destination)}
        >
          {buttonText}
        </Button>
      </>
    ) : (
      // ── Burger menu: Dashboard + Logout ───────────────────────────
      // Logout only shows below sm (above sm it's back in the nav bar)
      <div className="w-full mb-4">
        {/* <button
          onClick={() => router.push(destination)}
          className="hover:cursor-pointer font-semibold mt-2 py-2 w-full px-4 mx-auto flex items-center text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-500 dark:text-gray-300 bg-zinc-100 dark:bg-zinc-900 rounded-md"
        >
          <ButtonIcon className="size-6 mr-4" />
          <p>
            {buttonText} <span className="text-lg">→</span>
          </p>
        </button> */}
        <button
          onClick={handleLogout}
          className="hover:cursor-pointer font-semibold mt-2 py-2 w-full px-4 mx-auto flex items-center text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-500 dark:text-gray-300 bg-zinc-100 dark:bg-zinc-900 rounded-md"
        >
          <ArrowLeftStartOnRectangleIcon className="size-6 mr-4" />
          <p>Logout</p>
        </button>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // NOT LOGGED IN
  // ══════════════════════════════════════════════════════════════════
  return variant === "desktop" ? (
    // ── Desktop nav: Log in + Sign up ─────────────────────────────
    // Log in hidden below sm — lives in burger menu on mobile instead
    <>
      <Button
        as="button"
        variant="secondary"
        onClick={() => openAuthModal("signin")}
        className="hidden sm:inline-flex"
      >
        Log in
      </Button>
      <Button
        as="button"
        variant="primary"
        onClick={() => openAuthModal("signup")}
      >
        Sign up
      </Button>
    </>
  ) : (
    // ── Burger menu: Sign in + Sign up ──────────────────────────
    // Sign in only shows below sm (above sm it's back in the nav bar)
    <div className="w-full mb-4">
      <button
        onClick={() => openAuthModal("signin")}
        className="sm:hidden hover:cursor-pointer font-semibold mt-2 py-2 w-full px-4 mx-auto flex items-center text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-500 dark:text-gray-300 bg-zinc-100 dark:bg-zinc-900 rounded-md"
      >
        <UserCircleIcon className="size-6 mr-4" />
        <p>
          Sign in <span className="text-lg">→</span>
        </p>
      </button>
      {/* <button
        onClick={() => openAuthModal("signup")}
        className="sm:hidden hover:cursor-pointer font-semibold mt-2 py-2 w-full px-4 mx-auto flex items-center text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-500 dark:text-gray-300 bg-zinc-100 dark:bg-zinc-900 rounded-md ring-2 ring-indigo-600 dark:ring-indigo-500"
      >
        <UserPlusIcon className="size-6 mr-4" />
        <p>
          Sign up <span className="text-lg">→</span>
        </p>
      </button> */}
    </div>
  )
}
