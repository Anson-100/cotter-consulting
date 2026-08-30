"use client"

import { SelectedPage } from "@/types/index"
import { motion } from "framer-motion"

type Props = {
  setSelectedPage: (value: SelectedPage) => void
}

const placeholders = Array.from({ length: 4 }, (_, i) => `credential ${i + 1}`)

const LogoCloudSection = ({ setSelectedPage }: Props) => {
  return (
    <motion.section
      id="credentials"
      className="relative isolate overflow-hidden bg-zinc-900 py-24"
      onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
      viewport={{ amount: 0.3 }}
    >
      <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-14 bg-gradient-to-r from-zinc-900 via-zinc-900/70 to-transparent sm:w-20" />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-14 bg-gradient-to-l from-zinc-900 via-zinc-900/70 to-transparent sm:w-20" />

          <div className="animate-scroll flex w-max">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="flex items-center space-x-20 px-8 sm:space-x-28 sm:px-12"
              >
                {placeholders.map((label, idx) => (
                  <div
                    key={`${dup}-${idx}`}
                    className="flex h-14 flex-shrink-0 items-center justify-center rounded-md border border-zinc-700 px-8 text-sm font-medium tracking-tight whitespace-nowrap text-zinc-400 sm:h-18 sm:px-10 sm:text-base"
                  >
                    {label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default LogoCloudSection
