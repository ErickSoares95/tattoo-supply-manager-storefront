import type { OrderStatus } from "@/lib/api/types";
import { ORDER_STATUS_CLASSES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export function OrderStatusBadge({ status }: { status: OrderStatus | undefined }) {
  // Orders loaded before the backend had a status read as pending.
  const value = status ?? "PENDING_PAYMENT";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ORDER_STATUS_CLASSES[value]}`}>
      {ORDER_STATUS_LABELS[value]}
    </span>
  );
}
