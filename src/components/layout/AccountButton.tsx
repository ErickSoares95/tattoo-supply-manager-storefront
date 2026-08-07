"use client";

import Link from "next/link";
import { useAuth } from "@/lib/store/AuthContext";
import { UserIcon } from "@/components/ui/icons";

export function AccountButton() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        aria-label="Entrar"
        className="flex items-center justify-center rounded-full p-2 text-cream hover:bg-gold/10 hover:text-gold-light"
      >
        <UserIcon className="h-5 w-5" />
        <span className="visually-hidden">Entrar</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href="/pedidos"
        aria-label={`Meus pedidos (${user?.fullName})`}
        title={user?.fullName}
        className="flex items-center justify-center rounded-full p-2 text-cream hover:bg-gold/10 hover:text-gold-light"
      >
        <UserIcon className="h-5 w-5" />
      </Link>
      <button
        type="button"
        onClick={logout}
        className="hidden text-xs text-muted hover:text-gold-light md:inline"
      >
        Sair
      </button>
    </div>
  );
}
