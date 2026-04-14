"use client"

import { CheckIcon } from "@heroicons/react/24/solid"
import { AnimatePresence, motion } from "framer-motion"

type Feature = {
  readonly icon: React.ComponentType<{ className?: string }>
  readonly text: string
}

type PriceTileOnboardingProps = {
  id: string
  name: string
  description: string
  featured?: boolean
  price?: {
    readonly monthly: string
    readonly annually: string
  }
  features: readonly Feature[]
  billingCycle?: "monthly" | "annually"
  isSelected: boolean
  onSelect: () => void
}

export default function PriceTileOnboarding({
  name,
  description,
  featured = false,
  price,
  features,
  billingCycle = "monthly",
  isSelected,
  onSelect,
}: PriceTileOnboardingProps) {
  const isDeferred = !price

  const getSavingsPercent = (monthly: string, annually: string) => {
    const m = parseInt(monthly.replace("$", "")) * 12
    const a = parseInt(annually.replace("$", ""))
    return Math.round(((m - a) / m) * 100)
  }

  return (
    <div
      onClick={onSelect}
      data-featured={featured ? "true" : undefined}
      className={`
        relative group/tier rounded-xl p-6 border-2 cursor-pointer
        shadow-[0_0_20px_rgba(0,0,0,0)] transition-shadow duration-300
        hover:shadow-[0_0_20px_var(--color-indigo-500)]
        ${
          featured
            ? "border-indigo-600 dark:border-indigo-500"
            : "border-zinc-200 dark:border-zinc-700"
        }
        ${
          isSelected
            ? "shadow-[0_0_20px_var(--color-indigo-500)] bg-sky-100 dark:bg-sky-950/40"
            : "bg-white dark:bg-zinc-950"
        }
      `}
    >
      {isSelected && (
        <div className="absolute bottom-4 right-4 rounded-full ring-indigo-600/80 dark:ring-indigo-500/80 ring-2 bg-indigo-500/20 w-12 h-12 flex items-center justify-center">
          <CheckIcon className="size-8 text-indigo-600 dark:text-indigo-500" />
        </div>
      )}

      <div className="h-full">
        <div className="flex items-center justify-between gap-x-4">
          <h3
            className={`
              text-2xl/8 font-semibold text-gray-800 dark:text-gray-200
              ${featured ? "text-indigo-600 dark:text-indigo-500" : ""}
            `}
          >
            {name}
          </h3>
          {featured && (
            <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 font-semibold text-indigo-600 dark:text-indigo-500">
              Most popular
            </p>
          )}
        </div>

        <p className="mt-4 text-gray-600 dark:text-gray-300">{description}</p>

        {/* Price display */}
        {isDeferred ? (
          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="text-4xl font-semibold tracking-tight text-indigo-600 dark:text-indigo-500">
              $0
            </span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              to start
            </span>
          </p>
        ) : (
          <>
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
                  {price[billingCycle]}
                </span>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {billingCycle === "monthly" ? "/month" : "/year"}
                </span>
              </motion.p>
            </AnimatePresence>

            {billingCycle === "annually" &&
              getSavingsPercent(price.monthly, price.annually) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="mt-2 overflow-hidden flex"
                >
                  <p className="text-green-600">
                    Save {getSavingsPercent(price.monthly, price.annually)}% per
                    year
                  </p>
                </motion.div>
              )}
          </>
        )}

        <ul
          role="list"
          className="mt-8 space-y-3 text-gray-600 dark:text-gray-300"
        >
          {features.map((f) => (
            <li key={f.text} className="flex gap-x-3">
              <f.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
              {f.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
