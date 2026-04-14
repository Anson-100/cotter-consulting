import { ReactNode } from "react"

type SceneHeaderProps = {
  eyebrow: string
  title: ReactNode
  caption: ReactNode
  className?: string
}

export default function SceneHeader({
  eyebrow,
  title,
  caption,
  className = "",
}: SceneHeaderProps) {
  return (
    <div className={`mx-auto lg:mx-0 ${className}`}>
      <h1 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-500 mb-2 hidden">
        {eyebrow}
      </h1>
      <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-gray-100 sm:text-5xl">
        {title}
      </h2>
      <p className="mt-6 text-xl text-pretty font-medium text-gray-600 dark:text-gray-300">
        {caption}
      </p>
    </div>
  )
}
