"use client";

import { useEffect, useState } from "react";

const AUTO_RETRY_SECONDS = 15;
const MAX_AUTO_RETRIES = 4;

// Root error boundary (the layout's header stays). The usual cause in production is the
// backend waking up on Render's free tier (30-50s), so it retries on its own a few times
// before leaving it to the button. retry() (Next 16.3) re-fetches the server data.
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_RETRY_SECONDS);
  const autoRetrying = attempt < MAX_AUTO_RETRIES;

  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    if (!autoRetrying) return;
    const timer = setTimeout(() => {
      if (secondsLeft > 1) {
        setSecondsLeft(secondsLeft - 1);
        return;
      }
      setAttempt((current) => current + 1);
      setSecondsLeft(AUTO_RETRY_SECONDS);
      retry();
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoRetrying, secondsLeft, retry]);

  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-serif text-[28px] text-cream">A loja não respondeu agora</h1>
      <p className="mt-3 text-[14px] text-muted">
        Se a loja ficou um tempo sem acessos, o servidor pode levar até 1 minuto para acordar.
      </p>
      <p role="status" aria-live="polite" className="mt-2 text-[13px] text-muted">
        {autoRetrying
          ? `Tentando de novo em ${secondsLeft}s…`
          : "Não conseguimos conectar. Tente de novo em instantes."}
      </p>
      <button
        type="button"
        onClick={() => {
          setAttempt(0);
          setSecondsLeft(AUTO_RETRY_SECONDS);
          retry();
        }}
        className="mt-6 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-bg hover:bg-gold-light"
      >
        Tentar de novo
      </button>
    </section>
  );
}
