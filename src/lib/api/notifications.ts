import { bffFetch } from "@/lib/api/client";

// POST /notifications/reprocess, ADMIN-only. There's no GET for the list of failed
// notifications on the backend (see tattoo-supply-manager's NotificationController) -
// this button is the only lever that exists, same as the MVP's admin panel.
export function reprocessNotifications(): Promise<void> {
  return bffFetch<void>("/notifications/reprocess", { method: "POST" });
}
