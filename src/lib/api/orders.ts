import { apiFetch } from "@/lib/api/client";
import type { OrderItemRequest, OrderResponse, PageResponse } from "@/lib/api/types";

// Both require a Bearer token (POST /orders is CLIENT/ADMIN only, GET /orders returns
// only the caller's own orders unless ADMIN) - called from client components that have
// the token via useAuth(), token passed explicitly rather than apiFetch reading
// localStorage itself (keeps apiFetch usable from Server Components too, where
// localStorage doesn't exist).
export function createOrder(items: OrderItemRequest[], token: string): Promise<OrderResponse> {
  return apiFetch<OrderResponse>("/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items }),
  });
}

export function fetchMyOrders(token: string): Promise<PageResponse<OrderResponse>> {
  return apiFetch<PageResponse<OrderResponse>>("/orders", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}
