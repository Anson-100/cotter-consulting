"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Button from "@/components/ui/button"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1706799191377-96a80beaee24?q=80&w=2577&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const BLOB_CLIP =
  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"

const CYBERSPACE = "#44484D"
const GOLD = "#C49832"

const CYBERSPACE_HUE = "#243F5B"

const DEPTH =
  "linear-gradient(to bottom, rgba(25,30,38,0.85) 0%, rgba(30,35,43,0.75) 48%, rgba(18,23,30,0.95) 100%)"

const TEXT_SCRIM =
  "radial-gradient(ellipse 58% 50% at 50% 46%, rgba(20,25,32,0.62) 0%, rgba(20,25,32,0.38) 48%, rgba(20,25,32,0) 78%)"

const GOLD_WISP = `linear-gradient(to top right, ${GOLD}, #7E6A43)`

const HeroSection = () => {
  const reduceMotion = useReducedMotion()

  // Full height only at rest — locks to the small viewport once scrolling
  // starts, so the address bar showing/hiding can't resize the hero mid-scroll
  const [atTop, setAtTop] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY < 10
      setAtTop((prev) => (prev === next ? prev : next))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)

    if (!section) return

    section.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "start",
    })
  }

  return (
    <section
      id="home"
      className={`scroll-mt-[70px] pb-2 px-4 pt-20 transition-[height] duration-200 ${
        atTop ? "h-dvh" : "h-svh"
      }`}
    >
      <div
        className="relative isolate h-full overflow-hidden rounded-3xl"
        style={{ backgroundColor: CYBERSPACE }}
      >
        {/* Background image */}
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-50 object-cover grayscale brightness-[0.78] contrast-[1.2]"
        />

        {/* Colorize: photo luminance + cyberspace hue */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-40 mix-blend-color"
          style={{ backgroundColor: CYBERSPACE_HUE }}
        />

        {/* Depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 mix-blend-multiply"
          style={{ backgroundImage: DEPTH }}
        />

        {/* Top wisp */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-20 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{ clipPath: BLOB_CLIP, backgroundImage: GOLD_WISP }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 opacity-[0.11] mix-blend-soft-light sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>

        {/* Bottom wisp */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-20 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{ clipPath: BLOB_CLIP, backgroundImage: GOLD_WISP }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 opacity-[0.09] mix-blend-soft-light sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>

        {/* Text scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: TEXT_SCRIM }}
        />

        <div className="mx-auto flex max-w-7xl items-center px-4 lg:px-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-3xl py-20 text-center sm:py-48 lg:py-56"
          >
            <h1 className="font-semibold text-4xl tracking-tight text-balance text-white sm:text-7xl">
              Clinical clarity.{" "}
              <span className="text-gold">Case confidence.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl font-serif text-xl/8 font-medium text-balance text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:text-2xl/8">
              Clinical expertise that turns thousands of pages of medical
              records into the clear, sourced facts your argument rests on.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:gap-x-6">
              <Button
                variant="primary"
                className="flex w-full items-center justify-center text-lg sm:w-56"
                onClick={() => scrollToSection("contact")}
              >
                Contact us
              </Button>

              <Button
                variant="secondary"
                className="flex w-full items-center justify-center text-lg sm:w-56"
                onClick={() => scrollToSection("features")}
              >
                About us
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
