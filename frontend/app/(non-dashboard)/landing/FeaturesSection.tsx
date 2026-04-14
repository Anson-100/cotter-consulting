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
import { motion } from "framer-motion"
import { SelectedPage } from "@/types"
import SceneHeader from "@/components/ui/scene-header"

type Props = {
  setSelectedPage: (value: SelectedPage) => void
}

const features = [
  {
    name: "Send bids as links",
    icon: LinkIcon,
    anchorId: "send-bids",
  },
  {
    name: "Track progress",
    icon: ChartBarIcon,
    anchorId: "track-progress",
  },
  {
    name: "Records for tax time",
    icon: ArchiveBoxIcon,
    anchorId: "keep-records",
  },
  {
    name: "Mobile friendly",
    icon: DevicePhoneMobileIcon,
    anchorId: "mobile-friendly",
  },
]

export default function FeaturesSection({ setSelectedPage }: Props) {
  return (
    <div id="features" className=" py-24 sm:py-32">
      <motion.div
        className="mx-auto max-w-7xl px-6 lg:px-8"
        onViewportEnter={() => setSelectedPage(SelectedPage.Features)}
      >
        <SceneHeader
          eyebrow="Features"
          title={
            <>
              Powerful yet{" "}
              <span className="text-sky-600 dark:text-sky-500">simple</span>
            </>
          }
          caption=""
        />

        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-20 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4 bg-white dark:bg-zinc-950 pt-16 pb-8 p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800"
        >
          {features.map((feature) => (
            <li key={feature.name}>
              <div className="flex items-center gap-2 justify-center">
                <div className="flex-1 h-0.5 bg-linear-to-r from-transparent via-indigo-200 dark:via-indigo-500 to-indigo-300 dark:to-indigo-800"></div>
                <feature.icon
                  className="h-14 w-14 text-indigo-600 dark:text-indigo-500"
                  aria-hidden="true"
                />
                <div className="flex-1 h-0.5 bg-linear-to-l from-transparent via-indigo-200 dark:via-indigo-500 to-indigo-300 dark:to-indigo-800"></div>
              </div>
              <h3 className="text-xl/8 font-semibold tracking-tight mt-6 text-center text-gray-800 dark:text-gray-200">
                {feature.name}
              </h3>
              <div className="mt-6 flex justify-center">
                <Button
                  as={Link}
                  href={`/features#${feature.anchorId}`}
                  variant="secondary"
                  className="w-full"
                >
                  See details <span aria-hidden="true">→</span>
                </Button>
              </div>
            </li>
          ))}
          <div className="col-span-full flex items-center justify-center">
            <Link
              href="/features"
              className="text-indigo-600 dark:text-indigo-500 hover:underline"
            >
              Full feature page →
            </Link>
          </div>
        </ul>

        {/* ⭐ Testimonial ================================git  */}
        <section className="px-6 mt-44 lg:px-8">
          <figure className="mx-auto max-w-2xl relative isolate">
            <svg
              fill="none"
              viewBox="-1 -1 164 130"
              aria-hidden="true"
              className="absolute top-0 left-0 -z-10 h-32 stroke-2 stroke-zinc-300/80 dark:stroke-zinc-700/80"
            >
              <path
                id="b56e9dab"
                d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404C6.08991 102.749 9.12394 108.02 12.959 112.654C16.8027 117.138 21.2829 120.739 26.4034 123.459C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
              />
              <use x={86} href="#b56e9dab" />
            </svg>

            <div className="flex gap-x-1 text-indigo-600 dark:text-indigo-500">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  aria-hidden="true"
                  className="size-5 flex-none"
                />
              ))}
            </div>

            <blockquote className="mt-10 text-xl/8 font-semibold tracking-tight text-gray-800 dark:text-gray-200 sm:text-2xl/9">
              <p>
                The Pirate Ship has made my life so much easier now that I'm not
                spending hours formatting bids. Plus, it is easy to update when
                plans change and keeps everyone in the loop. Great tool for any
                contractor who wants more business and time savings.
              </p>
            </blockquote>

            <figcaption className="mt-10 flex items-center gap-x-6">
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  Isaac Cotter
                </div>
                <div className="mt-0.5 text-gray-600 dark:text-gray-300">
                  Cotter Carpentry
                </div>
              </div>
            </figcaption>
          </figure>
        </section>
      </motion.div>
    </div>
  )
}
