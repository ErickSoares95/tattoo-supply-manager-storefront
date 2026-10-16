// Server-only helpers for the BFF session. The backend's JWT lives in an HttpOnly cookie on
// the storefront's own origin, so client-side JavaScript (and therefore an XSS payload)
// can never read it - the Route Handlers under src/app/api attach it to backend calls.

export const SESSION_COOKIE = "tsm_session";

// Backend JWTs last 24h by default (JWT_EXPIRATION); used only if the token can't be decoded.
const FALLBACK_MAX_AGE_SECONDS = 24 * 60 * 60;

export function backendBaseUrl(): string {
  // Same variable the rest of the app uses, so the Vercel config doesn't change.
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
}

/**
 * Cookie lifetime matching the token's own "exp" claim, so the cookie never outlives the JWT.
 * The token is only decoded, not verified - verification is the backend's job on every call.
 */
export function sessionMaxAgeSeconds(jwt: string, nowMs: number = Date.now()): number {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString("utf8"));
    if (typeof payload.exp === "number") {
      return Math.max(0, Math.floor(payload.exp - nowMs / 1000));
    }
  } catch {
    // Malformed token: fall through to the default lifetime.
  }
  return FALLBACK_MAX_AGE_SECONDS;
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    // Secure only in production: local dev runs on plain http://localhost.
    secure: process.env.NODE_ENV === "production",
    // Lax: the cookie is not sent on cross-site POST/PUT/DELETE, which is the CSRF protection.
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/** Error body in the backend's {status, message, errors} shape, so ApiError parses it the same way. */
export function errorJson(status: number, message: string): Response {
  return Response.json({ status, message, errors: null }, { status });
}
