import { bffFetch } from "@/lib/api/client";
import type {
  ChangePasswordRequest,
  PageResponse,
  UpdateProfileRequest,
  UpdateUserRequest,
  UserResponse,
} from "@/lib/api/types";

// All four of these are ADMIN-only on the backend (GET /users, GET /users/{id},
// PUT /users/{id}, DELETE /users/{id}) - unlike products.ts, there's no public read
// path here, so every call goes through the authenticated BFF proxy.

export function fetchAllUsers(): Promise<PageResponse<UserResponse>> {
  return bffFetch<PageResponse<UserResponse>>("/users?size=100");
}

export function fetchUserById(id: number): Promise<UserResponse> {
  return bffFetch<UserResponse>(`/users/${id}`);
}

export function updateUser(id: number, payload: UpdateUserRequest): Promise<UserResponse> {
  return bffFetch<UserResponse>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteUser(id: number): Promise<void> {
  return bffFetch<void>(`/users/${id}`, { method: "DELETE" });
}

// Self-service (GET/PUT /users/me, PATCH /users/me/password) - any authenticated user,
// no ADMIN role required, unlike the four calls above. "me" is resolved from the JWT on
// the backend, so there's no id param here at all.

export function fetchMyProfile(): Promise<UserResponse> {
  return bffFetch<UserResponse>("/users/me");
}

export function updateMyProfile(payload: UpdateProfileRequest): Promise<UserResponse> {
  return bffFetch<UserResponse>("/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function changeMyPassword(payload: ChangePasswordRequest): Promise<void> {
  return bffFetch<void>("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
