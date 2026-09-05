"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/AuthContext";
import { UserIcon } from "@/components/ui/icons";

// Same click-outside/Escape dropdown pattern DepartmentMenu used before it was removed
// (see git history) - the trigger here is the account icon itself rather than a labeled
// button, since Header already treats this as an icon-only affordance like Cart/Wishlist.
export function AccountButton() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

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

  function handleLogout() {
    setOpen(false);
    logout();
    router.push("/");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label={`Minha conta (${user?.fullName})`}
        title={user?.fullName}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center justify-center rounded-full p-2 text-cream hover:bg-gold/10 hover:text-gold-light"
      >
        <UserIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          id="account-menu"
          role="menu"
          aria-label="Minha conta"
          className="absolute top-full right-0 z-40 mt-2 w-56 rounded-lg border border-line bg-bg-card p-2 shadow-lg"
        >
          <p className="truncate px-3 pt-1 pb-2 text-xs text-muted">{user?.fullName}</p>

          <Link
            href="/perfil"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-cream hover:bg-gold/10 hover:text-gold-light"
          >
            Meu perfil
          </Link>
          <Link
            href="/pedidos"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-cream hover:bg-gold/10 hover:text-gold-light"
          >
            Meus pedidos
          </Link>
          <Link
            href="/favoritos"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-cream hover:bg-gold/10 hover:text-gold-light"
          >
            Lista de desejos
          </Link>
          {user?.userType === "ADMIN" && (
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-cream hover:bg-gold/10 hover:text-gold-light"
            >
              Painel admin
            </Link>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="mt-1 block w-full rounded-md border-t border-line px-3 pt-3 pb-2 text-left text-sm text-danger hover:bg-gold/10"
          >
            Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}
