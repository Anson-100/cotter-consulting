"use client"

import { motion } from "framer-motion"
import PricePage from "@/components/PriceTiles"
import { SelectedPage } from "@/types"
import SceneHeader from "@/components/ui/scene-header"

type Props = {
  setSelectedPage: (value: SelectedPage) => void
}

export default function PricingSection({ setSelectedPage }: Props) {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <motion.div
        onViewportEnter={() => setSelectedPage(SelectedPage.Pricing)}
        className="mx-auto flex flex-col items-center max-w-7xl px-6 lg:px-8"
      >
        <SceneHeader
          className="text-center mx-auto"
          eyebrow="Pricing"
          title={
            <>
              Choose a{" "}
              <span className="text-sky-600 dark:text-sky-500">plan</span>
            </>
          }
          caption={<>Upgrade or cancel anytime.</>}
        />

        {/* Pricing Cards */}
        <div className="mt-16 group/tiers">
          <PricePage />
          {/* <PriceFeatureComparison /> */}
        </div>
      </motion.div>
    </section>
  )
}
