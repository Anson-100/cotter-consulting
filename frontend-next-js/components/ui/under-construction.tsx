// components/ui/under-construction.tsx

import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid"

type UnderConstructionProps = {
  title?: string
  message?: string
}

export default function UnderConstruction({
  title = "Under construction",
  message = "This feature is under construction",
}: UnderConstructionProps) {
  return (
    <div className="text-center py-12 ring-2 px-4 rounded-lg bg-amber-900/20 text-amber-700 ring-amber-600/60 dark:bg-amber-900/10 dark:text-amber-400 dark:ring-amber-400/60">
      <div className="mx-auto text-gray-600 dark:text-gray-300 flex items-center justify-center size-28 ">
        <WrenchScrewdriverIcon className=" ring-2 rounded-full ring-amber-600/60 dark:ring-amber-400/60 p-4 bg-amber-900/40 dark:bg-amber-900/40" />
      </div>
      <h3 className="mt-2 text-3xl font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  )
}
