import type { OrderStatus } from "@/lib/api/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  PAID: "Pago",
  CANCELLED: "Cancelado",
};

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "border-gold-dark text-gold-light",
  PAID: "border-ok text-ok",
  CANCELLED: "border-line text-muted",
};
