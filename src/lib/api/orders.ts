import { bffFetch } from "@/lib/api/client";
import type { OrderItemRequest, OrderResponse, PageResponse } from "@/lib/api/types";

// Both require a session (POST /orders is CLIENT/ADMIN only, GET /orders returns only the
// caller's own orders unless ADMIN). Called from client components through the BFF proxy,
// which attaches the JWT from the HttpOnly session cookie.
// idempotencyKey: one per checkout attempt. If the request is retried (double click, network
// retry), the backend returns the order the first one created instead of a second order.
export function createOrder(items: OrderItemRequest[], idempotencyKey?: string): Promise<OrderResponse> {
  return bffFetch<OrderResponse>("/orders", {
    method: "POST",
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    body: JSON.stringify({ items }),
  });
}

// Owner or admin; only unpaid orders (409 otherwise). The stock goes back to the catalog.
export function cancelOrder(id: number): Promise<OrderResponse> {
  return bffFetch<OrderResponse>(`/orders/${id}/cancel`, { method: "POST" });
}

export function fetchMyOrders(): Promise<PageResponse<OrderResponse>> {
  return bffFetch<PageResponse<OrderResponse>>("/orders");
}

// GET /orders/{id} - backend already enforces owner-or-admin (403 otherwise), so this
// page doesn't need its own ownership check beyond handling that error.
export function fetchOrderById(id: number): Promise<OrderResponse> {
  return bffFetch<OrderResponse>(`/orders/${id}`);
}
