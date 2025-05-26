import { NextResponse, NextRequest } from "next/server";
import * as cookie from "cookie";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH && process.env.NEXT_PUBLIC_BASE_PATH !== "/"
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "";

export function middleware(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const url = new URL(req.url);
  // check if the user type on cookies is staff or admin
  const userFromCookie = cookies.user; // Default to 'guest' if not set
  const user = userFromCookie ? JSON.parse(userFromCookie) : null;
  
  if (!cookies.token) {
    if (!url.pathname.startsWith(`${basePath}/auth/signin`)) {
      return NextResponse.redirect(new URL(`${basePath}/auth/signin`, req.url));
    }
  } else {
    if (url.pathname.startsWith(`${basePath}/auth/signin`)) {
      return NextResponse.redirect(
        new URL(
          `${user.user_type == "admin" ? `${basePath}/customers-link` : `${basePath}/customers/add`}`,
          req.url,
        ),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/signin", "/customers", "/", "/agents", "/settings"],
};
