import { CheckIcon } from "@heroicons/react/20/solid"
import SceneHeader from "@/components/ui/scene-header"

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit aute id magna aliqua ad ad non deserunt sunt."

const stats = [
  { metric: "00", title: "How you work", description: LOREM },
  { metric: "00%", title: "How you work", description: LOREM },
  { metric: "00 hrs", title: "How you work", description: LOREM },
]

const features = [
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
  { name: "Service name.", description: LOREM },
]

// SANS — METRIC AND TITLE ARE STRUCTURAL
const metricClass = "flex-none text-6xl font-semibold tracking-tight"
const titleClass = "text-xl font-semibold tracking-tight"

// SERIF — PROSE ONLY, SAME SIZE AS THE ABOUT PAGE
const descClass = "mt-3 font-serif text-lg/8"

export default function AboutSection() {
  return (
    <section id="about" className="py-24 scroll-mt-[70px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SceneHeader
            eyebrow="How it works"
            title={
              <>
                <span className="text-succulent dark:text-succulent">
                  Expertise
                </span>{" "}
                &{" "}
                <span className="text-succulent dark:text-succulent">
                  transparency
                </span>{" "}
              </>
            }
            caption=""
          />
        </div>

        {/* STAT CARDS ================================================== */}
        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
          {/* CARD 1 — LIGHT */}
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 ring-1 ring-gray-900/5 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start dark:bg-zinc-800/60 dark:ring-white/10">
            <p className={`${metricClass} text-gray-900 dark:text-white`}>
              {stats[0].metric}
            </p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className={`${titleClass} text-gray-900 dark:text-white`}>
                {stats[0].title}
              </p>
              <p className={`${descClass} text-gray-700 dark:text-gray-300`}>
                {stats[0].description}
              </p>
            </div>
          </div>

          {/* CARD 2 — DARK */}
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 ring-1 ring-white/10 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44 dark:bg-zinc-900">
            <p className={`${metricClass} text-white`}>{stats[1].metric}</p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className={`${titleClass} text-white`}>{stats[1].title}</p>
              <p className={`${descClass} text-gray-300`}>
                {stats[1].description}
              </p>
            </div>
          </div>

          {/* CARD 3 — SUCCULENT */}
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-succulent p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
            <p className={`${metricClass} text-white`}>{stats[2].metric}</p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className={`${titleClass} text-white`}>{stats[2].title}</p>
              <p className={`${descClass} text-succulent`}>
                {stats[2].description}
              </p>
            </div>
          </div>
        </div>

        {/* SERVICES — 3x2 CHECKLIST ==================================== */}
        <dl className="mx-auto mt-24 grid max-w-2xl grid-cols-1 gap-8 font-serif text-lg/8 text-gray-700 sm:mt-28 sm:grid-cols-2 lg:mx-0 lg:mt-32 lg:max-w-none lg:grid-cols-3 lg:gap-x-16 dark:text-gray-300">
          {features.map((feature, i) => (
            <div key={i} className="relative pl-9">
              <dt className="inline font-sans font-semibold text-gray-900 dark:text-white">
                <CheckIcon
                  aria-hidden="true"
                  className="absolute top-2 left-1 size-5 text-succulent dark:text-succulent"
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
