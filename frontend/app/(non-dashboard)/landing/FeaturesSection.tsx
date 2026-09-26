import SceneHeader from "@/components/ui/scene-header"

const stats = [
  { label: "Credential", value: "BSN" },
  { label: "License", value: "RN" },
  { label: "Certification", value: "LNC" },
  { label: "Experience", value: "12 yrs" },
]

// ONE CLASS FOR ALL SERIF PROSE — SIZE AND COLOR LIVE HERE ONLY
const prose = "font-serif text-lg/8 text-gray-700 dark:text-gray-300"

// SAME TINT AS THE HERO
const HUE = "#243F5B"

// FAST FADE — SOLID AT THE BOTTOM, GONE BY A THIRD OF THE WAY UP
const PANEL_FADE = `linear-gradient(to top, ${HUE} 0%, ${HUE}d9 12%, ${HUE}73 24%, ${HUE}00 34%)`

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="overflow-hidden pt-16 pb-32 min-h-screen scroll-mt-[70px]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
        <div className="max-w-2xl sm:pb-16 flex">
          <SceneHeader
            icon="informationCircle"
            eyebrow="About"
            title={<>Clinical authority</>}
            caption=""
          />
        </div>
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* PORTRAIT PANEL — FIRST ON MOBILE, LEFT COLUMN ON DESKTOP == */}
          <div className="lg:pr-4">
            <div
              style={{ backgroundColor: HUE }}
              className="relative overflow-hidden -outline-offset-1 outline-black/10 rounded-3xl px-6 pt-72 pb-9 shadow-xl sm:px-12 sm:pt-96 lg:max-w-lg lg:px-8 lg:pt-80 lg:pb-8 xl:px-10 xl:pb-10"
            >
              <img
                alt="RaeAnna Cotter"
                src="https://unsplash.com/photos/7n2suA0AmjY/download?w=1600"
                className="absolute inset-0 size-full rounded-3xl object-cover object-top"
              />

              {/* FADE — SOLID AT BOTTOM, CLEAR BY A THIRD UP =========== */}
              <div
                style={{ backgroundImage: PANEL_FADE }}
                className="absolute inset-0 rounded-3xl"
              />

              {/* NAME + CREDENTIALS ==================================== */}
              <figcaption className="relative isolate">
                <p className="font-semibold text-gray-100">RaeAnna Cotter</p>
                <p className="mt-1 text-sm/6 text-gray-300">BSN, RN, LNC</p>
              </figcaption>
            </div>
          </div>

          {/* PROSE + STATS — SECOND ON MOBILE, RIGHT COLUMN ON DESKTOP = */}
          <div className="lg:pl-4">
            <h3 className="text-3xl font-semibold tracking-tight text-pretty text-gray-800 dark:text-gray-200">
              A nurse on your side of the table
            </h3>
            <div className="max-w-xl">
              <p className={`mt-6 ${prose}`}>
                Twelve years at the bedside in intensive care and emergency
                medicine. We know how a chart gets built, who writes what, and
                which gaps in a record actually matter.
              </p>
              <p className={`mt-8 ${prose}`}>
                That experience goes straight into your case file. Every finding
                is tied to a page and a date, written plainly enough to hand to
                a judge, a jury, or opposing counsel.
              </p>
              <p className={`mt-8 ${prose}`}>
                We work with plaintiff and defense firms across Florida, and we
                will tell you early and honestly when the records do not support
                the claim.
              </p>
            </div>

            {/* STATS — ALL SANS ======================================== */}
            <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-gray-900/10 pt-10 sm:grid-cols-4 dark:border-white/10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="mt-2 text-4xl/10 font-semibold tracking-tight text-gray-800 dark:text-gray-200">
                    {stat.value}
                  </dd>
                  <dt className="text-sm/6 font-semibold text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
