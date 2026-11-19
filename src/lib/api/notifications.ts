import { bffFetch } from "@/lib/api/client";

// GET /notifications/failed (ADMIN): unprocessed order and payment notification failures,
// newest first. parked = terminal (permanent error or out of attempts), never retried again.
export interface FailedNotification {
  id: number;
  type: "ORDER" | "PAYMENT";
  orderId: number;
  senderName: string | null;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: string | null;
  parked: boolean;
  errorMessage: string | null;
  createdAt: string | null;
}

export function fetchFailedNotifications(): Promise<FailedNotification[]> {
  return bffFetch<FailedNotification[]>("/notifications/failed");
}

// POST /notifications/reprocess, ADMIN-only: retries every pending failure now, ignoring the
// backoff (parked ones included, through the sender that failed).
export function reprocessNotifications(): Promise<void> {
  return bffFetch<void>("/notifications/reprocess", { method: "POST" });
}
