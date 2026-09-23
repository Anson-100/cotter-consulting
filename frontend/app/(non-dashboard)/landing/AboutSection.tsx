import { CheckIcon } from "@heroicons/react/20/solid"
import SceneHeader from "@/components/ui/scene-header"

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit aute id magna aliqua ad ad non deserunt sunt."

// SHARED — IDENTICAL ON EVERY CARD
const cardBase =
  "shadow-md flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl p-8 sm:flex-row-reverse sm:items-end lg:flex-col lg:items-start"
const cardBody = "sm:w-80 sm:shrink lg:w-auto lg:flex-none"

// SANS — METRIC AND TITLE ARE STRUCTURAL
const metricClass = "flex-none text-6xl font-semibold tracking-tight"
const titleClass = "text-xl font-semibold tracking-tight"

// SERIF — PROSE ONLY, SAME SIZE AS THE ABOUT PAGE
const descClass = "mt-3 font-serif text-lg/8"

// PER-CARD — SIZING AND THEME ONLY
const stats = [
  {
    metric: "24 hrs",
    title: "Response time",
    description: "Every inquiry gets a reply within one business day.",
    card: "bg-gray-50 ring-1 ring-gray-900/5 sm:w-3/4 sm:max-w-md lg:w-72 lg:max-w-none lg:flex-none dark:bg-zinc-800/60 dark:ring-white/10",
    heading: "text-gray-700 dark:text-gray-100",
    desc: "text-gray-700 dark:text-gray-200",
  },
  {
    metric: "5,000+",
    title: "Pages per case",
    description:
      "No volume cap. Complex, multi-provider record sets are the norm, not the exception.",
    card: "bg-cyberspace ring-1 ring-white/10 lg:w-full lg:max-w-sm lg:flex-auto lg:gap-y-44",
    heading: "text-gray-100",
    desc: "text-gray-200",
  },
  {
    metric: "12 yrs",
    title: "At the bedside",
    description:
      "Two decades of ICU and emergency nursing behind every standard-of-care opinion.",
    card: "bg-indigo-600 sm:w-11/12 sm:max-w-xl lg:w-full lg:max-w-none lg:flex-auto lg:gap-y-28",
    heading: "text-gray-100",
    desc: "text-gray-200",
  },
]

const features = [
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
]

export default function AboutSection() {
  return (
    <section id="about" className="pt-16 pb-32 scroll-mt-[70px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl sm:pb-16">
          <SceneHeader
            icon="briefcase"
            eyebrow="Services"
            title={<>Expertise & transparency</>}
            caption=""
          />
        </div>

        {/* STAT CARDS ================================================== */}
        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
          {stats.map((stat) => (
            <div key={stat.title} className={`${cardBase} ${stat.card}`}>
              <p className={`${metricClass} ${stat.heading}`}>{stat.metric}</p>
              <div className={cardBody}>
                <p className={`${titleClass} ${stat.heading}`}>{stat.title}</p>
                <p className={`${descClass} ${stat.desc}`}>
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SERVICES — 3x2 CHECKLIST ==================================== */}
        <dl className="mx-auto mt-24 grid max-w-2xl grid-cols-1 gap-8 font-serif text-lg/8 text-gray-700 sm:mt-28 sm:grid-cols-2 lg:mx-0 lg:mt-32 lg:max-w-none lg:grid-cols-3 lg:gap-x-16 dark:text-gray-300">
          {features.map((feature, i) => (
            <div key={i} className="relative pl-9">
              <dt className="inline font-sans font-semibold text-gray-900 dark:text-white">
                <CheckIcon
                  aria-hidden="true"
                  className="absolute top-2 left-1 size-5 text-indigo-600 dark:text-indigo-500"
                />
                {feature.name}
              </dt>{" "}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
