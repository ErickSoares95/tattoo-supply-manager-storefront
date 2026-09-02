"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { deleteUser, fetchAllUsers } from "@/lib/api/users";
import type { UserResponse } from "@/lib/api/types";
import { useAuth } from "@/lib/store/AuthContext";

function StatusBadge({ status }: { status: UserResponse["userStatus"] }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        isActive ? "bg-ok/15 text-ok" : "bg-bg-card text-muted"
      }`}
    >
      {isActive ? "Ativo" : "Bloqueado"}
    </span>
  );
}

function TypeBadge({ type }: { type: UserResponse["userType"] }) {
  return (
    <span className="rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted">{type}</span>
  );
}

export default function AdminUsersPage() {
  const { token } = useAuth();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetchAllUsers(token)
      .then((page) => setUsers(page.content))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar os usuários."))
      .finally(() => setLoading(false));
    // Re-runs when `token` flips from null to a real value post-hydration (see
    // AuthContext's isLoading doc comment) - there's nothing to fetch without it.
  }, [token]);

  async function handleDelete(user: UserResponse) {
    if (!token) return;
    if (!window.confirm(`Excluir a conta de "${user.fullName}"? Essa ação não pode ser desfeita.`)) return;

    setError(null);
    try {
      await deleteUser(user.id, token);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
    } catch (err) {
      // Most likely LastAdminException (409) - deleting the only remaining active
      // admin is blocked on the backend, and this is where that message surfaces.
      setError(err instanceof ApiError ? err.message : "Não foi possível excluir o usuário.");
    }
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-cream">Usuários</h2>

      {loading && <p className="mt-4 text-muted">Carregando usuários...</p>}
      {error && <p className="mt-4 text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-card text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Papel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-line">
                  <td className="px-4 py-3 text-cream">{user.fullName}</td>
                  <td className="px-4 py-3 text-muted">{user.email}</td>
                  <td className="px-4 py-3">
                    <TypeBadge type={user.userType} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.userStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/admin/usuarios/${user.id}/editar`} className="text-gold-light hover:underline">
                        Editar
                      </Link>
                      <button type="button" onClick={() => handleDelete(user)} className="text-muted hover:text-danger">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
