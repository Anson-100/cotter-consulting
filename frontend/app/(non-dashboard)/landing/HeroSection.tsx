"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import Button from "@/components/ui/button"
import { ArrowLongRightIcon } from "@heroicons/react/24/solid"
import { useAuthModal } from "@/hooks/useAuthModal"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1706799191377-96a80beaee24?q=80&w=2577&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const BLOB_CLIP =
  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"

const HeroSection = () => {
  const { openAuthModal } = useAuthModal()
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="home"
      className="relative isolate min-h-screen scroll-mt-[70px] overflow-hidden"
    >
      {/* Background image */}
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover grayscale"
      />

      {/* Indigo overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-indigo-950/90 via-indigo-900/80 to-indigo-950/95"
      />

      {/* Top blob */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{ clipPath: BLOB_CLIP }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-indigo-400 to-sky-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl py-32 text-center sm:py-48 lg:py-56"
        >
          <h1 className="font-serif text-5xl tracking-tight text-balance text-white sm:text-7xl">
            Clinical clarity.{" "}
            <span className="text-indigo-300">Case confidence.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg font-medium text-balance text-indigo-100/90 sm:text-xl/8">
            Clinical expertise that turns thousands of pages of medical records
            into the clear, sourced facts your argument rests on.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:gap-x-6">
            <Button
              variant="primary"
              className="flex w-full items-center justify-center text-lg sm:w-56"
              onClick={() => openAuthModal("signup")}
            >
              Schedule
            </Button>
            <button
              type="button"
              className="rounded-md px-3 py-2 text-lg font-semibold text-white hover:text-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={() => {
                // TODO: Link to sample case chronology
              }}
            >
              Learn more <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom blob */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{ clipPath: BLOB_CLIP }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-indigo-400 to-sky-300 opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>
    </section>
  )
}

export default HeroSection
