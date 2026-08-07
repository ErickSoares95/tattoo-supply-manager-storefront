"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/store/AuthContext";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ login: loginValue, password });
      router.push(redirect ? `/${redirect}` : "/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {redirect === "carrinho" && (
        <p className="mb-4 rounded-md border border-gold-dark bg-bg-card px-3 py-2 text-sm text-gold-light">
          Faça login pra finalizar sua compra.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Email ou CPF
          <input
            required
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            className="rounded-md border border-line bg-bg-card px-3 py-2 text-cream outline-none focus-visible:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-muted">
          Senha
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-line bg-bg-card px-3 py-2 text-cream outline-none focus-visible:border-gold"
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-gold py-2.5 text-sm font-semibold text-bg hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link href="/registrar" className="text-gold-light hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  );
}
