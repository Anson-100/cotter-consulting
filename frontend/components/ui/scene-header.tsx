import { ReactNode } from "react"
import {
  PaperAirplaneIcon,
  BriefcaseIcon,
  ListBulletIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"

const ICONS = {
  paperAirplane: PaperAirplaneIcon,
  briefcase: BriefcaseIcon,
  listBullet: ListBulletIcon,
  questionMarkCircle: QuestionMarkCircleIcon,
  informationCircle: InformationCircleIcon,
} as const

export type SceneHeaderIcon = keyof typeof ICONS

type SceneHeaderProps = {
  eyebrow: string
  icon?: SceneHeaderIcon
  title: ReactNode
  caption: ReactNode
  className?: string
}

export default function SceneHeader({
  eyebrow,
  icon,
  title,
  caption,
  className = "",
}: SceneHeaderProps) {
  const Icon = icon ? ICONS[icon] : null

  return (
    <div className={`mx-auto lg:mx-0  ${className}`}>
      <div className="mb-2 inline-flex items-center gap-1 text-succulent dark:brightness-150">
        {Icon && <Icon aria-hidden="true" className="size-5 shrink-0 hidden" />}
        <div className="text-lg/7 font-serif">{eyebrow}</div>
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-gray-100 sm:text-5xl">
        {title}
      </h2>
      <p className="mt-6 text-xl text-pretty font-serif text-gray-600 dark:text-gray-300">
        {caption}
      </p>
    </div>
  )
}
