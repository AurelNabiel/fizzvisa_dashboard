import { NextResponse } from "next/server";
import * as cookie from "cookie";

export function middleware(request: Request) {
  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const url = new URL(request.url);

  // If the token exists in cookies, redirect to home page if accessing login page
  if (cookies.token && url.pathname.startsWith("/auth/signin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If no token exists and trying to access protected pages, redirect to login page
  if (!cookies.token && !url.pathname.startsWith("/auth/signin")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/signin", "/dashboard/:path*"],
};
