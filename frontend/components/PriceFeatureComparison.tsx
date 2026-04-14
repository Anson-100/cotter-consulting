"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDownIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { PRICE_PLANS, PRICE_FEATURES } from "@/data/pricePlans";

export default function PriceFeatureComparison() {
  const [showComparison, setShowComparison] = useState(false);
  return (
    <div>
      {" "}
      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => setShowComparison(!showComparison)}
          className="text-lg flex items-center gap-2 text-indigo-600 dark:text-indigo-500 font-medium"
        >
          <span>
            {showComparison
              ? "Hide feature comparison"
              : "See feature comparison"}
          </span>
          <motion.span
            animate={{ rotate: showComparison ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="size-5" />
          </motion.span>
        </button>
      </div>
      {/* FEATURE COMPARISON SECTION (collapsible) */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="mx-auto max-w-7xl pt-12">
              {/* Mobile */}
              <section
                aria-labelledby="mobile-comparison-heading"
                className="lg:hidden"
              >
                <h2 id="mobile-comparison-heading" className="sr-only">
                  Feature comparison
                </h2>

                <div className="mx-auto max-w-2xl space-y-16">
                  {PRICE_PLANS.map((tier) => (
                    <div
                      key={tier.id}
                      className="border-t-2 border-zinc-200 dark:border-zinc-700"
                    >
                      <div
                        className={`
                              ${
                                tier.featured
                                  ? "border-indigo-600 dark:border-indigo-500"
                                  : "border-transparent"
                              }
                              -mt-px w-72 border-t-2 pt-10 md:w-80
                            `}
                      >
                        <h3
                          className={`
                                ${
                                  tier.featured
                                    ? "text-indigo-600"
                                    : "text-gray-800 dark:text-gray-200"
                                }
                                text-2xl font-semibold
                              `}
                        >
                          {tier.name}
                        </h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {tier.description}
                        </p>
                      </div>

                      <div className="mt-10 space-y-10">
                        {PRICE_FEATURES.map((section) => (
                          <div key={section.name}>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                              {section.name}
                            </h4>
                            <div className="relative mt-6">
                              <div
                                aria-hidden="true"
                                className="absolute inset-y-0 right-0 hidden w-1/2 rounded-lg bg-white dark:bg-zinc-950 shadow-xs sm:block"
                              />
                              <div
                                className={`
                                      ${
                                        tier.featured
                                          ? "ring-2 ring-indigo-600 dark:ring-indigo-500"
                                          : "ring-1 ring-gray-900/10"
                                      }
                                      relative rounded-lg bg-white dark:bg-zinc-950 shadow-xs
                                      sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0
                                    `}
                              >
                                <dl className="divide-y-2 divide-zinc-200 dark:divide-zinc-800">
                                  {section.features.map((feature) => (
                                    <div
                                      key={feature.name}
                                      className="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
                                    >
                                      <dt className="pr-4 text-gray-600 dark:text-gray-300">
                                        {feature.name}
                                      </dt>
                                      <dd className="flex items-center justify-end sm:justify-center sm:px-4">
                                        {typeof feature.tiers[
                                          tier.name as keyof typeof feature.tiers
                                        ] === "string" ? (
                                          <span
                                            className={
                                              tier.featured
                                                ? "font-semibold text-indigo-600 dark:text-indigo-500"
                                                : "text-gray-800 dark:text-gray-200"
                                            }
                                          >
                                            {
                                              feature.tiers[
                                                tier.name as keyof typeof feature.tiers
                                              ] as string
                                            }
                                          </span>
                                        ) : (
                                          <>
                                            {feature.tiers[
                                              tier.name as keyof typeof feature.tiers
                                            ] ? (
                                              <CheckCircleIcon
                                                aria-hidden="true"
                                                className="mx-auto size-6 text-indigo-600 dark:text-indigo-500"
                                              />
                                            ) : (
                                              <XMarkIcon
                                                aria-hidden="true"
                                                className="mx-auto size-6 text-gray-400"
                                              />
                                            )}
                                            <span className="sr-only">
                                              {feature.tiers[
                                                tier.name as keyof typeof feature.tiers
                                              ]
                                                ? "Yes"
                                                : "No"}
                                            </span>
                                          </>
                                        )}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Desktop */}
              <section
                aria-labelledby="comparison-heading"
                className="hidden lg:block"
              >
                <h2 id="comparison-heading" className="sr-only">
                  Feature comparison
                </h2>

                <div className="grid grid-cols-4 gap-x-8 border-t-2 border-zinc-200 dark:border-zinc-800 before:block">
                  {PRICE_PLANS.map((tier) => (
                    <div key={tier.id} aria-hidden="true" className="-mt-px">
                      <div
                        className={`
                              ${
                                tier.featured
                                  ? "border-indigo-600 dark:border-indigo-500"
                                  : "border-transparent"
                              }
                              border-t-2 pt-10
                            `}
                      >
                        <p
                          className={`
                                ${
                                  tier.featured
                                    ? "text-indigo-600 dark:text-indigo-500"
                                    : "text-gray-800 dark:text-gray-200"
                                }
                                font-semibold text-2xl
                              `}
                        >
                          {tier.name}
                        </p>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {tier.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="-mt-6 space-y-16">
                  {PRICE_FEATURES.map((section) => (
                    <div key={section.name}>
                      <h3 className="font-semibold text-xl dark:text-gray-200 text-gray-800">
                        {section.name}
                      </h3>
                      <div className="relative -mx-8 mt-10">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                        >
                          <div className="size-full rounded-lg bg-white dark:bg-zinc-950 shadow-xs" />
                          <div className="size-full rounded-lg bg-white dark:bg-zinc-950 shadow-xs" />
                          <div className="size-full rounded-lg bg-white dark:bg-zinc-950 shadow-xs" />
                        </div>

                        <table className="relative w-full border-separate border-spacing-x-8">
                          <thead>
                            <tr className="text-left">
                              <th scope="col">
                                <span className="sr-only">Feature</span>
                              </th>
                              {PRICE_PLANS.map((tier) => (
                                <th key={tier.id} scope="col">
                                  <span className="sr-only">
                                    {tier.name} tier
                                  </span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.features.map((feature, featureIdx) => (
                              <tr key={feature.name}>
                                <th
                                  scope="row"
                                  className="w-1/4 py-3 pr-4 text-left font-normal text-gray-700 dark:text-gray-300"
                                >
                                  {feature.name}
                                  {featureIdx !==
                                    section.features.length - 1 && (
                                    <div className="absolute inset-x-8 mt-3 h-0.5 bg-zinc-200 dark:bg-zinc-800" />
                                  )}
                                </th>
                                {PRICE_PLANS.map((tier) => (
                                  <td
                                    key={tier.id}
                                    className="relative w-1/4 px-4 py-0 text-center"
                                  >
                                    <span className="relative size-full py-3">
                                      {typeof feature.tiers[
                                        tier.name as keyof typeof feature.tiers
                                      ] === "string" ? (
                                        <span
                                          className={
                                            tier.featured
                                              ? "font-semibold text-indigo-600 dark:text-indigo-500"
                                              : "text-gray-800 dark:text-gray-200"
                                          }
                                        >
                                          {
                                            feature.tiers[
                                              tier.name as keyof typeof feature.tiers
                                            ] as string
                                          }
                                        </span>
                                      ) : (
                                        <>
                                          {feature.tiers[
                                            tier.name as keyof typeof feature.tiers
                                          ] ? (
                                            <CheckCircleIcon
                                              aria-hidden="true"
                                              className="mx-auto size-6 text-indigo-600 dark:text-indigo-500"
                                            />
                                          ) : (
                                            <XMarkIcon
                                              aria-hidden="true"
                                              className="mx-auto size-6 text-gray-400"
                                            />
                                          )}
                                          <span className="sr-only">
                                            {feature.tiers[
                                              tier.name as keyof typeof feature.tiers
                                            ]
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </>
                                      )}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                        >
                          {PRICE_PLANS.map((tier) => (
                            <div
                              key={tier.id}
                              className={`
                                    ${
                                      tier.featured
                                        ? "ring-2 ring-indigo-600 dark:ring-indigo-500"
                                        : "ring-2 ring-zinc-200 dark:ring-zinc-700"
                                    }
                                    rounded-lg
                                  `}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
