"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/AuthContext";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";

// Client Component (not a server fetch), same reason as /pedidos: needs the token from
// AuthContext, which only exists in the browser - see AuthContext.tsx's note on why
// that hydration can't happen server-side.
export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for AuthContext to finish hydrating from localStorage before deciding to
    // redirect - see the isLoading doc comment on AuthContextValue for why this can't
    // just check isAuthenticated directly on mount.
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=perfil");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) return null;

  return (
    <section className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-serif text-3xl text-cream">Meu perfil</h1>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gold-light">Dados pessoais</h2>
        <ProfileForm />
      </div>

      <div className="mt-12 border-t border-line pt-8">
        <h2 className="mb-4 text-lg font-semibold text-gold-light">Trocar senha</h2>
        <ChangePasswordForm />
      </div>
    </section>
  );
}
