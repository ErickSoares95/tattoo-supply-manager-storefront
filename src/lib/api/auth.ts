import { apiFetch } from "@/lib/api/client";
import type { CreateUserRequest, LoginRequest, LoginResponse, UserResponse } from "@/lib/api/types";

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: CreateUserRequest): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
