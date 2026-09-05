"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchMyProfile, updateMyProfile } from "@/lib/api/users";
import type { UpdateProfileRequest } from "@/lib/api/types";
import { useAuth } from "@/lib/store/AuthContext";
import { ProductImage } from "@/components/shop/ProductImage";

const FIELD_CLASS =
  "rounded-md border border-line bg-bg px-3 py-2 text-cream outline-none focus-visible:border-gold";

// Self-service counterpart to admin/UserForm.tsx (GET+PUT /users/me instead of
// /users/{id}) - same field set minus userType/userStatus, which don't exist on
// UpdateProfileRequest at all: a client can't grant themselves a role or unblock their
// own account through this form even if they tampered with the request body by hand.
export function ProfileForm() {
  const { token, logout, updateUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<UpdateProfileRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetchMyProfile(token)
      .then((user) =>
        setForm({
          username: user.username,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          cpf: user.cpf,
          imageUrl: user.imageUrl,
        }),
      )
      .catch((err) => {
        // A stale/expired token still passes ProfilePage's isAuthenticated check (it's
        // just a non-empty string) but fails here on the backend - same fix as /pedidos
        // (see its page.tsx), clear the dead session instead of showing a stuck error.
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace("/login?redirect=perfil");
          return;
        }
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar seu perfil.");
      })
      .finally(() => setLoading(false));
  }, [token, logout, router]);

  function handleChange<K extends keyof UpdateProfileRequest>(field: K) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setSuccess(false);
      setForm((prev) => (prev ? { ...prev, [field]: event.target.value } : prev));
    };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token || !form) return;

    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      const updated = await updateMyProfile(form, token);
      // Keeps the header ("Minha conta (nome)") and the greeting in the account menu in
      // sync with a changed name right away, without requiring a fresh login.
      updateUser({ fullName: updated.fullName });
      setSuccess(true);
    } catch (err) {
      // Most likely UsernameAlreadyExistsException/CpfAlreadyExistsException (409).
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar seu perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Carregando perfil...</p>;
  if (!form) return error ? <p className="text-danger">{error}</p> : null;

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-muted">
        Nome completo
        <input required value={form.fullName} onChange={handleChange("fullName")} className={FIELD_CLASS} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Usuário
        <input required value={form.username} onChange={handleChange("username")} className={FIELD_CLASS} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Telefone
        <input value={form.phoneNumber ?? ""} onChange={handleChange("phoneNumber")} className={FIELD_CLASS} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        CPF
        <input value={form.cpf ?? ""} onChange={handleChange("cpf")} className={FIELD_CLASS} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        URL da foto de perfil
        <input
          type="url"
          placeholder="https://..."
          value={form.imageUrl ?? ""}
          onChange={handleChange("imageUrl")}
          className={FIELD_CLASS}
        />
      </label>

      {form.imageUrl && (
        <div className="h-24 w-24 overflow-hidden rounded-full border border-line">
          <ProductImage
            src={form.imageUrl}
            alt="Pré-visualização da foto de perfil"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}
      {success && <p className="text-sm text-gold-light">Perfil atualizado com sucesso.</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 self-start rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-bg hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
