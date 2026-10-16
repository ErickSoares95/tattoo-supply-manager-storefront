import { bffFetch } from "@/lib/api/client";
import type { PaymentResponse } from "@/lib/api/types";

// POST /orders/{orderId}/payments and GET of the same - both CLIENT/ADMIN and both
// owner-or-admin enforced by the backend (403 otherwise). After a successful POST the
// backend publishes an in-process PaymentProcessedEvent; its notification listener runs
// after the payment commits and sends "payment confirmed/rejected" on every channel.
export function createPayment(orderId: number, amount: number, method: string): Promise<PaymentResponse> {
  return bffFetch<PaymentResponse>(`/orders/${orderId}/payments`, {
    method: "POST",
    body: JSON.stringify({ amount, method }),
  });
}

export function fetchOrderPayments(orderId: number): Promise<PaymentResponse[]> {
  return bffFetch<PaymentResponse[]>(`/orders/${orderId}/payments`);
}
