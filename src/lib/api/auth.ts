import { apiFetch, sessionFetch } from "@/lib/api/client";
import type { CreateUserRequest, LoginRequest, SessionUser, UserResponse } from "@/lib/api/types";

// Login goes through the storefront's own /api/auth/login (see src/lib/server/login.ts): the
// JWT is stored in an HttpOnly cookie and only the profile fields come back here.
export function login(payload: LoginRequest): Promise<SessionUser> {
  return sessionFetch<SessionUser>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout(): Promise<void> {
  return sessionFetch<void>("/api/auth/logout", { method: "POST" });
}

// Public endpoint, no session involved - still called straight on the backend.
export function register(payload: CreateUserRequest): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
