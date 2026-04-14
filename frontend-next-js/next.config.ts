import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.rsmeans.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "https", hostname: "tailwindcss.com" },
      { protocol: "https", hostname: "www.chas.co.uk" },
      { protocol: "https", hostname: "ynmiswjkehuwnnyambeu.supabase.co" },
    ],
  },
}

export default nextConfig
