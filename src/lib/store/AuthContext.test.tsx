import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/store/AuthContext";

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

const profile = { userId: 13, fullName: "Demo Client", email: "client@demo.com", userType: "CLIENT", imageUrl: null };

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AuthContext", () => {
  it("keeps only the profile in localStorage after login - no token", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(profile), { status: 200 })));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.login({ login: "client@demo.com", password: "Demo@Client123" }));

    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem("token")).toBeNull();
    expect(JSON.parse(localStorage.getItem("user") ?? "{}")).toMatchObject({ userId: 13 });
  });

  it("drops a session saved before the BFF (token in localStorage) and asks for a new login", async () => {
    localStorage.setItem("token", "old-jwt");
    localStorage.setItem("user", JSON.stringify(profile));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("restores a cached profile on reload", async () => {
    localStorage.setItem("user", JSON.stringify(profile));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user?.fullName).toBe("Demo Client");
  });

  it("logout clears the profile and asks the server to drop the cookie", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem("user", JSON.stringify(profile));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    act(() => result.current.logout());

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("user")).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/logout", expect.objectContaining({ method: "POST" }));
  });
});
