/**
 * CSRF Token Utilities
 * Handles reading CSRF tokens from document cookies
 */

/**
 * Retrieves the CSRF token from the document cookie
 * Used to validate requests to protected endpoints
 *
 * @returns The CSRF token string, or empty string if not found
 */
export function getCsrfToken(): string {
  if (typeof document === 'undefined') {
    return ''; // Server-side, no cookies available
  }

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrf-token") {
      return decodeURIComponent(value);
    }
  }
  return "";
}
