import type { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/server/proxy";

// Authenticated calls from client components go through here (same origin, session cookie)
// instead of straight to the backend - see proxyToBackend.
type Context = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, { params }: Context) {
  const { path } = await params;
  return proxyToBackend(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
