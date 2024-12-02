import { NextResponse, NextRequest } from "next/server";
import * as cookie from "cookie";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH && process.env.NEXT_PUBLIC_BASE_PATH !== "/"
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "";

export function middleware(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || ""); 
  const url = new URL(req.url);


  if (!cookies.token) {
    if (!url.pathname.startsWith(`${basePath}/auth/signin`)) {
      return NextResponse.redirect(new URL("/admin/auth/signin", req.url));
    }
  } else {
 
    if (url.pathname.startsWith(`${basePath}/auth/signin`)) {
      return NextResponse.redirect(new URL(`${basePath}/`, req.url));
    }
  }


  return NextResponse.next(); 
}

export const config = {
  matcher: ["/auth/signin", "/customers", "/", "/agents", "/settings"], 
};
