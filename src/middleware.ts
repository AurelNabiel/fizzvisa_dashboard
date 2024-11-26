import { NextResponse, NextRequest } from "next/server";
import * as cookie from "cookie";

export function middleware(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || ""); 
  const url = new URL(req.url);
  


  if (!cookies.token) {
    if (!url.pathname.startsWith("/auth/signin")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  } else {
 
    if (url.pathname.startsWith("/auth/signin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }


  return NextResponse.next(); 
}

export const config = {
  matcher: ["/auth/signin", "/"], 
};
