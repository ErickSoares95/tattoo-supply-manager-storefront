import { bffFetch } from "@/lib/api/client";
import type { OrderItemRequest, OrderResponse, PageResponse } from "@/lib/api/types";

// Both require a session (POST /orders is CLIENT/ADMIN only, GET /orders returns only the
// caller's own orders unless ADMIN). Called from client components through the BFF proxy,
// which attaches the JWT from the HttpOnly session cookie.
export function createOrder(items: OrderItemRequest[]): Promise<OrderResponse> {
  return bffFetch<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export function fetchMyOrders(): Promise<PageResponse<OrderResponse>> {
  return bffFetch<PageResponse<OrderResponse>>("/orders");
}

// GET /orders/{id} - backend already enforces owner-or-admin (403 otherwise), so this
// page doesn't need its own ownership check beyond handling that error.
export function fetchOrderById(id: number): Promise<OrderResponse> {
  return bffFetch<OrderResponse>(`/orders/${id}`);
}
