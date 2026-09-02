"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { reprocessNotifications } from "@/lib/api/notifications";
import { useAuth } from "@/lib/store/AuthContext";

export default function AdminNotificationsPage() {
  const { token } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleReprocess() {
    if (!token) return;
    setStatus("loading");
    setError(null);
    try {
      await reprocessNotifications(token);
      setStatus("success");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível reprocessar as notificações.");
      setStatus("error");
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-serif text-xl text-cream">Notificações</h2>
      <p className="mt-2 text-sm text-muted">
        Notificações de pedido que falharam em todas as tentativas automáticas ficam pendentes de reprocessamento.
        Não há uma lista disponível — o botão abaixo dispara uma nova tentativa pra todas elas de uma vez.
      </p>

      <button
        type="button"
        onClick={handleReprocess}
        disabled={status === "loading"}
        className="mt-6 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-bg hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Reprocessando..." : "Reprocessar notificações falhadas"}
      </button>

      {status === "success" && (
        <p className="mt-4 rounded-md border border-ok/40 bg-ok/10 px-3 py-2 text-sm text-ok">
          Reprocessamento disparado com sucesso.
        </p>
      )}
      {status === "error" && error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  );
}
