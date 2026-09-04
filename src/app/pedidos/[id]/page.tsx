"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchOrderById } from "@/lib/api/orders";
import type { OrderResponse } from "@/lib/api/types";
import { formatBRL } from "@/lib/format";
import { useAuth } from "@/lib/store/AuthContext";

// Client Component for the same reason /pedidos is: needs the token from AuthContext
// (browser-only). The backend already enforces owner-or-admin on GET /orders/{id} (403
// otherwise) - this page just has to render that error state instead of re-checking
// ownership itself.
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      router.replace(`/login?redirect=pedidos/${id}`);
      return;
    }

    fetchOrderById(Number(id), token)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace(`/login?redirect=pedidos/${id}`);
          return;
        }
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
  }, [authLoading, isAuthenticated, token, id, router, logout]);

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
        </>
      )}
    </section>
  );
}
