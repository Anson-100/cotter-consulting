"use client"

import { ThemeProvider } from "next-themes"
import { AuthModalProvider } from "@/hooks/useAuthModal"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <AuthModalProvider>{children}</AuthModalProvider>
    </ThemeProvider>
  )
}
