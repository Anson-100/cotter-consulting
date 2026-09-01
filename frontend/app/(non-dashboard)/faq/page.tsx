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
    question: "What does a legal nurse consultant do?",
    answer:
      "We review medical records and translate them into something you can use: a dated chronology, an analysis of whether the care met accepted standards, and the clinical questions worth raising. This is consulting support for your case strategy, not expert testimony.",
  },
  {
    id: "2",
    question: "How is this different from hiring a medical expert witness?",
    answer:
      "An expert witness testifies to opinions in your case. We work as consultants, organizing the record, screening for merit, and helping you identify which specialty of expert you actually need before you spend money on one.",
  },
  {
    id: "3",
    question: "How long does a record review take?",
    answer:
      "It depends on volume and complexity. A focused merit screening on a few hundred pages moves quickly. A full chronology on several thousand takes longer. We provide a turnaround estimate before starting.",
  },
  {
    id: "4",
    question: "How do you handle confidential records?",
    answer:
      "Records are transferred and stored securely, handled in compliance with HIPAA, and never shared outside the engagement.",
  },
  {
    id: "5",
    question: "Do you work with plaintiff or defense firms?",
    answer:
      "Both. The analysis is the same either way: what the record actually documents.",
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
              <span className="text-indigo-600 dark:text-indigo-500">
                questions
              </span>
            </>
          }
          caption=""
          className="text-center"
        />

        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mt-8 sm:mt-16  mx-auto" />

        {/* FAQ ITEMS */}
        <div className="w-full flex flex-col text-base md:text-lg mx-auto font-serif">
          {faqItems.map((item) => (
            <div key={item.id} className="flex flex-col">
              <button
                onClick={() => toggleOpen(item.id)}
                className="flex items-center justify-between w-full text-left py-5 sm:py-6 px-2 cursor-pointer"
              >
                <span className="text-gray-800 dark:text-gray-200 ">
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
              <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
