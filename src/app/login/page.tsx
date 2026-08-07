import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

// Server Component wrapper: LoginForm uses useSearchParams(), which requires a
// Suspense boundary in the App Router (otherwise the whole page opts out of static
// rendering with a build error) - see https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-sm flex-col gap-6 px-5 py-20">
      <div>
        <h1 className="font-serif text-3xl text-cream">Entrar</h1>
        <p className="mt-1 text-sm text-muted">Acesse sua conta pra ver seus pedidos e finalizar compras.</p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
