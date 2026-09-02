"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Início" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/notificacoes", label: "Notificações" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Seções do painel" className="mt-5 flex flex-wrap gap-2 border-b border-line pb-4">
      {TABS.map((tab) => {
        // /admin itself must match exactly (otherwise it'd stay "active" on every
        // sub-page, since every admin path starts with /admin).
        const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              active
                ? "border-gold bg-gold/10 text-gold-light"
                : "border-line text-muted hover:border-gold hover:text-gold-light"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
