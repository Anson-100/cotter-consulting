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
    <section id="home" className="relative isolate h-screen">
      <motion.div
        className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8"
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
        viewport={{ amount: 0.1 }}
      >
        <div className="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-40 lg:pb-48 xl:col-span-6">
          <div className="mx-auto max-w-lg lg:mx-0">
            <div className="hidden sm:mt-32 sm:flex lg:mt-16">
              {/* <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-gray-100/10 dark:hover:ring-gray-100/20">
                Certified legal nurse consulting.{" "}
                <a
                  href="#services"
                  className="font-semibold whitespace-nowrap text-indigo-600 dark:text-indigo-400"
                >
                  <span aria-hidden="true" className="absolute inset-0" />
                  Learn more <span aria-hidden="true">&rarr;</span>
                </a>
              </div> */}
            </div>

            <h1 className="mt-24 text-5xl tracking-tight text-pretty text-gray-900 font-serif dark:text-gray-100 sm:mt-10 sm:text-7xl">
              Clinical clarity.{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Case confidence.
              </span>
            </h1>

            <p className="mt-8 text-lg font-medium text-pretty text-gray-600 dark:text-gray-400 sm:text-xl/8 font-serif">
              Clinical expertise that turns thousands of pages into the facts
              your argument rests on.
            </p>

            <div className="mt-10 flex flex-col items-center gap-y-4 sm:flex-row sm:gap-x-4">
              <Button
                variant="primary"
                className="flex w-full items-center text-lg sm:w-56"
                onClick={() => openAuthModal("signup")}
              >
                Schedule
                <ArrowLongRightIcon className="ml-1 size-6" />
              </Button>
              <Button
                variant="secondary"
                className="flex w-full items-center text-lg sm:w-auto"
                onClick={() => {
                  // TODO: Link to sample case chronology
                }}
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>

        <div
          className="relative bg-gray-50 grayscale bg-cover bg-center lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1706799191377-96a80beaee24?q=80&w=2577&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="aspect-3/2 w-full lg:aspect-auto lg:h-full" />
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
