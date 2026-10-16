import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, backendBaseUrl, sessionCookieOptions, sessionMaxAgeSeconds } from "@/lib/server/session";

/**
 * Logs in against the backend and keeps the JWT server-side: the token goes into the
 * HttpOnly session cookie and the browser only receives the profile fields.
 */
export async function loginThroughBackend(request: NextRequest): Promise<Response> {
  const upstream = await fetch(`${backendBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
    cache: "no-store",
  });

  const body = await upstream.json().catch(() => null);

  if (!upstream.ok || !body?.token) {
    return NextResponse.json(
      body ?? { status: upstream.status, message: "Login failed", errors: null },
      { status: upstream.ok ? 502 : upstream.status },
    );
  }

  const { token, ...user } = body;
  const response = NextResponse.json(user);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(sessionMaxAgeSeconds(token)));
  return response;
}
