"use client"

import HeroSection from "./HeroSection"
import LogoCloudSection from "./LogoCloudSection"
import FeaturesSection from "./FeaturesSection"
// import PricingSection from "./PricingSection"
import AboutSection from "./AboutSection"
import FooterSection from "./FooterSection"
import { useSelectedPageStore } from "@/lib/useSelectedPageStore"

export default function LandingPage() {
  const { setSelectedPage } = useSelectedPageStore()

  return (
    <div className="">
      <HeroSection setSelectedPage={setSelectedPage} />
      <LogoCloudSection setSelectedPage={setSelectedPage} />
      <AboutSection setSelectedPage={setSelectedPage} />
      <FeaturesSection setSelectedPage={setSelectedPage} />
      {/* <PricingSection setSelectedPage={setSelectedPage} /> */}
      <FooterSection setSelectedPage={setSelectedPage} />
    </div>
  )
}
