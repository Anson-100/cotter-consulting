"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import Button from "./ui/button"

import { PRICE_PLANS } from "@/data/pricePlans"

export default function PriceTiles() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly",
  )

  const getSavingsPercent = (monthly: string, annually: string) => {
    const m = parseInt(monthly.replace("$", "")) * 12
    const a = parseInt(annually.replace("$", ""))
    return Math.round(((m - a) / m) * 100)
  }

  return (
    <section>
      <div className="group/tiers">
        <div className="mx-auto max-w-7xl pt-6">
          {/* TOGGLE: Monthly / Annually */}
          <div className=" flex justify-center pb-8">
            <fieldset aria-label="Payment frequency">
              <div className="relative flex items-center rounded-full bg-white dark:bg-zinc-950 ring-2 ring-zinc-300 dark:ring-zinc-700 ring-inset px-1 py-1 gap-2">
                <motion.div
                  layout
                  transition={{
                    stiffness: 300,
                    damping: 0,
                    duration: 0.2,
                  }}
                  className="absolute rounded-full bg-indigo-600"
                  style={{
                    height: "calc(100% - 8px)",
                    top: "4px",
                    left:
                      billingCycle === "monthly" ? "4px" : "calc(50% + 4px)",
                    width: "calc(50% - 8px)",
                  }}
                />
                <label
                  className={`relative  rounded-full px-4 py-1 font-semibold transition-colors z-10 ${
                    billingCycle === "monthly"
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value="monthly"
                    checked={billingCycle === "monthly"}
                    onChange={() => setBillingCycle("monthly")}
                    className="sr-only"
                  />
                  Monthly
                </label>
                <label
                  className={`relative  rounded-full px-4 py-1 font-semibold transition-colors z-10 ${
                    billingCycle === "annually" ? "text-white" : "text-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value="annually"
                    checked={billingCycle === "annually"}
                    onChange={() => setBillingCycle("annually")}
                    className="sr-only"
                  />
                  Annually
                </label>
              </div>
            </fieldset>
          </div>

          {/* PRICE CARDS */}
          <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-2">
            {PRICE_PLANS.map((tier) => {
              const priceUSD = tier.price[billingCycle]

              return (
                <div
                  key={tier.id}
                  data-featured={tier.featured ? "true" : undefined}
                  className={`
                    group/tier p-6 rounded-xl border-2 bg-white dark:bg-zinc-950
                    shadow-[0_0_20px_rgba(0,0,0,0)] transition-shadow duration-300
                    hover:shadow-[0_0_20px_var(--color-indigo-500)]
                    ${
                      tier.featured
                        ? "border-indigo-600 dark:border-indigo-500"
                        : "border-zinc-200 dark:border-zinc-700"
                    }
                  `}
                >
                  <div className="h-full">
                    <div className="flex items-center justify-between gap-x-4">
                      <h3
                        id={`tier-${tier.id}`}
                        className={`
                          text-2xl/8 font-semibold text-gray-800 dark:text-gray-200
                          group-data-featured/tier:text-indigo-600 dark:group-data-featured/tier:text-indigo-500
                        `}
                      >
                        {tier.name}
                      </h3>
                      {tier.featured && (
                        <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 font-semibold text-indigo-600 dark:text-indigo-500">
                          Most popular
                        </p>
                      )}
                    </div>

                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                      {tier.description}
                    </p>

                    <AnimatePresence mode="wait">
                      <motion.p
                        key={billingCycle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 flex items-baseline gap-x-1"
                      >
                        <span className="text-4xl font-semibold tracking-tight text-gray-800 dark:text-gray-200">
                          {priceUSD}
                        </span>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          {billingCycle === "monthly" ? "/month" : "/year"}
                        </span>
                      </motion.p>
                    </AnimatePresence>

                    {/* Annual savings badge */}
                    {billingCycle === "annually" &&
                      getSavingsPercent(
                        tier.price.monthly,
                        tier.price.annually,
                      ) > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="mt-2 overflow-hidden flex"
                        >
                          <p className="text-green-600">
                            Save{" "}
                            {getSavingsPercent(
                              tier.price.monthly,
                              tier.price.annually,
                            )}
                            % per year
                          </p>
                        </motion.div>
                      )}

                    <Button
                      as="button"
                      type="button"
                      aria-describedby={`tier-${tier.id}`}
                      onClick={() => open("signup")}
                      className="mt-6 block w-full text-center"
                    >
                      Select plan
                    </Button>

                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-gray-600 dark:text-gray-300"
                    >
                      {tier.features.map((f) => (
                        <li key={f.text} className="flex gap-x-3">
                          <f.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
                          {f.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
