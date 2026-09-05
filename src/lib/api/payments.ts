import { apiFetch } from "@/lib/api/client";
import type { PaymentResponse } from "@/lib/api/types";

// POST /orders/{orderId}/payments and GET of the same - both CLIENT/ADMIN and both
// owner-or-admin enforced by the backend (403 otherwise). Token passed explicitly, same
// convention as orders.ts. The event flow behind a successful POST is real: the backend
// writes a PaymentProcessedEvent to its transactional outbox in the same transaction,
// and a poller relays it to Kafka, where the notification service consumes it.
export function createPayment(
  orderId: number,
  amount: number,
  method: string,
  token: string,
): Promise<PaymentResponse> {
  return apiFetch<PaymentResponse>(`/orders/${orderId}/payments`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount, method }),
  });
}

export function fetchOrderPayments(orderId: number, token: string): Promise<PaymentResponse[]> {
  return apiFetch<PaymentResponse[]>(`/orders/${orderId}/payments`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}
