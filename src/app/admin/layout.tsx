"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { useAuth } from "@/lib/store/AuthContext";

// Single guard for the whole /admin subtree, mirroring the MVP's RequireAdmin wrapper
// but as a layout instead of a route wrapper component - every page under here mounts
// as `children`, and a layout that returns null without rendering {children} keeps
// those pages (and their data-fetching effects) from ever mounting, so this is a real
// gate, not just a visual one.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Same isLoading race as /pedidos (see AuthContext's doc comment): wait for
    // localStorage hydration before deciding anyone is unauthenticated.
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=admin");
      return;
    }
    if (user?.userType !== "ADMIN") {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.userType !== "ADMIN") return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="mb-3.5 text-[12.5px] text-muted">
        <span>Início</span>
        <span className="mx-1.5">›</span>
        <span>Painel administrativo</span>
      </p>

      <h1 className="font-serif text-[30px] text-cream">Painel administrativo</h1>

      <AdminNav />

      <div className="mt-8">{children}</div>
    </section>
  );
}
