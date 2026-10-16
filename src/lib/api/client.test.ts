import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch, bffFetch } from "@/lib/api/client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("client", () => {
  it("sends authenticated calls to the same-origin BFF, never with an Authorization header", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await bffFetch("/orders");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/backend/orders");
    expect(init.headers).not.toHaveProperty("Authorization");
  });

  it("throws ApiError with the backend's message and status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: 409, message: "Order already has an approved payment: 7", errors: null }), {
          status: 409,
        }),
      ),
    );

    const error = (await apiFetch("/orders/7/payments").catch((e) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(409);
    expect(error.message).toBe("Order already has an approved payment: 7");
  });

  it("treats an empty 2xx body as undefined", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 200 })));

    await expect(bffFetch("/notifications/reprocess", { method: "POST" })).resolves.toBeUndefined();
  });
});
