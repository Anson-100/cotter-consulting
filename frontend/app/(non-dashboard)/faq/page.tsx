"use client"

import { useState } from "react"
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid"
import { motion, AnimatePresence } from "framer-motion"
import SceneHeader from "@/components/ui/scene-header"

interface FaqItem {
  id: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    id: "1",
    question: "How do I create my first bid?",
    answer:
      "Sign up, hit 'Create Bid' from your dashboard, add your line items and pricing, and send it as a link. Takes about two minutes.",
  },
  {
    id: "2",
    question: "Is there a free trial?",
    answer:
      "Yep! You get 2 free bid sends after adding a payment method. You won't be charged until you pick a plan.",
  },
  {
    id: "3",
    question: "What does my customer see?",
    answer:
      "They get a clean, professional page with your bid details and three buttons: Accept, Decline, or 'I have questions.' No app download, no account needed on their end.",
  },
  {
    id: "4",
    question: "Can I reuse bids for similar jobs?",
    answer:
      "Absolutely. You can save any bid as a template and pull it up next time so you're not starting from scratch every job.",
  },
]
export default function FaqPage() {
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({})

  const toggleOpen = (id: string): void => {
    setIsOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden min-h-screen py-24 sm:py-32 w-full px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center ">
        {/* HEADER */}
        <SceneHeader
          eyebrow=""
          title={
            <>
              Answers to your most common{" "}
              <span className="text-sky-600 dark:text-sky-500">questions</span>
            </>
          }
          caption=""
          className="text-center"
        />

        <div className="w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 mt-8 sm:mt-16  mx-auto" />

        {/* FAQ ITEMS */}
        <div className="w-full flex flex-col text-base md:text-lg mx-auto">
          {faqItems.map((item) => (
            <div key={item.id} className="flex flex-col">
              <button
                onClick={() => toggleOpen(item.id)}
                className="flex items-center justify-between w-full text-left py-5 sm:py-6 px-2 cursor-pointer"
              >
                <span className="text-gray-800 dark:text-gray-200 font-semibold">
                  {item.question}
                </span>
                {isOpen[item.id] ? (
                  <MinusIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 shrink-0" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {isOpen[item.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <p className="pb-4 px-2 text-gray-600 dark:text-gray-300">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-full h-0.5 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
