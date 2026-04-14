// ============================================================
// Shared types aligned with (landing) sections
// ============================================================

import { JSX } from "react"

export enum SelectedPage {
  Home = "home", // HeroSection
  Features = "features", // FeaturesSection
  Pricing = "pricing", // PricingSection
  About = "about", // AboutSection
  Contact = "contact", // ContactSection
  Footer = "footer", // FooterSection (optional, for scroll-to-bottom behavior)
}

// ---- Optional type for feature cards / benefits ----
export interface BenefitType {
  icon: JSX.Element
  title: string
  description: string
}

// ---- Optional reusable class/item type ----
export interface ClassType {
  name: string
  description?: string
  image: string
}
