"use client"

import Link from "next/link"
import Button from "@/components/ui/button"
import {
  LinkIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ScaleIcon,
} from "@heroicons/react/20/solid"
import { motion } from "framer-motion"
import SceneHeader from "@/components/ui/scene-header"

const credentials = [
  {
    name: "BSN, RN",
    description:
      "Bachelor of Science in Nursing and an active registered nurse license.",
    icon: AcademicCapIcon,
  },
  {
    name: "Critical care background",
    description:
      "Years at the bedside in intensive care, where charting is dense, timelines are tight, and small deviations carry real consequences. That is the same detail a case file demands.",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: "Consulting for counsel",
    description:
      "Record review, chronologies, merit screening, and standard of care analysis for plaintiff and defense firms.",
    icon: ScaleIcon,
  },
]

export default function FeaturesSection() {
  return (
    <div
      id="features"
      className=" py-24 sm:py-32 min-h-screen scroll-mt-[70px]"
    >
      <motion.div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SceneHeader
          eyebrow="Features"
          title={
            <>
              About
              <span className="text-indigo-600 dark:text-indigo-500"></span>
            </>
          }
          caption=""
        />

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <p className="font-serif text-lg/8 text-gray-700 dark:text-gray-300">
                RaeAnna Cotter, BSN, RN, spent her career in intensive care,
                reading the record as it was written and watching how quickly a
                patient's course can turn on a single missed detail. That work
                is what a case file asks for: knowing what belongs in the chart,
                what is missing from it, and what the sequence actually shows.
              </p>

              <dl className="mt-10 max-w-xl space-y-8 font-serif text-base/7 text-gray-600 lg:max-w-none dark:text-gray-400">
                {credentials.map((item) => (
                  <div key={item.name} className="relative pl-9 flex flex-col">
                    <dt className="inline text-xl text-gray-900 dark:text-gray-100">
                      <item.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-indigo-600 dark:text-indigo-500"
                      />

                      {item.name}
                    </dt>{" "}
                    <dd className="inline">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <img
            alt="Raeanna Cotter"
            src="https://images.unsplash.com/photo-1706799191377-96a80beaee24?q=80&w=2577&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="aspect-[4/3] w-full rounded-xl object-cover shadow-xl ring-1 ring-gray-400/10 grayscale lg:aspect-auto lg:h-full"
          />
        </div>
      </motion.div>
    </div>
  )
}
