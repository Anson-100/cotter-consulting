"use client"

import { ReactElement } from "react"

interface FeatureSectionHeaderProps {
  icon: ReactElement
  title: string
  description: string
}

const FeatureSectionHeader = ({
  icon,
  title,
  description,
}: FeatureSectionHeaderProps) => {
  return (
    <div className=" max-w-xl text-center mx-auto mt-32">
      <div className="flex items-center gap-2  mx-auto justify-center mb-6 px-4">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-500 to-indigo-300 dark:to-indigo-800" />
        <div className="shrink-0 h-14 w-14">{icon}</div>
        <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-indigo-200 dark:via-indigo-500 to-indigo-300 dark:to-indigo-800" />
      </div>
      <h3 className="text-3xl sm:text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {title}
      </h3>
      <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

export default FeatureSectionHeader
