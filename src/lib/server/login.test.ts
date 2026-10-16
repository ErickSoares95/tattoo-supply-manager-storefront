// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { loginThroughBackend } from "@/lib/server/login";
import { SESSION_COOKIE } from "@/lib/server/session";
import { backendResponse, fakeJwt } from "@/lib/server/testing";

function loginRequest() {
  return new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ login: "client@demo.com", password: "Demo@Client123" }),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loginThroughBackend", () => {
  it("stores the JWT in an HttpOnly cookie and never returns it to the browser", async () => {
    const token = fakeJwt(Math.floor(Date.now() / 1000) + 3600);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        backendResponse(200, {
          token,
          userId: 13,
          fullName: "Demo Client",
          email: "client@demo.com",
          userType: "CLIENT",
          imageUrl: null,
        }),
      ),
    );

    const response = await loginThroughBackend(loginRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      userId: 13,
      fullName: "Demo Client",
      email: "client@demo.com",
      userType: "CLIENT",
      imageUrl: null,
    });
    expect(JSON.stringify(body)).not.toContain(token);

    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain(`${SESSION_COOKIE}=${token}`);
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("samesite=lax");
  });

  it("relays the backend's error and sets no cookie on bad credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(backendResponse(401, { status: 401, message: "Invalid login or password", errors: null })),
    );

    const response = await loginThroughBackend(loginRequest());

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ message: "Invalid login or password" });
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
