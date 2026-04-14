"use client"

import { SelectedPage } from "@/types/index"
import { motion } from "framer-motion"
import Button from "@/components/ui/button"
import { ArrowLongRightIcon } from "@heroicons/react/24/solid"
import { useAuthModal } from "@/hooks/useAuthModal"

type Props = {
  setSelectedPage: (value: SelectedPage) => void
}

const HeroSection = ({ setSelectedPage }: Props) => {
  const { openAuthModal } = useAuthModal()

  return (
    <section id="home" className="relative isolate ">
      <motion.div
        className="mx-auto max-w-4xl px-6 py-32 sm:py-48 lg:py-56"
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
        viewport={{ amount: 0.1 }}
      >
        <div className="text-center">
          <h1 className="text-6xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-gray-100 sm:text-8xl">
            Win more{" "}
            <span className="text-indigo-600 dark:text-indigo-500">jobs</span>
          </h1>
          <p className="mt-8 text-xl font-medium text-pretty text-gray-600 dark:text-gray-300 sm:text-3xl/10">
            Send professional, trackable bids as shareable links and make it
            easier for customers to say{" "}
            <em className="not-italic font-medium">yes</em>
          </p>
          <div className="mt-12 flex-col sm:flex-row gap-y-4 flex items-center justify-center sm:gap-x-4">
            <Button
              variant="primary"
              className=" w-full sm:w-44 flex items-center text-lg"
              onClick={() => openAuthModal("signup")}
            >
              Try for free <ArrowLongRightIcon className="size-6 ml-1" />
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-auto flex items-center text-lg"
              onClick={() => {
                // TODO: Link to sample bid
              }}
            >
              See a sample bid
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
