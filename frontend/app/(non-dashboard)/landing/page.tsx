"use client"

import HeroSection from "./HeroSection"
import LogoCloudSection from "./LogoCloudSection"
import FeaturesSection from "./FeaturesSection"
// import PricingSection from "./PricingSection"
import AboutSection from "./AboutSection"
import ContactSection from "./ContactSection"
import FooterSection from "./FooterSection"
import { useScrollSpy } from "@/hooks/useScrollSpy"

export default function LandingPage() {
  useScrollSpy()

  return (
    <div className="">
      <HeroSection />
      <LogoCloudSection />
      <AboutSection />
      <FeaturesSection />
      {/* <PricingSection /> */}
      <ContactSection />
      <FooterSection />
    </div>
  )
}
