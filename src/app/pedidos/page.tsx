"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMyOrders } from "@/lib/api/orders";
import type { OrderResponse } from "@/lib/api/types";
import { formatBRL } from "@/lib/format";
import { useAuth } from "@/lib/store/AuthContext";

// Client Component (not a server fetch) because it needs the token from AuthContext,
// which only exists in the browser (localStorage) - see AuthContext.tsx's note on why
// that hydration can't happen server-side.
export default function OrdersPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for AuthContext to finish hydrating from localStorage before deciding to
    // redirect - see the isLoading doc comment on AuthContextValue for why this can't
    // just check isAuthenticated directly on mount.
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      router.replace("/login?redirect=pedidos");
      return;
    }

    fetchMyOrders(token)
      .then((page) => setOrders(page.content))
      .catch(() => setError("Não foi possível carregar seus pedidos."))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, token, router]);

  if (authLoading || !isAuthenticated) return null;

  return (
    <section className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-serif text-3xl text-cream">Meus pedidos</h1>

      {loading && <p className="mt-6 text-muted">Carregando pedidos...</p>}
      {error && <p className="mt-6 text-danger">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="mt-6 text-muted">
          Você ainda não fez nenhum pedido.{" "}
          <Link href="/produtos" className="text-gold-light hover:underline">
            Ver produtos
          </Link>
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {orders.map((order) => (
          <li
            key={order.id}
            className="flex items-center justify-between rounded-lg border border-line bg-bg-card px-4 py-3.5"
          >
            <div>
              <p className="font-semibold text-cream">Pedido #{order.id}</p>
              <p className="text-sm text-muted">
                {new Date(order.creationDate).toLocaleString("pt-BR")} · {order.items.length} item(ns)
              </p>
            </div>
            <p className="font-bold text-gold-light">{formatBRL(order.total)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
