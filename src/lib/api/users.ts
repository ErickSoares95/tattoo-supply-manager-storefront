import { apiFetch } from "@/lib/api/client";
import type { PageResponse, UpdateUserRequest, UserResponse } from "@/lib/api/types";

// All four of these are ADMIN-only on the backend (GET /users, GET /users/{id},
// PUT /users/{id}, DELETE /users/{id}) - unlike products.ts, there's no public read
// path here, so every call needs the admin's Bearer token.

export function fetchAllUsers(token: string): Promise<PageResponse<UserResponse>> {
  return apiFetch<PageResponse<UserResponse>>("/users?size=100", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

export function fetchUserById(id: number, token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

export function updateUser(id: number, payload: UpdateUserRequest, token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function deleteUser(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
