export default function GridBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full stroke-zinc-300 mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] dark:stroke-zinc-800"
      >
        <defs>
          {/* 200x200 cells. Change width/height to resize the grid. */}
          <pattern
            x="50%"
            y={-1}
            id="grid-pattern"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>

        {/* Filled cells — the scattered blocks. Each entry is one square. */}
        <svg
          x="50%"
          y={-1}
          className="overflow-visible fill-zinc-200 dark:fill-zinc-900"
        >
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>

        <rect
          fill="url(#grid-pattern)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>
    </div>
  )
}
