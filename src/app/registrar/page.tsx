"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Every new account is always CLIENT server-side, no matter what's sent here -
      // phoneNumber/cpf/imageUrl kept optional (matches CreateUserRequest exactly).
      await register({ ...form, phoneNumber: null, cpf: null, imageUrl: null });
      router.push("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-sm flex-col gap-6 px-5 py-20">
      <div>
        <h1 className="font-serif text-3xl text-cream">Criar conta</h1>
        <p className="mt-1 text-sm text-muted">Toda conta nova começa como cliente.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Nome completo
          <input
            required
            minLength={3}
            value={form.fullName}
            onChange={handleChange("fullName")}
            className="rounded-md border border-line bg-bg-card px-3 py-2 text-cream outline-none focus-visible:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-muted">
          Usuário
          <input
            required
            minLength={3}
            value={form.username}
            onChange={handleChange("username")}
            className="rounded-md border border-line bg-bg-card px-3 py-2 text-cream outline-none focus-visible:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-muted">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
            className="rounded-md border border-line bg-bg-card px-3 py-2 text-cream outline-none focus-visible:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-muted">
          Senha
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange("password")}
            className="rounded-md border border-line bg-bg-card px-3 py-2 text-cream outline-none focus-visible:border-gold"
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-gold py-2.5 text-sm font-semibold text-bg hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="text-gold-light hover:underline">
          Entrar
        </Link>
      </p>
    </section>
  );
}
