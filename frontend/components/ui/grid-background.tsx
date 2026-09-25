const TILE_COLOR = "#616c64"

const TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect x='2' y='3' width='24' height='14' rx='4' fill='${encodeURIComponent(TILE_COLOR)}'/%3E%3C/svg%3E")`

// Diagonal bands where tiles show through.
// angle = band direction, at = band center (% across), width = half-width of the fade
const BANDS = [
  { angle: 115, at: 12, width: 10 },
  { angle: 115, at: 38, width: 8 },
  { angle: 115, at: 62, width: 12 },
  { angle: 115, at: 90, width: 9 },
]

const BAND_MASK = BANDS.map(
  ({ angle, at, width }) =>
    `linear-gradient(${angle}deg, transparent ${at - width}%, black ${at}%, transparent ${at + width}%)`,
).join(", ")

// Fades the whole grid out toward the bottom
const VERTICAL_FADE =
  "linear-gradient(to bottom, black 0%, black 40%, transparent 75%)"

export default function GridBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-zinc-100 dark:bg-zinc-950"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{ maskImage: VERTICAL_FADE, WebkitMaskImage: VERTICAL_FADE }}
      >
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.15]"
          style={{
            backgroundImage: TILE,
            backgroundRepeat: "repeat",
            backgroundSize: "32px 20px",
            maskImage: BAND_MASK,
            WebkitMaskImage: BAND_MASK,
          }}
        />
      </div>
    </div>
  )
}
