export default function NavShell({ children }: { children?: React.ReactNode }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 z-40">
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </nav>
  )
}
