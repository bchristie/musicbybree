import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const isLoginPage = pathname === "/admin/login"
  const isAdminRoute = pathname.startsWith("/admin") && !isLoginPage

  // Redirect to login if accessing admin routes without authentication
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js|workbox-.*|manifest.json).*)"],
}
