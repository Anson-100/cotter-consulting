//app/dashboard/layout.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/useAuthStore"

import LogoLink from "@/components/ui/logo-link-nav"
import DarkModeToggle from "@/components/ui/dark-mode-toggle"

import SidebarNavItem from "@/components/ui/sidebar-nav-item"
import SidebarSectionHeader from "@/components/ui/sidebar-section-header"
import NewBidModal from "@/app/dashboard/bids/NewBidModal"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import TemplatePickerDrawer from "@/components/TemplatePickerDrawer"

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react"
import {
  Bars2Icon,
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  XMarkIcon,
  PlusIcon,
  CurrencyDollarIcon,
  ArrowLeftEndOnRectangleIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"

import {
  CalendarDaysIcon as CalendarDaysIconSolid,
  DocumentDuplicateIcon as DocumentDuplicateIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  FolderIcon as FolderIconSolid,
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
} from "@heroicons/react/24/solid"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

// Map each nav item to its dashboard route
const navigation = [
  {
    name: "Home",
    href: "/dashboard/home",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: "Bids",
    href: "/dashboard/bids",
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
  },
  {
    name: "Jobs",
    href: "/dashboard/projects",
    icon: FolderIcon,
    iconSolid: FolderIconSolid,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDaysIcon,
    iconSolid: CalendarDaysIconSolid,
  },
  {
    name: "Payments",
    href: "/dashboard/payments",
    icon: CurrencyDollarIcon,
    iconSolid: CurrencyDollarIconSolid,
  },
]

const navData = [
  {
    name: "Contacts",
    href: "/dashboard/contacts",
    icon: UsersIcon,
    iconSolid: UsersIconSolid,
  },
  {
    name: "Records",
    href: "/dashboard/records",
    icon: DocumentDuplicateIcon,
    iconSolid: DocumentDuplicateIconSolid,
  },
]
export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newBidModalOpen, setNewBidModalOpen] = useState(false)
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false)
  const [pendingBidTitle, setPendingBidTitle] = useState("")

  const [profileData, setProfileData] = useState<{
    firstName: string
    lastName: string
    planId: string
    avatarUrl: string | null
  } | null>(null)
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Collapsible sidebar state
  const [isPinned, setIsPinned] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const isExpanded = isPinned || isHovered

  // Persist isPinned to localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebarPinned")
    if (stored !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPinned(stored === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebarPinned", String(isPinned))
    window.dispatchEvent(
      new CustomEvent("sidebarPinnedChange", { detail: isPinned }),
    )
  }, [isPinned])

  const { user, hasProfile, loading, initialized, initialize, logout } =
    useAuthStore()

  // Initialize auth store on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Route protection: redirect if not authorized
  useEffect(() => {
    if (!initialized || loading) return

    if (!user) {
      router.replace("/")
      return
    }

    if (hasProfile === false) {
      router.replace("/signup/onboarding")
    }
  }, [initialized, loading, user, hasProfile, router])

  // Fetch profile data for sidebar display
  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      const supabase = createClient()
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, plan_id, avatar_url")
        .eq("id", user.id)
        .single()

      if (data) {
        setProfileData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          planId: data.plan_id || "",
          avatarUrl: data.avatar_url,
        })
      }
    }
    loadProfile()
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // determines active state by pathname
  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href))

  // Convert plan_id to friendly display name
  const getPlanDisplayName = (planId: string) => {
    if (!planId) return "No plan"
    if (planId === "deferred") return "Free trial"
    const basePlan = planId.replace("_monthly", "").replace("_annually", "")
    return basePlan.charAt(0).toUpperCase() + basePlan.slice(1) + " plan"
  }

  // Show loading state while checking auth
  if (!initialized || loading || !user || hasProfile !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <main>
      {/* New Bid Modal */}
      <NewBidModal
        open={newBidModalOpen}
        onClose={() => setNewBidModalOpen(false)}
        onSelectTemplate={(title) => {
          setPendingBidTitle(title)
          setTemplateDrawerOpen(true)
        }}
      />
      <TemplatePickerDrawer
        open={templateDrawerOpen}
        onClose={() => {
          setTemplateDrawerOpen(false)
          setPendingBidTitle("")
        }}
        bidTitle={pendingBidTitle}
      />
      <div>
        {/* MOBILE SIDEBAR (Drawer) */}
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 backdrop-blur-md bg-zinc-950/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5 bg-white dark:bg-zinc-950 rounded-full"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-gray-900 dark:text-gray-100 "
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* MOBILE NAV MENU */}
              <div className="flex grow flex-col bg-white dark:bg-zinc-950 border-r-2 border-zinc-200 dark:border-zinc-800">
                {/* Logo header */}
                <div className="shrink-0 px-3.5">
                  <div className="flex h-16 shrink-0 items-center">
                    <LogoLink isExpanded={true} />
                  </div>
                </div>

                {/* Scrollable nav — mirrors desktop structure */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-4">
                  <ul role="list" className="flex flex-col gap-y-4">
                    {/* New Bid button */}
                    <li className="-mx-2">
                      <SidebarNavItem
                        icon={PlusIcon}
                        label="New Bid"
                        onClick={() => {
                          setSidebarOpen(false)
                          setNewBidModalOpen(true)
                        }}
                        isExpanded={true}
                        variant="newProject"
                      />
                    </li>

                    {/* Day-to-day section */}
                    <li>
                      <SidebarSectionHeader
                        label="Day-to-day"
                        isExpanded={true}
                      />
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <SidebarNavItem
                              icon={item.icon}
                              iconSolid={item.iconSolid}
                              label={item.name}
                              href={item.href}
                              isExpanded={true}
                              isActive={isActive(item.href)}
                              onClick={() => setSidebarOpen(false)}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* Divider */}
                    <div className="w-full h-0.5 my-1 bg-zinc-200 dark:bg-zinc-800" />

                    {/* File cabinet section */}
                    <li>
                      <SidebarSectionHeader
                        label="File cabinet"
                        isExpanded={true}
                      />
                      <ul role="list" className="-mx-2 space-y-1">
                        {navData.map((item) => (
                          <li key={item.name}>
                            <SidebarNavItem
                              icon={item.icon}
                              iconSolid={item.iconSolid}
                              label={item.name}
                              href={item.href}
                              isExpanded={true}
                              isActive={isActive(item.href)}
                              onClick={() => setSidebarOpen(false)}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* Divider */}
                    <div className="w-full h-0.5 my-1 bg-zinc-200 dark:bg-zinc-800" />

                    {/* Other stuff section */}
                    <li>
                      <SidebarSectionHeader
                        label="Other stuff"
                        isExpanded={true}
                      />
                      <div className="-mx-2 space-y-1">
                        <SidebarNavItem
                          icon={Cog6ToothIcon}
                          iconSolid={Cog6ToothIconSolid}
                          label="Settings"
                          href="/dashboard/settings"
                          isExpanded={true}
                          isActive={isActive("/dashboard/settings")}
                          onClick={() => setSidebarOpen(false)}
                        />
                        <DarkModeToggle
                          isExpanded={true}
                          className="group flex w-full rounded-md p-2 font-semibold text-gray-600 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-500"
                        >
                          Theme
                        </DarkModeToggle>
                        <SidebarNavItem
                          icon={ArrowLeftEndOnRectangleIcon}
                          label="Log out"
                          onClick={() => {
                            setSidebarOpen(false)
                            handleLogout()
                          }}
                          isExpanded={true}
                        />
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* DESKTOP SIDEBAR ================================================================================================*/}
        {/* Outer container - animates width, clips content */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col overflow-hidden transition-[width] duration-150 ease-in-out border-r-2 border-zinc-200 dark:border-zinc-800",
            isExpanded ? "lg:w-55" : "lg:w-14",
            // Shadow when floating (unpinned but hovered)
            !isPinned && isHovered && "shadow-xl",
          )}
        >
          {/* Inner container - FIXED width, never changes layout */}
          <div className="flex grow flex-col overflow-hidden bg-white dark:bg-zinc-950 w-55">
            {/* STICKY HEADER */}
            <div className="shrink-0 px-3.5">
              {/* Logo row */}
              <div className="flex h-16 shrink-0 items-center">
                <LogoLink isExpanded={isExpanded} />
              </div>
              {/* Toggle button row */}
            </div>

            {/* SCROLLABLE NAV */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-4">
              <ul role="list" className="flex flex-col gap-y-4">
                {/* New Bid button - above sections */}
                <li className="-mx-2">
                  <SidebarNavItem
                    icon={PlusIcon}
                    label="New Bid"
                    onClick={() => setNewBidModalOpen(true)}
                    isExpanded={isExpanded}
                    variant="newProject"
                  />
                </li>

                {/* Day-to-day section */}
                <li>
                  <SidebarSectionHeader
                    label="Day-to-day"
                    isExpanded={isExpanded}
                  />
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <SidebarNavItem
                          icon={item.icon}
                          iconSolid={item.iconSolid}
                          label={item.name}
                          href={item.href}
                          isExpanded={isExpanded}
                          isActive={isActive(item.href)}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
                {/* Divider - fades out when collapsed */}
                <div
                  className={cn(
                    "w-full h-0.5 my-1 bg-zinc-200 dark:bg-zinc-800",
                    !isExpanded && "opacity-0",
                  )}
                ></div>
                {/* File cabinet section */}
                <li>
                  <SidebarSectionHeader
                    label="File cabinet"
                    isExpanded={isExpanded}
                  />
                  <ul role="list" className="-mx-2 space-y-1">
                    {navData.map((item) => (
                      <li key={item.name}>
                        <SidebarNavItem
                          icon={item.icon}
                          iconSolid={item.iconSolid}
                          label={item.name}
                          href={item.href}
                          isExpanded={isExpanded}
                          isActive={isActive(item.href)}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
                {/* Divider - fades out when collapsed */}
                <div
                  className={cn(
                    "w-full h-0.5 my-1 bg-zinc-200 dark:bg-zinc-800",
                    !isExpanded && "opacity-0",
                  )}
                ></div>
                {/* Other stuff section */}
                <li>
                  <SidebarSectionHeader
                    label="Other stuff"
                    isExpanded={isExpanded}
                  />
                  <div className="-mx-2 space-y-1">
                    <SidebarNavItem
                      icon={Cog6ToothIcon}
                      iconSolid={Cog6ToothIconSolid}
                      label="Settings"
                      href="/dashboard/settings"
                      isExpanded={isExpanded}
                      isActive={isActive("/dashboard/settings")}
                    />
                    <DarkModeToggle
                      isExpanded={isExpanded}
                      className="group flex w-full rounded-md p-2 font-semibold text-gray-600 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-500"
                    >
                      Theme
                    </DarkModeToggle>
                    <SidebarNavItem
                      icon={ArrowLeftEndOnRectangleIcon}
                      label="Log out"
                      onClick={handleLogout}
                      isExpanded={isExpanded}
                    />
                  </div>
                </li>
              </ul>
            </nav>
            <div className="-mx-5 h-10 flex items-center">
              <button
                onClick={() => setIsPinned(!isPinned)}
                className="group flex flex-nowrap items-center p-2.5 w-full text-gray-800 dark:text-gray-200 hover:text-indigo-600 mx-auto dark:hover:text-indigo-500  bg-sky-950/30 gap-1"
                title={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
              >
                {isPinned ? (
                  <LockClosedIcon className="size-5 shrink-0 ml-[25px]" />
                ) : (
                  <LockOpenIcon className="size-5 shrink-0 ml-7" />
                )}
                <span
                  className={cn(
                    "whitespace-nowrap ml-2",
                    !isExpanded && "opacity-0",
                  )}
                >
                  {isPinned ? "Minimize" : "Keep open"}
                </span>
              </button>
            </div>
            {/* STICKY FOOTER - Profile ==========================================================================================================================================================================================*/}
            <div className="shrink-0 border-t-2 border-zinc-200 dark:border-zinc-800">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-x-4 px-3 py-2.5 font-semibold text-gray-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-gray-200"
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
                title={
                  !isExpanded ? profileData?.firstName || "Profile" : undefined
                }
              >
                {profileData?.avatarUrl ? (
                  <Image
                    alt=""
                    src={profileData.avatarUrl}
                    className="size-8 rounded-full bg-gray-50 object-cover shrink-0"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="size-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white  font-semibold shrink-0">
                    {profileData?.firstName?.charAt(0) || "?"}
                  </div>
                )}
                <span className="sr-only">Your profile</span>
                <div
                  className={cn("flex flex-col", !isExpanded && "opacity-0")}
                >
                  <span aria-hidden="true" className="whitespace-nowrap">
                    {profileData
                      ? `${profileData.firstName} ${profileData.lastName}`
                      : "Loading..."}
                  </span>
                  <span className=" font-normal text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {isProfileHovered
                      ? "Go to settings"
                      : getPlanDisplayName(profileData?.planId || "")}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* MOBILE TOP BAR */}
        <div className="sticky top-0 z-40 flex items-center justify-between gap-x-6 bg-white dark:bg-zinc-950 px-5 py-2.5 shadow-xs border-b border-zinc-200 dark:border-zinc-700 sm:px-6 lg:hidden">
          <Link href="/dashboard/settings">
            <span className="sr-only">Your profile</span>
            {profileData?.avatarUrl ? (
              <Image
                alt=""
                src={profileData.avatarUrl}
                className="size-10 rounded-full bg-gray-50 object-cover"
                width={40}
                height={40}
              />
            ) : (
              <div className="size-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white font-semibold">
                {profileData?.firstName?.charAt(0) || "?"}
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars2Icon
              aria-hidden="true"
              className="size-6 dark:text-gray-300"
            />
          </button>
        </div>

        {/* MAIN CONTENT (uses the desktop sidebar offset) */}
        <div
          className={cn(
            "dark:bg-zinc-950 overflow-y-auto border-r p-4 pb-20 sm:p-6 sm:pb-24 transition-[margin] duration-200 ease-in-out min-h-screen",
            isPinned ? "lg:ml-55" : "lg:ml-14",
          )}
        >
          {children}
        </div>
      </div>
    </main>
  )
}
