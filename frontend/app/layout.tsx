import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Providers from "./providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Cotter Consulting",
  description: "Professional estimates, delivered instantly.",
  openGraph: {
    title: "Legal Nurse Consulting",
    description: "Clinical clarity, case confidence.",
    type: "website",
    siteName: "Cotter Consulting",
  },
  twitter: {
    card: "summary_large_image",
    title: "You've received an estimate",
    description: "Tap to view your estimate and respond.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
