"use client"

import { useState } from "react"
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js"
import React from "react"

// --- NEW CODE: paste at the top where elementStyles used to be ---
const lightStyles = {
  base: {
    fontSize: "16px",
    lineHeight: "24px",
    padding: "6px 0",
    color: "#1f2937", // dark text
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    "::placeholder": { color: "#9ca3af" },
  },
  invalid: { color: "#dc2626" },
}

const darkStyles = {
  base: {
    fontSize: "16px",
    lineHeight: "24px",
    padding: "6px 0",
    color: "#e5e7eb", // light gray for dark mode
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    "::placeholder": { color: "#6b7280" },
  },
  invalid: { color: "#fca5a5" },
}

// auto-detect Tailwind's dark mode class on <html>
const elementStyles =
  typeof window !== "undefined" &&
  document.documentElement.classList.contains("dark")
    ? darkStyles
    : lightStyles

function StripeInputWrapper({
  label,
  element,
}: {
  label: string
  element: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="w-full">
      <label className="block font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </label>

      <div
        className={`
          mt-2 relative w-full rounded
          bg-white dark:bg-zinc-950
          px-3.5 py-2.5
         
          ${
            focused
              ? "outline-2 -outline-offset-1 outline-indigo-600 dark:outline-indigo-500"
              : "outline-2 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700"
          }
        `}
      >
        <div className="w-full h-full">
          {/* inject focus handlers */}
          {element &&
            React.cloneElement(element as never, {
              onFocus: () => setFocused(true),
              onBlur: () => setFocused(false),
            })}
        </div>
      </div>
    </div>
  )
}

export default function StripeCardInput() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-6">
      {/* Card Number */}
      <div className="sm:col-span-3">
        <StripeInputWrapper
          label="Card number"
          element={<CardNumberElement options={{ style: elementStyles }} />}
        />
      </div>

      {/* Expiration */}
      <div className="sm:col-span-2">
        <StripeInputWrapper
          label="Expiration date"
          element={<CardExpiryElement options={{ style: elementStyles }} />}
        />
      </div>

      {/* CVC */}
      <div className="sm:col-span-1">
        <StripeInputWrapper
          label="CVC"
          element={<CardCvcElement options={{ style: elementStyles }} />}
        />
      </div>
    </div>
  )
}
