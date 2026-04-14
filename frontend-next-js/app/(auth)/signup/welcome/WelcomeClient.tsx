"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLongRightIcon } from "@heroicons/react/20/solid"
import LogoLink from "@/components/ui/logo-link-nav"
import Button from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { useDarkModeStore } from "@/lib/useDarkModeStore"

export default function Welcome() {
  const router = useRouter()
  const supabase = createClient()

  const isDark = useDarkModeStore((state) => state.isDark)

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/")
        return
      }

      // check profiles table to see if onboarding completed
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (profile) {
        router.replace("/dashboard")
      }
    }
    check()
  }, [])

  return (
    <div className="relative h-screen isolate overflow-hidden ">
      {/* Background blob layers */}
      <div
        aria-hidden="true"
        className="absolute top-10 right-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:right-[calc(50%-18rem)] lg:bottom-[calc(50%-30rem)] lg:right-48 xl:right-[calc(50%-24rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(23.6% 31.7%, 91.7% 1.8%, 100% 46.4%, 27.4% 82.2%, 22.5% 84.9%, 95.7% 64%, 55.3% 37.5%, 46.5% 89.4%, 45% 62.9%, 80.3% 87.2%, 11.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 91.7%)",
          }}
          className="aspect-1108/632 w-277 bg-white opacity-100 dark:opacity-20 dark:bg-linear-to-r dark:from-[#a1a1aa] dark:to-[#27272a]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:right-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:right-48 xl:right-[calc(50%-24rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(50% 0%, 61% 12%, 79% 21%, 88% 39%, 93% 61%, 88% 82%, 79% 91%, 61% 96%, 50% 100%, 39% 96%, 21% 91%, 12% 82%, 7% 61%, 12% 39%, 21% 21%, 39% 12%)",
          }}
          className="aspect-1108/200 w-277 bg-white opacity-100 dark:opacity-20 dark:bg-linear-to-r dark:from-[#a1a1aa] dark:to-[#27272a]"
        />
      </div>

      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-256 w-full stroke-zinc-300 dark:stroke-zinc-800 mask-[radial-gradient(32rem_32rem_at_center,white,transparent)]"
      >
        <defs>
          <pattern
            id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
            x="50%"
            y={-1}
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg
          x="50%"
          y={-1}
          className="overflow-visible fill-zinc-100 dark:fill-zinc-950"
        >
          <rect x={-100} y={-100} width={400} height={400} rx={20} />
          <rect x={500} y={0} width={400} height={400} rx={20} />
          <rect x={-500} y={500} width={400} height={400} rx={20} />
          <rect x={100} y={700} width={400} height={400} rx={20} />
        </svg>
        <rect
          fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>

      {/* ACTUAL UI===================================== */}
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8">
          <LogoLink />
          <h1 className="text-6xl mt-4 font-semibold tracking-tight text-pretty text-gray-900 dark:text-gray-100 sm:text-7xl">
            Welcome aboard!
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-700 dark:text-gray-300 sm:text-xl/8">
            Get started with one free estimate (no credit card required) or
            unlock full access by choosing the perfect plan for your business.
          </p>
          <div className="mt-16 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {/* 🚀 Added routing here */}
              <Button
                variant="primary"
                className=""
                onClick={() => router.push("/dashboard")}
              >
                Try for free <ArrowLongRightIcon className="size-6 ml-1" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={() => router.push("/signup/onboarding")}
              >
                Get full access <ArrowLongRightIcon className="size-6 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              alt="App screenshot"
              src={
                isDark
                  ? "/images/dashboard-dark.png"
                  : "/images/dashboard-light.png"
              }
              width={2432}
              height={1442}
              className="w-304 rounded-2xl bg-gray-50 shadow-xl ring-1 ring-zinc-900/10 dark:ring-zinc-700"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
