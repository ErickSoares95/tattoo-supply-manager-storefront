import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/server/session";

// POST /api/auth/logout - drops the session cookie (the JWT itself stays valid until it
// expires; the backend has no token revocation).
export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
