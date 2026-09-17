export default function GridBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[40vw] leading-none font-bold tracking-tight text-zinc-300/20 dark:text-zinc-900/20"></span>
    </div>
  )
}
