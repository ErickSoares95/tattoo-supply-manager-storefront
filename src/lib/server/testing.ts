// Test-only helpers for the server-side BFF tests.

/** An unsigned JWT-shaped string whose payload has the given "exp" (seconds since epoch). */
export function fakeJwt(exp: number): string {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256" })}.${encode({ sub: "client@demo.com", exp })}.signature`;
}

/** A Response like the backend would send, for stubbing global fetch. */
export function backendResponse(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
