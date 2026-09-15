import SceneHeader from "@/components/ui/scene-header"

const stats = [
  { label: "Credential", value: "BSN" },
  { label: "License", value: "RN" },
  { label: "Certification", value: "LNC" },
  { label: "Experience", value: "12 yrs" },
]

// ONE CLASS FOR ALL SERIF PROSE — SIZE AND COLOR LIVE HERE ONLY
const prose = "font-serif text-lg/8 text-gray-700 dark:text-gray-300"

export default function FeaturesSection() {
  return (
    <div
      id="features"
      className="overflow-hidden py-24 min-h-screen scroll-mt-[70px]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SceneHeader
          eyebrow="Features"
          title={
            <>
              About
              <span className="text-indigo-600 dark:text-indigo-500 "></span>
            </>
          }
          caption=""
        />

        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* PROSE + STATS — FIRST ON MOBILE, RIGHT COLUMN ON DESKTOP == */}
          <div className="lg:order-2 lg:pl-4">
            <h3 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white">
              Lorem ipsum
            </h3>
            <div className="max-w-xl">
              <p className={`mt-6 ${prose}`}>
                Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
                risus enim. Mattis mauris semper sed amet vitae sed turpis id.
                Id dolor praesent donec est. Odio penatibus risus viverra tellus
                varius sit neque erat velit. Faucibus commodo massa rhoncus,
                volutpat. Dignissim sed eget risus enim.
              </p>
              <p className={`mt-8 ${prose}`}>
                Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis
                odio id et. Id blandit molestie auctor fermentum dignissim.
                Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate
                et ultrices hac adipiscing egestas.
              </p>
            </div>

            {/* STATS — ALL SANS ======================================== */}
            <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-gray-900/10 pt-10 sm:grid-cols-4 dark:border-white/10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-4xl/10 font-semibold tracking-tight text-gray-900 dark:text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* PORTRAIT PANEL — SECOND ON MOBILE, LEFT COLUMN ON DESKTOP = */}
          <div className="lg:order-1 lg:pr-4">
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 pt-72 pb-9 shadow-2xl sm:px-12 sm:pt-96 lg:max-w-lg lg:px-8 lg:pt-80 lg:pb-8 xl:px-10 xl:pb-10">
              <img
                alt="RaeAnna Cotter"
                src="/images/about-image.png"
                className="absolute inset-0 size-full rounded-3xl object-cover object-top grayscale"
              />

              {/* FADE — TRANSPARENT AT TOP, SOLID AT BOTTOM ============ */}
              <div className="absolute inset-x-0 bottom-0 h-3/5 rounded-b-3xl bg-gradient-to-t from-black via-black/80 to-transparent" />

              {/* QUOTE ================================================= */}
              <figure className="relative isolate">
                <blockquote className="font-serif text-xl/8 text-balance text-white">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
                  eiusmod tempor.
                </blockquote>
                <figcaption className="mt-6 text-sm/6 text-gray-300">
                  <strong className="font-semibold text-white">
                    Name goes here,
                  </strong>{" "}
                  Credential goes here
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
