/* eslint-disable react-hooks/exhaustive-deps */
"use client"
// /onboarding/page.tsx

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import StepPlan from "./StepPlan"
import StepProfile from "./StepProfile"
import StepBilling from "./StepBilling"
import OnboardingHeader from "@/components/ui/onboarding-header"
import { createClient } from "@/lib/supabase/client"
import { useNavActions } from "../layout"
import OnboardingActions from "../_components/nav/OnboardingActions"

export default function Onboarding() {
  const planValidateRef = useRef<(() => boolean) | null>(null)
  const profileSubmitRef = useRef<(() => Promise<boolean>) | null>(null)
  const billingSubmitRef = useRef<(() => Promise<boolean>) | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const { setActions } = useNavActions()

  useEffect(() => {
    setActions(
      <OnboardingActions
        onNext={async () => {
          // 🔥 run the PriceTiles validator so the red error can toggle
          const okPlan = planValidateRef.current?.() ?? false

          if (!okPlan) {
            document.getElementById("plan")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
            return
          }

          const ok1 = await profileSubmitRef.current?.()
          const ok2 = await billingSubmitRef.current?.()

          await new Promise((r) => setTimeout(r, 20))

          if (!ok1) {
            document
              .getElementById("profile")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
            return
          }

          if (!ok2) {
            document
              .getElementById("billing")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
            return
          }

          router.push("/signup/finalize")
        }}
      />
    )
  }, [setActions])

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()

      if (profile) {
        router.replace("/dashboard")
      }
    }
    check()
  }, [])

  return (
    <main className="flex flex-col w-full overflow-x-hidden gap-48 pb-32 px-6">
      {/* SECTION 1: Plan Selection */}
      <section
        id="plan"
        className="min-h-screen flex-col flex items-center justify-center"
      >
        {/* HEADER================================ */}
        <OnboardingHeader
          stepNumber={1}
          titleText="Choose your"
          titleTextAccent="price plan"
          caption="Compare features to decide the best plan for your business"
        />
        <div className="">
          <StepPlan registerValidate={(fn) => (planValidateRef.current = fn)} />
        </div>
      </section>

      {/* SECTION 2: Profile Setup */}
      <div>
        {/* HEADER=========================S */}
        <OnboardingHeader
          stepNumber={2}
          titleText="Enter your"
          titleTextAccent="profile and billing info"
          caption="Enter your information and then click the button below"
        />
        {/* SIGNUP INFO=========================== */}
        <div className="flex flex-col gap-48">
          <section id="profile" className=" flex items-center justify-center">
            <StepProfile
              registerSubmit={(fn) => (profileSubmitRef.current = fn)}
            />
          </section>

          {/* SECTION 3: Billing Info */}
          <section id="billing" className=" flex items-center justify-center">
            <StepBilling
              registerSubmit={(fn) => (billingSubmitRef.current = fn)}
            />
          </section>
        </div>{" "}
      </div>
    </main>
  )
}
