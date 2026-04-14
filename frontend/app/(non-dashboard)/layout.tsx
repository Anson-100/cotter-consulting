import Navbar from "@/components/Navbar"
import AuthModal from "@/components/AuthModal"
import GridBackground from "@/components/ui/grid-background"
import { Suspense } from "react"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GridBackground />
      <Navbar />
      {children}
      <Suspense fallback={null}>
        <AuthModal />
      </Suspense>
    </>
  )
}
