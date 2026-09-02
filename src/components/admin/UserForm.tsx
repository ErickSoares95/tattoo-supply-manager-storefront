"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchUserById, updateUser } from "@/lib/api/users";
import type { UpdateUserRequest } from "@/lib/api/types";
import { useAuth } from "@/lib/store/AuthContext";

const FIELD_CLASS =
  "rounded-md border border-line bg-bg px-3 py-2 text-cream outline-none focus-visible:border-gold";

// Admin edit only - there's no admin "create user" flow (accounts come from the public
// /registrar signup, always as CLIENT; PUT /users/{id} is how an admin promotes/blocks
// someone afterward), so unlike ProductForm this component never handles a create path.
export function UserForm({ userId }: { userId: number }) {
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<UpdateUserRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetchUserById(userId, token)
      .then((user) =>
        setForm({
          username: user.username,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          cpf: user.cpf,
          imageUrl: user.imageUrl,
          userType: user.userType,
          userStatus: user.userStatus,
        }),
      )
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar o usuário."))
      .finally(() => setLoading(false));
  }, [userId, token]);

  function handleChange<K extends keyof UpdateUserRequest>(field: K) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => (prev ? { ...prev, [field]: event.target.value } : prev));
    };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token || !form) return;

    setError(null);
    setSaving(true);
    try {
      await updateUser(userId, form, token);
      router.push("/admin/usuarios");
      router.refresh();
    } catch (err) {
      // Most likely LastAdminException (409) if this demotes the only active admin.
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar o usuário.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Carregando usuário...</p>;
  if (!form) return error ? <p className="text-danger">{error}</p> : null;

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-muted">
        Usuário
        <input required value={form.username} onChange={handleChange("username")} className={FIELD_CLASS} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Nome completo
        <input required value={form.fullName} onChange={handleChange("fullName")} className={FIELD_CLASS} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Telefone
        <input value={form.phoneNumber ?? ""} onChange={handleChange("phoneNumber")} className={FIELD_CLASS} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Papel
        <select value={form.userType} onChange={handleChange("userType")} className={FIELD_CLASS}>
          <option value="CLIENT">CLIENT</option>
          <option value="ATTENDANT">ATTENDANT</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Status
        <select value={form.userStatus} onChange={handleChange("userStatus")} className={FIELD_CLASS}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 self-start rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-bg hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
