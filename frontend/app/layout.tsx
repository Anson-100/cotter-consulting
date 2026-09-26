import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Providers from "./providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const siteName = "Cotter Consulting"
const defaultTitle = `${siteName} | Legal Nurse Consulting`
const description =
  "Medical record review, chronologies, and standard-of-care analysis for attorneys."

export const metadata: Metadata = {
  metadataBase: new URL("https://cotterlegalnurse.com"),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description,
  icons: {
    icon: "/images/cc-logo.png",
    apple: "/images/cc-logo.png",
  },
  openGraph: {
    title: defaultTitle,
    description,
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
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
