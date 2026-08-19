import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token");

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
