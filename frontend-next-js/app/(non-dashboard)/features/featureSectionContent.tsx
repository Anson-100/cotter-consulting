"use client"

import Image from "next/image"
import { ReactNode } from "react"

interface FeatureBullet {
  icon: ReactNode
  name: string
  description: string
}

interface FeatureSectionContentProps {
  title: string
  subtitle: string
  description: string
  bullets: FeatureBullet[]
  image: string
  flip?: boolean
}

export default function FeatureSectionContent({
  title,
  subtitle,
  description,
  bullets,
  image,
  flip = false,
}: FeatureSectionContentProps) {
  return (
    <div className="overflow-hidden py-20">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-x-12 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start ${
            flip ? "lg:[&>*:nth-child(1)]:order-2" : ""
          }`}
        >
          <div className="px-6 lg:px-0 lg:pt-4 lg:pr-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              {/* <h2 className="text-base/7 font-semibold text-indigo-600">
                {title}
              </h2> */}
              <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-gray-800 dark:text-gray-200 ">
                {subtitle}
              </p>
              <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                {description}
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 dark:text-gray-300 lg:max-w-none">
                {bullets.map((bullet) => (
                  <div key={bullet.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-600 dark:text-gray-300">
                      <div className="absolute top-1 left-0 text-indigo-600">
                        {bullet.icon}
                      </div>
                      {bullet.name}
                    </dt>{" "}
                    <dd className="inline">{bullet.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0 ">
            <div className="relative  isolate overflow-hidden bg-indigo-500 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pt-4 sm:pr-0 sm:pl-4 lg:mx-0 lg:max-w-lg">
              <div
                aria-hidden="true"
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-40 bg-indigo-100 opacity-20 ring-1 ring-white ring-inset"
              />
              <div className="mx-auto max-w-2xl  sm:mx-0 sm:max-w-none">
                <Image
                  src={image}
                  alt={title}
                  width={2432}
                  height={1442}
                  className="-mb-12 w-180 max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset sm:rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
