import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isLoginPage = pathname === "/admin/login"
  const isAdminRoute = pathname.startsWith("/admin") && !isLoginPage

  // For admin routes, check if there's a session token
  if (isAdminRoute) {
    const sessionToken = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token")
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  // Redirect to dashboard if accessing login with a session token
  if (isLoginPage) {
    const sessionToken = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token")
    
    if (sessionToken) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

