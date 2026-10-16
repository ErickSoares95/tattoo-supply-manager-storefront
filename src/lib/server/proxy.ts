import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, backendBaseUrl, errorJson } from "@/lib/server/session";

const SAFE_METHODS = new Set(["GET", "HEAD"]);

/**
 * Defense in depth on top of SameSite=Lax: a state-changing request must come from this
 * storefront's own origin. Browsers always send Origin on cross-site fetches, so a missing
 * header is treated as same-origin.
 */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Forwards /api/backend/<path> to the Spring Boot API with the session cookie's JWT as a
 * Bearer token, and relays status and body unchanged. A 401 from the backend (expired or
 * revoked token) also clears the cookie, so the browser stops sending a dead session.
 */
export async function proxyToBackend(request: NextRequest, path: string[]): Promise<Response> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return errorJson(401, "Authentication required");
  }

  if (!SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
    return errorJson(403, "Cross-origin request rejected");
  }

  if (path.some((segment) => segment === "." || segment === "..")) {
    return errorJson(400, "Invalid path");
  }

  const target = `${backendBaseUrl()}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  const upstream = await fetch(target, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": request.headers.get("content-type") ?? "application/json",
    },
    body: SAFE_METHODS.has(request.method) ? undefined : await request.text(),
    cache: "no-store",
  });

  const text = await upstream.text();
  const response = new NextResponse(text || null, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });

  if (upstream.status === 401) {
    response.cookies.delete(SESSION_COOKIE);
  }

  return response;
}
