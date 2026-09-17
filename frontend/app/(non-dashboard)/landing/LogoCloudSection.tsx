"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const logos = [
  {
    src: "/images/logo-american-heart.png",
    alt: "American Heart Association",
    width: 260,
    className: "h-24 sm:h-32",
  },
  {
    src: "/images/logo-ena.svg",
    alt: "Emergency Nurses Association",
    width: 200,
    className: "h-20 sm:h-24",
  },
  {
    src: "/images/logo-nih.svg",
    alt: "National Institutes of Health",
    width: 220,
    className: "h-24 sm:h-32",
  },
  {
    src: "/images/logo-rn.svg",
    alt: "Registered Nurse",
    width: 150,
    className: "h-24 sm:h-36",
  },
]

const LogoCloudSection = () => {
  return (
    <motion.section
      id="credentials"
      className="relative isolate overflow-hidden bg-zinc-300 py-24 scroll-mt-[70px]"
    >
      <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-14 bg-linear-to-r from-zinc-300 via-zinc-300/70 to-transparent sm:w-20" />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-14 bg-linear-to-l from-zinc-300 via-zinc-300/70 to-transparent sm:w-20" />

          <div className="animate-scroll flex w-max">
            {[0, 1, 2, 3].map((dup) => (
              <div
                key={dup}
                className="flex items-center space-x-40 px-20 sm:space-x-56 sm:px-28"
              >
                {logos.map((logo, idx) => (
                  <div
                    key={`${dup}-${idx}`}
                    className="flex flex-shrink-0 items-center justify-center"
                  >
                    <Image
                      src={logo.src}
                      alt={dup === 0 ? logo.alt : ""}
                      width={logo.width}
                      height={144}
                      className={`${logo.className} w-auto object-contain`}
                    />
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
