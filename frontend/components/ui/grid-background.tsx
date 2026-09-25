// ═══ KNOBS ═══════════════════════════════════════════════

// Tile color + strength per mode (opacity: 0 = invisible, 1 = solid)
const LIGHT = { tileColor: "#616c64", opacity: 0.075 }
const DARK = { tileColor: "#616c64", opacity: 0.15 }

// Page background behind the tiles (full Tailwind classes)
const BG = "bg-zinc-100 dark:bg-zinc-950"

// Tile shape + spacing (px)
const TILE = { width: 24, height: 14, radius: 4, gapX: 8, gapY: 6 }

// Diagonal bands where tiles show through
// angle = direction, at = band center (% across), width = fade half-width
const BANDS = [
  { angle: 115, at: 12, width: 10 },
  { angle: 115, at: 38, width: 8 },
  { angle: 115, at: 62, width: 12 },
  { angle: 115, at: 90, width: 9 },
]

// Vertical fade: fully visible until `solidUntil`%, gone by `goneAt`%
const FADE = { solidUntil: 40, goneAt: 75 }

// ═════════════════════════════════════════════════════════

const CELL_W = TILE.width + TILE.gapX
const CELL_H = TILE.height + TILE.gapY

const tileImage = (color: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${CELL_W}' height='${CELL_H}' viewBox='0 0 ${CELL_W} ${CELL_H}'%3E%3Crect x='${TILE.gapX / 2}' y='${TILE.gapY / 2}' width='${TILE.width}' height='${TILE.height}' rx='${TILE.radius}' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E")`

const BAND_MASK = BANDS.map(
  ({ angle, at, width }) =>
    `linear-gradient(${angle}deg, transparent ${at - width}%, black ${at}%, transparent ${at + width}%)`,
).join(", ")

const VERTICAL_FADE = `linear-gradient(to bottom, black 0%, black ${FADE.solidUntil}%, transparent ${FADE.goneAt}%)`

const LAYERS = [
  { key: "light", mode: LIGHT, className: "dark:hidden" },
  { key: "dark", mode: DARK, className: "hidden dark:block" },
]

export default function GridBackground() {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${BG}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{ maskImage: VERTICAL_FADE, WebkitMaskImage: VERTICAL_FADE }}
      >
        {LAYERS.map(({ key, mode, className }) => (
          <div
            key={key}
            className={`absolute inset-0 ${className}`}
            style={{
              opacity: mode.opacity,
              backgroundImage: tileImage(mode.tileColor),
              backgroundRepeat: "repeat",
              backgroundSize: `${CELL_W}px ${CELL_H}px`,
              maskImage: BAND_MASK,
              WebkitMaskImage: BAND_MASK,
            }}
          />
        ))}
      </div>
    </div>
  )
}
