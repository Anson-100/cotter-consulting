"use client"

import { useEffect } from "react"
import { useSelectedPageStore } from "@/lib/useSelectedPageStore"
import { SelectedPage } from "@/types"

// Landing section id -> the nav entry it should highlight.
// "credentials" (LogoCloudSection) has no nav item of its own, so it
// counts toward Home, same as before this hook existed.
const SECTION_PAGES: ReadonlyArray<readonly [string, SelectedPage]> = [
  ["home", SelectedPage.Home],
  ["credentials", SelectedPage.Home],
  ["about", SelectedPage.About],
  ["features", SelectedPage.Features],
  ["contact", SelectedPage.Contact],
]

const FIRST_PAGE = SECTION_PAGES[0][1]
const LAST_PAGE = SECTION_PAGES[SECTION_PAGES.length - 1][1]

// Distance (px) from the very top/bottom of the page within which we
// stop trusting the observer band and just clamp to the first/last section.
const EDGE_PX = 8

// Navbar is a fixed ~70px bar. Shrinking the root by that much off the top
// and 60% off the bottom leaves a thin "activation band" just under the
// navbar, so scrolling a section's top into it is what makes it active.
const ROOT_MARGIN = "-70px 0px -60% 0px"

/**
 * Shared flag: true while a nav click is smooth-scrolling the page.
 * The observer/scroll handlers below no-op while this is true so the
 * scroll-spy doesn't fight the section a user just clicked on while the
 * browser is still animating toward it.
 *
 * Exported (not local hook state) because the flag has to be set from
 * click handlers that live outside this hook's component tree
 * (LinkDesktop, LinkMobile).
 */
export const isProgrammaticScrollRef = { current: false }

let clearProgrammaticScrollTimer: ReturnType<typeof setTimeout> | null = null

function clearProgrammaticScroll() {
  isProgrammaticScrollRef.current = false
  window.removeEventListener("scrollend", clearProgrammaticScroll)
  if (clearProgrammaticScrollTimer) {
    clearTimeout(clearProgrammaticScrollTimer)
    clearProgrammaticScrollTimer = null
  }
}

/** Call this right before triggering a smooth-scroll from a nav click. */
export function beginProgrammaticScroll() {
  isProgrammaticScrollRef.current = true

  // Reset any previous listener/timer so repeat clicks don't stack them.
  window.removeEventListener("scrollend", clearProgrammaticScroll)
  window.addEventListener("scrollend", clearProgrammaticScroll, {
    once: true,
  })

  if (clearProgrammaticScrollTimer) clearTimeout(clearProgrammaticScrollTimer)
  // Safari doesn't support `scrollend` (as of writing) — this fallback
  // guarantees the lock always releases.
  clearProgrammaticScrollTimer = setTimeout(clearProgrammaticScroll, 800)
}

function setPage(page: SelectedPage) {
  if (useSelectedPageStore.getState().selectedPage !== page) {
    useSelectedPageStore.getState().setSelectedPage(page)
  }
}

/**
 * Owns "which landing section is active" for the whole page. Call this
 * once, at the page level — it writes into useSelectedPageStore, which
 * Navbar already reads from, so nothing else needs to change.
 */
export function useScrollSpy() {
  useEffect(() => {
    const pageByElement = new Map<Element, SelectedPage>()
    for (const [id, page] of SECTION_PAGES) {
      const el = document.getElementById(id)
      if (el) pageByElement.set(el, page)
    }

    if (pageByElement.size === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return

        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const page = pageByElement.get(entry.target)
          if (page) setPage(page)
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    )

    pageByElement.forEach((_page, el) => observer.observe(el))

    // The activation band can't resolve the very top or very bottom of the
    // page (there's no section edge crossing it there), so clamp those two
    // positions explicitly.
    const applyEdgeClamp = () => {
      if (isProgrammaticScrollRef.current) return

      if (window.scrollY <= EDGE_PX) {
        setPage(FIRST_PAGE)
        return
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - EDGE_PX
      if (atBottom) setPage(LAST_PAGE)
    }

    applyEdgeClamp()
    window.addEventListener("scroll", applyEdgeClamp, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", applyEdgeClamp)
    }
  }, [])
}
