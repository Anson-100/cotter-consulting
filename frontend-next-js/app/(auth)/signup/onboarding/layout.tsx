"use client"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Top progress bar or nav */}

      {/* Step content */}
      <main className="flex-1 flex justify-center items-center">
        {children}
      </main>
    </div>
  )
}
