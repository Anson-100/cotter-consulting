export default function GridBackground() {
  const noiseUrl = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Full page grain */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{ backgroundImage: noiseUrl }}
      />

      {/* Scattered grain squares */}
      {[
        { x: 5, y: 10, size: 80 },
        { x: 75, y: 5, size: 60 },
        { x: 20, y: 45, size: 50 },
        { x: 85, y: 40, size: 70 },
        { x: 45, y: 75, size: 55 },
        { x: 10, y: 80, size: 65 },
        { x: 60, y: 60, size: 45 },
        { x: 35, y: 20, size: 50 },
      ].map((sq, i) => (
        <div
          key={i}
          className="absolute rounded-sm opacity-[0.06] dark:opacity-[0.08]"
          style={{
            left: `${sq.x}%`,
            top: `${sq.y}%`,
            width: sq.size,
            height: sq.size,
            backgroundImage: noiseUrl,
          }}
        />
      ))}
    </div>
  )
}
