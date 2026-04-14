import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Server-side: no storage config needed
  if (typeof window === "undefined") {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  const rememberMe = localStorage.getItem("rememberMe") === "true"

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: rememberMe ? localStorage : sessionStorage,
      },
    },
  )
}
