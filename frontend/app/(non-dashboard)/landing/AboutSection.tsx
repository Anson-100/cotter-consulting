"use client"
import { motion } from "framer-motion"
import { useRef, useSyncExternalStore } from "react"
import { SelectedPage } from "@/types"
import SceneHeader from "@/components/ui/scene-header"

type Props = {
  setSelectedPage: (value: SelectedPage) => void
}

const DESKTOP_QUERY = "(min-width: 1024px)"

function subscribeToDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY)
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  )
}

// ANIMATION TIMING — TWEAK THESE TWO LINES ===============================
const STAGGER = 0.12 // gap between each bar starting
const DURATION = 0.45 // how long a bar takes to grow
const TRIGGER = 0.05 // how much of the section must be visible to fire
// ========================================================================

const steps = [
  {
    number: "1",
    title: "Send the records",
    description:
      "Upload the file through a secure portal — medical records, imaging, depositions, billing. Any format, any volume.",
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
    title: "Clinical review",
    description:
      "A registered nurse reads every page. Timeline reconstruction, standard-of-care analysis, and identification of what the record does and doesn't support.",
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
    title: "Get your report",
    description:
      "A written chronology with cited page references, flagged deviations, and the clinical questions worth asking in deposition.",
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
// PLAYS ONCE WHEN THE SECTION ENTERS VIEW. THE BAR GROWS UPWARD FROM
// THE BOTTOM, STAGGERED BY INDEX, THEN STAYS PUT. NO SCROLL COUPLING.
// ========================================================================
function DesktopBar({
  step,
  index,
}: {
  step: (typeof steps)[number]
  index: number
}) {
  const barDelay = index * STAGGER
  const textDelay = barDelay + DURATION * 0.5

  return (
    // FIXED-HEIGHT TRANSPARENT PARENT — RESERVES SPACE, NEVER ANIMATES ===
    <div className="relative flex-1" style={{ height: step.maxHeight }}>
      {/* ANIMATED COLORED BAR — GROWS FROM BOTTOM UP ==================== */}
      {/* THE STEP NUMBER RIDES INSIDE SO IT TRAVELS WITH THE TOP EDGE === */}
      <motion.div
        initial={{ height: 80, opacity: 0.4 }}
        whileInView={{ height: step.maxHeight, opacity: 1 }}
        viewport={{ once: true, amount: TRIGGER }}
        transition={{
          duration: DURATION,
          delay: barDelay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`absolute right-0 bottom-0 left-0 overflow-hidden rounded-t-2xl ${step.bg}`}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: TRIGGER }}
          transition={{ duration: 0.3, delay: barDelay + 0.05 }}
          className={`p-8 font-serif text-5xl tracking-tight ${step.numberColor}`}
        >
          {step.number}
        </motion.p>
      </motion.div>

      {/* FIXED-POSITION TEXT LAYER — PINNED TO BOTTOM, NEVER MOVES ====== */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: TRIGGER }}
        transition={{ duration: 0.35, delay: textDelay }}
        className="pointer-events-none absolute right-0 bottom-0 left-0 p-8"
      >
        <p className={`font-serif text-xl  tracking-tight ${step.titleColor}`}>
          {step.title}
        </p>
        <p className={`mt-2 font-serif text-lg ${step.descColor}`}>
          {step.description}
        </p>
      </motion.div>
    </div>
  )
}

// MOBILE BAR =============================================================
// SAME BEHAVIOR, HORIZONTAL. GROWS IN WIDTH FROM THE LEFT, ONCE.
// ========================================================================
function MobileBar({
  step,
  index,
}: {
  step: (typeof steps)[number]
  index: number
}) {
  const barDelay = index * STAGGER
  const textDelay = barDelay + DURATION * 0.5

  return (
    <div className="relative w-full" style={{ height: step.mobileHeight }}>
      {/* ANIMATED COLORED BAR — GROWS LEFT TO RIGHT ===================== */}
      <motion.div
        initial={{ width: "30%", opacity: 0.4 }}
        whileInView={{ width: step.widthPercent, opacity: 1 }}
        viewport={{ once: true, amount: TRIGGER }}
        transition={{
          duration: DURATION,
          delay: barDelay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ height: step.mobileHeight }}
        className={`absolute top-0 bottom-0 left-0 overflow-hidden rounded-r-2xl ${step.bg}`}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: TRIGGER }}
          transition={{ duration: 0.3, delay: barDelay + 0.05 }}
          className={`p-6 font-serif text-4xl tracking-tight ${step.numberColor}`}
        >
          {step.number}
        </motion.p>
      </motion.div>

      {/* FIXED-POSITION TEXT LAYER — CONSTRAINED TO BAR'S FINAL WIDTH === */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: TRIGGER }}
        transition={{ duration: 0.35, delay: textDelay }}
        style={{ width: step.widthPercent }}
        className="pointer-events-none absolute bottom-0 left-0 p-6"
      >
        <p className={`font-serif text-lg  tracking-tight ${step.titleColor}`}>
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

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-32 h-screen">
      <motion.div
        className="mx-auto max-w-7xl px-6 lg:px-8"
        onViewportEnter={() => setSelectedPage(SelectedPage.About)}
      >
        <div className="max-w-2xl">
          <SceneHeader
            eyebrow="How it works"
            title={
              <>
                <span className="text-indigo-600 dark:text-indigo-500">
                  Expertise
                </span>{" "}
                &{" "}
                <span className="text-indigo-600 dark:text-indigo-500">
                  transparency
                </span>{" "}
              </>
            }
            caption=""
          />
        </div>

        {/* DESKTOP LAYOUT — BARS GROW VERTICALLY FROM BOTTOM ============ */}
        {isDesktop ? (
          <div className="mt-32 flex h-[440px] flex-row items-end gap-8">
            {steps.map((step, i) => (
              <DesktopBar key={step.number} step={step} index={i} />
            ))}
          </div>
        ) : (
          /* MOBILE LAYOUT — BARS GROW HORIZONTALLY FROM LEFT ============ */
          <div className="mt-16 flex flex-col gap-4">
            {steps.map((step, i) => (
              <MobileBar key={step.number} step={step} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
