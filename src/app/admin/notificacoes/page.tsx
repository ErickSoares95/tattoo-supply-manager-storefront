"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchFailedNotifications, reprocessNotifications, type FailedNotification } from "@/lib/api/notifications";
import { useAuth } from "@/lib/store/AuthContext";

const SENDER_LABELS: Record<string, string> = { EMAIL: "E-mail", WEBHOOK: "Webhook", WHATSAPP: "WhatsApp" };

export default function AdminNotificationsPage() {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [failures, setFailures] = useState<FailedNotification[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const loadFailures = useCallback(() => {
    fetchFailedNotifications()
      .then((list) => {
        setFailures(list);
        setListError(null);
      })
      .catch((err) => setListError(err instanceof ApiError ? err.message : "Não foi possível carregar as falhas."));
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadFailures();
  }, [isAuthenticated, loadFailures]);

  async function handleReprocess() {
    if (!isAuthenticated) return;
    setStatus("loading");
    setError(null);
    try {
      await reprocessNotifications();
      setStatus("success");
      loadFailures();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível reprocessar as notificações.");
      setStatus("error");
    }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-xl text-cream">Notificações</h2>
      <p className="mt-2 text-sm text-muted">
        Envios de pedido e de pagamento que falharam. Os pendentes são tentados de novo sozinhos (com intervalo
        crescente); os estacionados não serão mais tentados automaticamente e precisam de atenção.
      </p>

      <button
        type="button"
        onClick={handleReprocess}
        disabled={status === "loading"}
        className="mt-6 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-bg hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Reprocessando..." : "Reprocessar agora"}
      </button>

      {status === "success" && (
        <p className="mt-4 rounded-md border border-ok/40 bg-ok/10 px-3 py-2 text-sm text-ok">
          Reprocessamento disparado com sucesso.
        </p>
      )}
      {status === "error" && error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <h3 className="mt-10 font-serif text-lg text-cream">Falhas em aberto</h3>
      {listError && <p className="mt-3 text-sm text-danger">{listError}</p>}
      {failures && failures.length === 0 && <p className="mt-3 text-sm text-muted">Nenhuma falha em aberto.</p>}
      {failures && failures.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="py-2 pr-3">Pedido</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Canal</th>
                <th className="py-2 pr-3">Tentativas</th>
                <th className="py-2 pr-3">Situação</th>
                <th className="py-2">Erro</th>
              </tr>
            </thead>
            <tbody>
              {failures.map((failure) => (
                <tr key={`${failure.type}-${failure.id}`} className="border-t border-line text-cream">
                  <td className="py-2 pr-3">#{failure.orderId}</td>
                  <td className="py-2 pr-3">{failure.type === "ORDER" ? "Pedido" : "Pagamento"}</td>
                  <td className="py-2 pr-3">{failure.senderName ? (SENDER_LABELS[failure.senderName] ?? failure.senderName) : "Todos"}</td>
                  <td className="py-2 pr-3">{failure.attempts}/{failure.maxAttempts}</td>
                  <td className={`py-2 pr-3 ${failure.parked ? "text-danger" : "text-gold-light"}`}>
                    {failure.parked
                      ? "Estacionada"
                      : failure.nextAttemptAt
                        ? `Próxima tentativa ${new Date(failure.nextAttemptAt).toLocaleString("pt-BR")}`
                        : "Pendente"}
                  </td>
                  <td className="py-2 text-muted">{failure.errorMessage ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
