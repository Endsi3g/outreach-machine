import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware to protect dashboard and onboarding routes.
 * Unauthenticated users are redirected to /login.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't need auth
  const publicRoutes = ["/", "/login", "/register", "/api/auth"]
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check auth session
  const session = await auth()

  if (!session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/api/ai/:path*",
    "/api/email/:path*",
    "/api/scrape/:path*",
    "/api/notifications/:path*",
    "/api/leads/:path*",
  ],
}
