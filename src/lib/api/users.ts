import { apiFetch } from "@/lib/api/client";
import type {
  ChangePasswordRequest,
  PageResponse,
  UpdateProfileRequest,
  UpdateUserRequest,
  UserResponse,
} from "@/lib/api/types";

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

// Self-service (GET/PUT /users/me, PATCH /users/me/password) - any authenticated user,
// no ADMIN role required, unlike the four calls above. "me" is resolved from the JWT on
// the backend, so there's no id param here at all.

export function fetchMyProfile(token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

export function updateMyProfile(payload: UpdateProfileRequest, token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users/me", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function changeMyPassword(payload: ChangePasswordRequest, token: string): Promise<void> {
  return apiFetch<void>("/users/me/password", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
