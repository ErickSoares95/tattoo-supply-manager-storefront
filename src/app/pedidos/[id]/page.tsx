"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchOrderById } from "@/lib/api/orders";
import { createPayment, fetchOrderPayments } from "@/lib/api/payments";
import type { OrderResponse, PaymentMethod, PaymentResponse } from "@/lib/api/types";
import { formatBRL } from "@/lib/format";
import { useAuth } from "@/lib/store/AuthContext";

// Client Component for the same reason /pedidos is: needs the token from AuthContext
// (browser-only). The backend already enforces owner-or-admin on GET /orders/{id} and
// GET /orders/{id}/payments (403 otherwise) - this page just renders that error state
// instead of re-checking ownership itself. It doubles as the checkout confirmation +
// payment screen: the cart creates the order and redirects here, payment happens below.
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [payments, setPayments] = useState<PaymentResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useCallback(
    (err: unknown): boolean => {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        router.replace(`/login?redirect=pedidos/${id}`);
        return true;
      }
      return false;
    },
    [logout, router, id],
  );

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      router.replace(`/login?redirect=pedidos/${id}`);
      return;
    }

    Promise.all([fetchOrderById(Number(id), token), fetchOrderPayments(Number(id), token)])
      .then(([loadedOrder, loadedPayments]) => {
        setOrder(loadedOrder);
        setPayments(loadedPayments);
      })
      .catch((err) => {
        if (handleAuthError(err)) return;
        if (err instanceof ApiError && err.status === 403) {
          setError("Este pedido não pertence à sua conta.");
          return;
        }
        if (err instanceof ApiError && err.status === 404) {
          setError("Pedido não encontrado.");
          return;
        }
        setError("Não foi possível carregar este pedido.");
      })
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, token, id, router, handleAuthError]);

  if (authLoading || !isAuthenticated) return null;

  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="mb-6 text-[12.5px] text-muted">
        <Link href="/pedidos" className="hover:text-gold-light">Meus pedidos</Link>
        <span className="mx-1.5">›</span>
        <span>Pedido #{id}</span>
      </p>

      {loading && <p className="text-muted">Carregando pedido...</p>}
      {error && <p className="text-danger">{error}</p>}

      {order && (
        <>
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="font-serif text-3xl text-cream">Pedido #{order.id}</h1>
            <p className="text-sm text-muted">{new Date(order.creationDate).toLocaleString("pt-BR")}</p>
          </div>

          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between rounded-lg border border-line bg-bg-card px-4 py-3.5"
              >
                <div>
                  <p className="font-semibold text-cream">{item.productName}</p>
                  <p className="text-sm text-muted">
                    {item.quantity} × {formatBRL(item.price)}
                  </p>
                </div>
                <p className="font-bold text-gold-light">{formatBRL(item.subtotal)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between border-t border-line pt-4 text-lg font-bold text-cream">
            <span>Total</span>
            <span className="text-gold-light">{formatBRL(order.total)}</span>
          </div>

          {payments && (
            <PaymentSection
              order={order}
              payments={payments}
              onPaid={(payment) => setPayments((prev) => [payment, ...(prev ?? [])])}
              onAuthError={handleAuthError}
            />
          )}
        </>
      )}
    </section>
  );
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: "Pix",
  CREDIT_CARD: "Cartão de crédito",
  BOLETO: "Boleto",
};

function PaymentSection({
  order,
  payments,
  onPaid,
  onAuthError,
}: {
  order: OrderResponse;
  payments: PaymentResponse[];
  onPaid: (payment: PaymentResponse) => void;
  onAuthError: (err: unknown) => boolean;
}) {
  const { token } = useAuth();
  const [method, setMethod] = useState<PaymentMethod>("PIX");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const approved = payments.find((p) => p.status === "APPROVED");
  const lastRejected = !approved && payments[0]?.status === "REJECTED";

  async function handlePay() {
    if (!token) return;
    setPayError(null);
    setPaying(true);
    try {
      // Always the exact order total, so the backend's deterministic rule approves it.
      const payment = await createPayment(order.id, order.total, method, token);
      onPaid(payment);
    } catch (err) {
      if (onAuthError(err)) return;
      setPayError(err instanceof ApiError ? err.message : "Não foi possível processar o pagamento.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-line bg-bg-card p-5">
      <h2 className="mb-3 font-serif text-xl text-cream">Pagamento</h2>

      {approved ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-ok">
            ✓ Pagamento aprovado
            <span className="text-muted">
              {" · "}
              {METHOD_LABELS[approved.method as PaymentMethod] ?? approved.method}
            </span>
          </p>
          <p className="text-sm text-muted">
            {new Date(approved.creationDate).toLocaleString("pt-BR")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lastRejected && (
            <p className="text-sm text-danger">A tentativa de pagamento anterior foi recusada.</p>
          )}
          <p className="text-sm text-muted">
            Valor a pagar: <span className="font-semibold text-cream">{formatBRL(order.total)}</span>
          </p>

          <label className="flex flex-col gap-1 text-sm text-muted">
            Forma de pagamento
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="rounded border border-line bg-bg px-3 py-2 text-cream"
            >
              {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map((value) => (
                <option key={value} value={value}>
                  {METHOD_LABELS[value]}
                </option>
              ))}
            </select>
          </label>

          {payError && <p className="text-sm text-danger">{payError}</p>}

          <button
            type="button"
            disabled={paying}
            onClick={handlePay}
            className="self-start rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-bg hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {paying ? "Processando..." : `Pagar ${formatBRL(order.total)}`}
          </button>
        </div>
      )}
    </div>
  );
}
