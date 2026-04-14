"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import LinkDesktop from "./ui/link-desktop"
import LinkMobile from "./ui/link-mobile"
import LogoLinkNav from "./ui/logo-link-nav"

import DarkModeToggle from "./ui/dark-mode-toggle"
import AuthButtons from "./AuthButtons"
import { useSelectedPageStore } from "@/lib/useSelectedPageStore"
import { AnimatePresence, motion } from "framer-motion"
import {
  HomeIcon,
  PaperAirplaneIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  Bars2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

import {
  HomeIcon as HomeIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
  StarIcon as StarIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
} from "@heroicons/react/24/solid"

import { SelectedPage } from "@/types/index"
import useMediaQuery from "@/hooks/useMediaQuery"

type Props = {
  isTopOfPage?: boolean
}

const Navbar = ({ isTopOfPage = true }: Props) => {
  const flexBetween = "flex items-center justify-between"
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false)
  const { selectedPage, setSelectedPage } = useSelectedPageStore()
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)")
  const router = useRouter()
  const pathname = usePathname()

  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      prevPathRef.current = pathname
    }
  }, [pathname])

  const handleBackOrHome = () => {
    if (prevPathRef.current === "/") {
      router.back()
    } else {
      router.push("/")
    }
  }

  const navbarBackground = isTopOfPage ? "" : ""

  const menuRef = useRef<HTMLDivElement>(null)
  const navButtonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        navButtonsRef.current &&
        !navButtonsRef.current.contains(event.target as Node)
      ) {
        setIsMenuToggled(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const hasSlug = pathname !== "/"

  return (
    <nav>
      <div
        className={`
          ${navbarBackground} ${flexBetween}
          fixed bg-white dark:bg-zinc-950 top-0 z-30 w-full  h-[72px]
          shadow-[0_4px_6px_-2px_rgba(0,0,0,0.08)]
          dark:shadow-none dark:border-b-2 border-b-zinc-800 px-6
        `}
      >
        <div
          className={`${flexBetween} mx-auto w-full sm:px-0 max-w-7xl 2xl:max-w-5/6`}
        >
          <div className={`${flexBetween} w-full`}>
            {/* LEFT SIDE */}
            <LogoLinkNav />
            {/* RIGHT SIDE */}

            {hasSlug ? (
              isAboveMediumScreens ? (
                // Desktop routed: ← Home + Auth + DarkMode
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleBackOrHome}
                    className="flex items-center font-semibold text-gray-800 dark:text-gray-200 justify-center gap-2 py-2 px-4 hover:cursor-pointer"
                  >
                    <span className="text-zinc-500 text-lg">&larr;</span>
                    <span>Home</span>
                  </button>
                  <AuthButtons variant="desktop" />
                  <DarkModeToggle />
                </div>
              ) : (
                // Mobile routed: Auth + HomeIcon + Burger
                <div
                  ref={navButtonsRef}
                  className="flex items-center justify-center gap-4"
                >
                  <AuthButtons variant="desktop" />
                  <button
                    type="button"
                    onClick={handleBackOrHome}
                    className="hover:cursor-pointer"
                  >
                    <HomeIcon className="size-6 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    className="rounded-full hover:cursor-pointer"
                    onClick={() => setIsMenuToggled(!isMenuToggled)}
                  >
                    {!isMenuToggled ? (
                      <Bars2Icon className="w-6 text-zinc-400" />
                    ) : (
                      <XMarkIcon className="w-6 text-zinc-400" />
                    )}
                  </button>
                </div>
              )
            ) : isAboveMediumScreens ? (
              // FULL NAV ITEMS =================================================================================
              <div className={`${flexBetween} gap-8`}>
                <div className={`${flexBetween} gap-4 text-md  pl-4  `}>
                  <LinkDesktop
                    scrollTo={SelectedPage.Home}
                    displayText="Home"
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                  />
                  <LinkDesktop
                    scrollTo={SelectedPage.About}
                    displayText="How it works"
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                  />
                  {/* <LinkDesktop
                    scrollTo={SelectedPage.Features}
                    displayText="Features"
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                  /> */}
                  <LinkDesktop
                    scrollTo={SelectedPage.Pricing}
                    displayText="Pricing"
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                  />

                  <div className="h-6 w-0.5 mb-1 bg-zinc-200 dark:bg-zinc-800"></div>
                  <Link
                    href="/contact"
                    className="flex items-center border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 text-gray-800 dark:text-gray-200 justify-center mt-1 pb-1 px-1 mx-2 border-b-2 font-semibold"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/faq"
                    className="flex items-center border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 text-gray-800 dark:text-gray-200 justify-center mt-1 pb-1 px-1 mx-2 border-b-2 font-semibold"
                  >
                    FAQ
                  </Link>
                  {/* Sign in button */}

                  <AuthButtons variant="desktop" />
                  <DarkModeToggle className="" />
                </div>
              </div>
            ) : (
              <div
                ref={navButtonsRef}
                className="flex items-center justify-center gap-4"
              >
                <AuthButtons variant="desktop" />

                <DarkModeToggle />
                <button
                  className="rounded-full  hover:cursor-pointer"
                  onClick={() => setIsMenuToggled(!isMenuToggled)}
                >
                  {!isMenuToggled ? (
                    <Bars2Icon className="w-6 text-zinc-400" />
                  ) : (
                    <XMarkIcon className="w-6 text-zinc-400" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU MODAL */}
      <AnimatePresence>
        {!isAboveMediumScreens && isMenuToggled && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed top-0 right-0 mt-[71px] dark:mt-[70px] w-full md:w-2/5 
        md:rounded-bl-lg overflow-hidden z-30 bg-white dark:bg-zinc-950
        shadow-[0_4px_6px_-2px_rgba(0,0,0,0.08)]
        dark:shadow-none
        dark:border-b-2 dark:border-zinc-800
        md:shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06),0_4px_6px_-2px_rgba(0,0,0,0.08)]
        md:dark:shadow-none md:dark:border-l-2`}
          >
            <div className="mt-2 flex flex-col items-center text-lg z-50 mx-2 sm:mx-4">
              <>
                <LinkMobile
                  scrollTo={SelectedPage.Home}
                  displayText="Home"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  toggleMenu={() => setIsMenuToggled(false)}
                  Icon={HomeIcon}
                  IconSolid={HomeIconSolid}
                />
                <LinkMobile
                  scrollTo={SelectedPage.About}
                  displayText="How it works"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  toggleMenu={() => setIsMenuToggled(false)}
                  Icon={WrenchScrewdriverIcon}
                  IconSolid={WrenchScrewdriverIconSolid}
                />
                <LinkMobile
                  scrollTo={SelectedPage.Features}
                  displayText="Features"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  toggleMenu={() => setIsMenuToggled(false)}
                  Icon={StarIcon}
                  IconSolid={StarIconSolid}
                />
                <LinkMobile
                  scrollTo={SelectedPage.Pricing}
                  displayText="Pricing"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  toggleMenu={() => setIsMenuToggled(false)}
                  Icon={InformationCircleIcon}
                  IconSolid={InformationCircleIconSolid}
                />

                <div className="w-full px-2">
                  <div className="w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 my-2" />
                </div>
                <div className="w-full mb-4">
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuToggled(false)}
                    className="font-semibold pt-4 pb-2 w-full px-4 mx-auto flex items-center text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-500 dark:text-gray-300"
                  >
                    <PaperAirplaneIcon className="size-6 mr-4" />
                    <p>Contact</p>
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsMenuToggled(false)}
                    className="font-semibold pt-4 pb-2 w-full px-4 mx-auto flex items-center text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-500 dark:text-gray-300"
                  >
                    <QuestionMarkCircleIcon className="size-6 mr-4" />
                    <p>FAQ</p>
                  </Link>
                  <AuthButtons variant="mobile" />
                </div>
              </>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
