import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh the session
  try {
    await supabase.auth.getUser()
  } catch (error) {
    console.error("Middleware auth check failed:", error)
  }

  // Security headers
  supabaseResponse.headers.set("X-Frame-Options", "DENY")
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff")
  supabaseResponse.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  )
  supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block")
  supabaseResponse.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  )
  supabaseResponse.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  )
  supabaseResponse.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.supabase.co; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com; frame-src https://js.stripe.com;",
  )

  return supabaseResponse
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signup/:path*",
    "/reset-password",
    "/api/:path*",
  ],
}
