import type { NextRequest } from "next/server";
import { loginThroughBackend } from "@/lib/server/login";

// POST /api/auth/login - see loginThroughBackend: the JWT stays in an HttpOnly cookie.
export async function POST(request: NextRequest) {
  return loginThroughBackend(request);
}
