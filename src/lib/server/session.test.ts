// @vitest-environment node
import { describe, expect, it } from "vitest";
import { sessionCookieOptions, sessionMaxAgeSeconds } from "@/lib/server/session";
import { fakeJwt } from "@/lib/server/testing";

describe("sessionMaxAgeSeconds", () => {
  it("matches the token's remaining lifetime", () => {
    const now = 1_800_000_000_000;
    const token = fakeJwt(now / 1000 + 3600);

    expect(sessionMaxAgeSeconds(token, now)).toBe(3600);
  });

  it("never goes negative for an already expired token", () => {
    const now = 1_800_000_000_000;

    expect(sessionMaxAgeSeconds(fakeJwt(now / 1000 - 60), now)).toBe(0);
  });

  it("falls back to 24h when the token can't be decoded", () => {
    expect(sessionMaxAgeSeconds("not-a-jwt")).toBe(24 * 60 * 60);
  });
});

describe("sessionCookieOptions", () => {
  it("keeps the cookie away from JavaScript and cross-site requests", () => {
    const options = sessionCookieOptions(60);

    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
    expect(options.maxAge).toBe(60);
  });
});
