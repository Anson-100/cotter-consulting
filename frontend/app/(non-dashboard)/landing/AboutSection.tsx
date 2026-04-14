/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { SelectedPage } from "@/types"
import SceneHeader from "@/components/ui/scene-header"

type Props = {
  setSelectedPage: (value: SelectedPage) => void
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return isDesktop
}

const steps = [
  {
    number: "1",
    title: "Build your bid",
    description:
      "Everything you need to create a clean, professional estimate. No design skills required.",
    bg: "bg-white dark:bg-zinc-800",
    numberColor: "text-gray-900 dark:text-white",
    titleColor: "text-gray-900 dark:text-white",
    descColor: "text-gray-600 dark:text-gray-300",
    maxHeight: 280,
    widthPercent: "65%",
    mobileHeight: 300,
  },
  {
    number: "2",
    title: "Send a link",
    description:
      "Share a single link via text or email. Your customer opens it instantly on any device. No PDFs, no downloads, no friction.",
    bg: "bg-zinc-200 dark:bg-zinc-700",
    numberColor: "text-gray-900 dark:text-white",
    titleColor: "text-gray-900 dark:text-white",
    descColor: "text-gray-600 dark:text-gray-300",
    maxHeight: 360,
    widthPercent: "85%",
    mobileHeight: 300,
  },
  {
    number: "3",
    title: "Get approved",
    description:
      "Customers review, approve, and sign — all from the link. You get notified the second it happens.",
    bg: "bg-indigo-600",
    numberColor: "text-white",
    titleColor: "text-white",
    descColor: "text-indigo-50",
    maxHeight: 440,
    widthPercent: "100%",
    mobileHeight: 300,
  },
]

