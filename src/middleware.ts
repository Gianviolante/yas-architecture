import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate CSRF token if not present
  const csrfToken = request.cookies.get("csrf-token")?.value || randomBytes(32).toString("hex");

  response.cookies.set("csrf-token", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, // 1 hour
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
