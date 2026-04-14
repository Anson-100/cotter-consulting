"use client"

import { SelectedPage } from "@/types/index"

type Props = {
  scrollTo: SelectedPage
  displayText: string
  selectedPage: SelectedPage
  setSelectedPage: (value: SelectedPage) => void
  toggleMenu: () => void
  Icon: React.ComponentType<{ className?: string }>
  IconSolid?: React.ComponentType<{ className?: string }>
}

const LinkMobile = ({
  scrollTo,
  displayText,
  selectedPage,
  setSelectedPage,
  toggleMenu,
  Icon,
  IconSolid,
}: Props) => {
  const isActive = selectedPage === scrollTo
  const ActiveIcon = isActive && IconSolid ? IconSolid : Icon

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById(scrollTo)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setSelectedPage(scrollTo)
    toggleMenu()
  }

  return (
    <a
      href={`#${scrollTo}`}
      onClick={handleClick}
      className={`font-semibold py-4 px-4 w-full flex items-center hover:text-indigo-600 dark:hover:text-indigo-500 ${
        isActive
          ? "text-indigo-600 dark:text-indigo-500"
          : "text-gray-600 dark:text-gray-300"
      }`}
    >
      <ActiveIcon className="size-6 mr-4" />
      {displayText}
    </a>
  )
}

export default LinkMobile
