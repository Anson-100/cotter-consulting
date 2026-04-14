"use client"

import { SelectedPage } from "@/types/index"

type Props = {
  scrollTo: SelectedPage
  displayText: string
  selectedPage: SelectedPage
  setSelectedPage: (value: SelectedPage) => void
}

const LinkDesktop = ({
  scrollTo,
  displayText,
  selectedPage,
  setSelectedPage,
}: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById(scrollTo)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setSelectedPage(scrollTo)
    }
  }

  return (
    <a
      href={`#${scrollTo}`}
      onClick={handleClick}
      className={`mt-1 pb-1 px-1 mx-2 border-b-2 font-semibold ${
        selectedPage === scrollTo
          ? "border-indigo-500 dark:border-indigo-500 text-gray-800 dark:text-gray-200"
          : "border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-gray-800 dark:text-gray-200"
      }`}
    >
      {displayText}
    </a>
  )
}

export default LinkDesktop
