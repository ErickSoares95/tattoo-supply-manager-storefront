// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/server/proxy";
import { SESSION_COOKIE, backendBaseUrl } from "@/lib/server/session";
import { backendResponse } from "@/lib/server/testing";

function request(path: string, init: { method?: string; headers?: Record<string, string>; body?: string } = {}) {
  return new NextRequest(`http://localhost:3000/api/backend/${path}`, {
    method: init.method ?? "GET",
    headers: init.headers,
    body: init.body,
  });
}

const withSession = { cookie: `${SESSION_COOKIE}=jwt-123` };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("proxyToBackend", () => {
  it("answers 401 without calling the backend when there is no session cookie", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxyToBackend(request("orders"), ["orders"]);

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ status: 401, message: "Authentication required" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards path, query and body with the cookie's JWT as a Bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(backendResponse(201, { id: 7 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxyToBackend(
      request("orders?page=1", {
        method: "POST",
        headers: { ...withSession, "content-type": "application/json" },
        body: JSON.stringify({ items: [{ productId: 1, quantity: 2 }] }),
      }),
      ["orders"],
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: 7 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${backendBaseUrl()}/orders?page=1`);
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer jwt-123");
    expect(init.body).toBe(JSON.stringify({ items: [{ productId: 1, quantity: 2 }] }));
  });

  it("rejects a state-changing request from another origin", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxyToBackend(
      request("users/5", {
        method: "DELETE",
        headers: { ...withSession, origin: "https://evil.example", "x-forwarded-host": "localhost:3000" },
      }),
      ["users", "5"],
    );

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts a state-changing request from its own origin", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(backendResponse(204)));

    const response = await proxyToBackend(
      request("users/5", {
        method: "DELETE",
        headers: { ...withSession, origin: "http://localhost:3000", "x-forwarded-host": "localhost:3000" },
      }),
      ["users", "5"],
    );

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
  });

  it("clears the session cookie when the backend rejects the token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(backendResponse(401, { status: 401, message: "Authentication required", errors: null })),
    );

    const response = await proxyToBackend(request("orders", { headers: withSession }), ["orders"]);

    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toContain(`${SESSION_COOKIE}=;`);
  });

  it("relays backend errors unchanged", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(backendResponse(403, { status: 403, message: "Access denied", errors: null })),
    );

    const response = await proxyToBackend(request("orders/9", { headers: withSession }), ["orders", "9"]);

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ message: "Access denied" });
  });

  it("refuses dot segments in the path", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxyToBackend(request("x", { headers: withSession }), ["..", "actuator"]);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
