import { NextRequest, NextResponse } from "next/server";

// Constants
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_MAX_AGE = 3600; // 1 hour in seconds

/**
 * Middleware for CSRF token generation and validation
 * Generates a new CSRF token for each session and stores it in an HttpOnly cookie
 * This protects against Cross-Site Request Forgery attacks
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate CSRF token if not present in cookies
  const csrfToken = request.cookies.get("csrf-token")?.value ||
    Array.from(crypto.getRandomValues(new Uint8Array(CSRF_TOKEN_LENGTH)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

  // Set CSRF token cookie (not HttpOnly so JavaScript can read it for form submission)
  response.cookies.set("csrf-token", csrfToken, {
    httpOnly: false, // Allow JavaScript access for form CSRF protection
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // Strict same-site policy
    maxAge: CSRF_TOKEN_MAX_AGE,
  });

  // CSP for Sanity Studio on /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity.com https://cdn.sanity.io; connect-src 'self' https://*.sanity.io https://api.sanity.io https://*.vercel.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; frame-src 'self';"
    );
  }

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
