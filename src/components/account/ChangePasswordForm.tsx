"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/client";
import { changeMyPassword } from "@/lib/api/users";
import { useAuth } from "@/lib/store/AuthContext";

const FIELD_CLASS =
  "rounded-md border border-line bg-bg px-3 py-2 text-cream outline-none focus-visible:border-gold";

// Separate form/section from ProfileForm on purpose: PATCH /users/me/password is its
// own backend endpoint with its own request shape (current + new password, not part of
// UpdateProfileRequest) and its own failure mode (wrong current password), so mixing it
// into the profile form's single save button would blur two independent operations.
export function ChangePasswordForm() {
  const { token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("A confirmação não bate com a nova senha.");
      return;
    }

    setSaving(true);
    try {
      await changeMyPassword({ currentPassword, newPassword }, token);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      // Most likely InvalidCurrentPasswordException (403) if currentPassword is wrong.
      setError(err instanceof ApiError ? err.message : "Não foi possível trocar sua senha.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-muted">
        Senha atual
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => {
            setSuccess(false);
            setCurrentPassword(e.target.value);
          }}
          className={FIELD_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Nova senha
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => {
            setSuccess(false);
            setNewPassword(e.target.value);
          }}
          className={FIELD_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Confirmar nova senha
        <input
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => {
            setSuccess(false);
            setConfirmPassword(e.target.value);
          }}
          className={FIELD_CLASS}
        />
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}
      {success && <p className="text-sm text-gold-light">Senha alterada com sucesso.</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 self-start rounded-full border border-gold px-5 py-2.5 text-sm font-semibold text-gold-light hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Trocar senha"}
      </button>
    </form>
  );
}