// DESKTOP BAR ============================================================
// THE FIXED-HEIGHT PARENT PREVENTS Y-TRANSLATE DISTORTION. THE COLORED
// BAR GROWS INSIDE IT. THE STEP NUMBER RIDES INSIDE THE BAR SO IT
// TRAVELS WITH THE TOP EDGE. THE TEXT STAYS PINNED AT THE BOTTOM OF
// THE FIXED PARENT — NO LAYOUT SHIFT.
// ========================================================================
function DesktopBar({
  step,
  index,
  scrollYProgress,
}: {
  step: (typeof steps)[number]
  index: number
  scrollYProgress: MotionValue<number>
}) {
  // SCROLL THRESHOLDS — CONTROLS WHEN EACH BAR STARTS/FINISHES GROWING ==
  // TWEAK THESE VALUES TO CHANGE ANIMATION TIMING PER STEP ===============
  const start = 0.05 + index * 0.08
  const end = 0.4 + index * 0.05

  // CONTAINER GROWTH — CONTROLS THE HEIGHT OF THE COLORED BAR ============
  // FIRST ARRAY: SCROLL POSITIONS [START, END] ============================
  // SECOND ARRAY: HEIGHT VALUES [INITIAL, FINAL] =========================
  // ADJUST THESE TO CHANGE HOW THE BAR GROWS =============================
  const height = useTransform(
    scrollYProgress,
    [start, end],
    [80, step.maxHeight],
  )

  // CONTAINER OPACITY — CONTROLS THE FADE-IN OF THE COLORED BAR ==========
  // FIRST ARRAY: SCROLL POSITIONS [START, START + OFFSET] =================
  // SECOND ARRAY: OPACITY VALUES [INITIAL, FINAL] ========================
  // ADJUST THESE TO CHANGE HOW THE BAR FADES IN ==========================
  const barOpacity = useTransform(
    scrollYProgress,
    [start, start + 0.05],
    [0.4, 1],
  )

  // NUMBER OPACITY — FADES IN EARLIER THAN THE TEXT =======================
  // THE NUMBER LIVES INSIDE THE ANIMATED BAR SO IT RIDES THE TOP EDGE =====
  // FIRST ARRAY: SCROLL POSITIONS [START, END] ============================
  // SECOND ARRAY: OPACITY VALUES [HIDDEN, VISIBLE] ========================
  // ADJUST THESE TO MAKE THE NUMBER APPEAR SOONER OR LATER ================
  const numberOpacity = useTransform(
    scrollYProgress,
    [start, start + 0.08],
    [0, 1],
  )

  // TEXT OPACITY — CONTROLS WHEN THE TITLE + DESCRIPTION FADE IN ==========
  // THIS IS INDEPENDENT OF THE BAR GROWTH SO TEXT STAYS IN PLACE ==========
  // FIRST ARRAY: SCROLL POSITIONS [BEFORE_END, AFTER_END] =================
  // SECOND ARRAY: OPACITY VALUES [HIDDEN, VISIBLE] ========================
  // ADJUST THESE TO CHANGE WHEN TEXT APPEARS ==============================
  const textOpacity = useTransform(
    scrollYProgress,
    [end - 0.08, end + 0.02],
    [0, 1],
  )

  return (
    // FIXED-HEIGHT TRANSPARENT PARENT =====================================
    // THIS CONTAINER IS ALWAYS THE FULL FINAL HEIGHT (step.maxHeight) =====
    // IT DOES NOT ANIMATE — IT JUST RESERVES SPACE ========================
    // =====================================================================
    <div className="relative flex-1" style={{ height: step.maxHeight }}>
      {/* ANIMATED COLORED BAR — GROWS FROM BOTTOM UP ==================== */}
      {/* THE STEP NUMBER LIVES INSIDE HERE SO IT RIDES THE TOP EDGE ===== */}
      {/* AS THE BAR GROWS, THE NUMBER TRAVELS UPWARD WITH IT ============ */}
      {/* ================================================================ */}
      <motion.div
        style={{ height, opacity: barOpacity }}
        className={`absolute bottom-0 left-0 right-0 rounded-t-2xl ${step.bg} overflow-hidden`}
      >
        {/* STEP NUMBER — RIDES INSIDE THE BAR, PINNED TO TOP ============ */}
        {/* IT HAS ITS OWN OPACITY SO IT FADES IN EARLIER THAN TEXT ====== */}
        <motion.p
          style={{ opacity: numberOpacity }}
          className={`p-8 text-5xl font-bold tracking-tight ${step.numberColor}`}
        >
          {step.number}
        </motion.p>
      </motion.div>

      {/* FIXED-POSITION TEXT LAYER — TITLE + DESCRIPTION ONLY =========== */}
      {/* PINNED TO THE BOTTOM OF THE FIXED PARENT — NEVER MOVES ========= */}
      {/* FADES IN VIA textOpacity ONCE THE BAR HAS GROWN ENOUGH ========= */}
      {/* ================================================================ */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none"
      >
        <p
          className={`text-lg font-semibold tracking-tight ${step.titleColor}`}
        >
          {step.title}
        </p>
        <p className={`mt-2 text-base/7 ${step.descColor}`}>
          {step.description}
        </p>
      </motion.div>
    </div>
  )
}

// MOBILE BAR =============================================================
// SAME STRATEGY BUT HORIZONTAL. THE COLORED BAR GROWS IN WIDTH FROM
// THE LEFT. THE STEP NUMBER RIDES INSIDE THE BAR SO IT'S ALWAYS VISIBLE
// WITHIN THE COLORED AREA. THE TEXT STAYS PINNED AT THE BOTTOM —
// CONSTRAINED TO step.widthPercent SO IT MATCHES THE BAR'S FINAL WIDTH.
// ========================================================================
function MobileBar({
  step,
  index,
  scrollYProgress,
}: {
  step: (typeof steps)[number]
  index: number
  scrollYProgress: MotionValue<number>
}) {
  // SCROLL THRESHOLDS — CONTROLS WHEN EACH BAR STARTS/FINISHES GROWING ==
  // TWEAK THESE VALUES TO CHANGE ANIMATION TIMING PER STEP ===============
  const start = 0.05 + index * 0.08
  const end = 0.4 + index * 0.05

  // CONTAINER GROWTH — CONTROLS THE WIDTH OF THE COLORED BAR ==============
  // FIRST ARRAY: SCROLL POSITIONS [START, END] ============================
  // SECOND ARRAY: WIDTH VALUES [INITIAL, FINAL] ==========================
  // ADJUST THESE TO CHANGE HOW THE BAR GROWS =============================
  const width = useTransform(
    scrollYProgress,
    [start, end],
    ["30%", step.widthPercent],
  )

  // CONTAINER OPACITY — CONTROLS THE FADE-IN OF THE COLORED BAR ==========
  // FIRST ARRAY: SCROLL POSITIONS [START, START + OFFSET] =================
  // SECOND ARRAY: OPACITY VALUES [INITIAL, FINAL] ========================
  // ADJUST THESE TO CHANGE HOW THE BAR FADES IN ==========================
  const barOpacity = useTransform(
    scrollYProgress,
    [start, start + 0.05],
    [0.4, 1],
  )

  // NUMBER OPACITY — FADES IN EARLIER THAN THE TEXT =======================
  // THE NUMBER LIVES INSIDE THE ANIMATED BAR SO IT STAYS WITHIN COLOR =====
  // FIRST ARRAY: SCROLL POSITIONS [START, END] ============================
  // SECOND ARRAY: OPACITY VALUES [HIDDEN, VISIBLE] ========================
  // ADJUST THESE TO MAKE THE NUMBER APPEAR SOONER OR LATER ================
  const numberOpacity = useTransform(
    scrollYProgress,
    [start, start + 0.08],
    [0, 1],
  )

  // TEXT OPACITY — CONTROLS WHEN THE TITLE + DESCRIPTION FADE IN ==========
  // THIS IS INDEPENDENT OF THE BAR GROWTH SO TEXT STAYS IN PLACE ==========
  // FIRST ARRAY: SCROLL POSITIONS [BEFORE_END, AFTER_END] =================
  // SECOND ARRAY: OPACITY VALUES [HIDDEN, VISIBLE] ========================
  // ADJUST THESE TO CHANGE WHEN TEXT APPEARS ==============================
  const textOpacity = useTransform(
    scrollYProgress,
    [end - 0.09, end + 0.02],
    [0, 1],
  )

  return (
    // FIXED-SIZE TRANSPARENT PARENT =======================================
    // THIS CONTAINER IS ALWAYS FULL WIDTH AND FULL HEIGHT =================
    // IT DOES NOT ANIMATE — IT JUST RESERVES SPACE ========================
    // =====================================================================
    <div className="relative w-full" style={{ height: step.mobileHeight }}>
      {/* ANIMATED COLORED BAR — GROWS FROM LEFT TO RIGHT ================ */}
      {/* THE STEP NUMBER LIVES INSIDE HERE SO IT STAYS WITHIN COLOR ===== */}
      {/* ================================================================ */}
      <motion.div
        style={{ width, opacity: barOpacity, height: step.mobileHeight }}
        className={`absolute left-0 top-0 bottom-0 rounded-r-2xl ${step.bg} overflow-hidden`}
      >
        {/* STEP NUMBER — RIDES INSIDE THE BAR, PINNED TO TOP ============ */}
        {/* IT HAS ITS OWN OPACITY SO IT FADES IN EARLIER THAN TEXT ====== */}
        <motion.p
          style={{ opacity: numberOpacity }}
          className={`p-6 text-4xl font-bold tracking-tight ${step.numberColor}`}
        >
          {step.number}
        </motion.p>
      </motion.div>

      {/* FIXED-POSITION TEXT LAYER — TITLE + DESCRIPTION ONLY =========== */}
      {/* CONSTRAINED TO step.widthPercent SO IT MATCHES THE BAR'S ======= */}
      {/* FINAL WIDTH — TEXT WILL NOT SPILL BEYOND THE COLORED AREA ====== */}
      {/* FADES IN VIA textOpacity ONCE THE BAR HAS GROWN ENOUGH ========= */}
      {/* ================================================================ */}
      <motion.div
        style={{ opacity: textOpacity, width: step.widthPercent }}
        className="absolute bottom-0 left-0 p-6 pointer-events-none"
      >
        <p
          className={`text-lg font-semibold tracking-tight ${step.titleColor}`}
        >
          {step.title}
        </p>
        <p className={`mt-2 text-base/7 ${step.descColor}`}>
          {step.description}
        </p>
      </motion.div>
    </div>
  )
}

// ABOUT SECTION — MAIN EXPORT ============================================
export default function AboutSection({ setSelectedPage }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const isDesktop = useIsDesktop()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-32">
      <motion.div
        className="mx-auto max-w-7xl px-6 lg:px-8"
        onViewportEnter={() => setSelectedPage(SelectedPage.About)}
      >
        <div className="max-w-2xl">
          <SceneHeader
            eyebrow="How it works"
            title={
              <>
                Three{" "}
                <span className="text-sky-600 dark:text-sky-500">simple</span>{" "}
                steps
              </>
            }
            caption=""
          />
        </div>

        {/* DESKTOP LAYOUT — BARS GROW VERTICALLY FROM BOTTOM ============ */}
        {isDesktop ? (
          <div className="mt-20 flex flex-row items-end gap-8 h-[440px]">
            {steps.map((step, i) => (
              <DesktopBar
                key={step.number}
                step={step}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        ) : (
          /* MOBILE LAYOUT — BARS GROW HORIZONTALLY FROM LEFT ============ */
          <div className="mt-16 flex flex-col gap-4">
            {steps.map((step, i) => (
              <MobileBar
                key={step.number}
                step={step}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
