const LIGHT_TILE_COLOR = "#44484d"
const DARK_TILE_COLOR = "#44484d"

// Brightness / intensity knobs: 0 = invisible, 1 = full strength
const LIGHT_TILE_OPACITY = 0.05
const DARK_TILE_OPACITY = 0.15

const createTile = (color: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect x='2' y='3' width='24' height='14' rx='4' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E")`

const LIGHT_TILE = createTile(LIGHT_TILE_COLOR)
const DARK_TILE = createTile(DARK_TILE_COLOR)

const patches = [
  "left-[-40px] top-[22%] h-[220px] w-[430px]",
  "left-[430px] top-[30%] h-[300px] w-[500px]",
  "right-[-30px] top-[20%] h-[220px] w-[430px]",
  "left-[44%] top-[42%] h-[260px] w-[430px]",
]

export default function GridBackground() {
  return (
    <div
      className="pointer-events-none inset-0 -z-10 overflow-hidden bg-[#f7f6f2] dark:bg-zinc-950"
      aria-hidden="true"
    >
      {patches.map((className, index) => (
        <div
          key={index}
          className={`absolute ${className} dark:hidden`}
          style={{
            opacity: LIGHT_TILE_OPACITY,
            backgroundImage: LIGHT_TILE,
            backgroundRepeat: "repeat",
            maskImage:
              "radial-gradient(ellipse at center, black 15%, rgba(0,0,0,.7) 45%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 15%, rgba(0,0,0,.7) 45%, transparent 78%)",
          }}
        />
      ))}

      {patches.map((className, index) => (
        <div
          key={index}
          className={`absolute hidden ${className} dark:block`}
          style={{
            opacity: DARK_TILE_OPACITY,
            backgroundImage: DARK_TILE,
            backgroundRepeat: "repeat",
            maskImage:
              "radial-gradient(ellipse at center, black 15%, rgba(0,0,0,.7) 45%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 15%, rgba(0,0,0,.7) 45%, transparent 78%)",
          }}
        />
      ))}
    </div>
  )
}
