"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { createOrder } from "@/lib/api/orders";
import { formatBRL } from "@/lib/format";
import { useAuth } from "@/lib/store/AuthContext";
import { useCart } from "@/lib/store/CartContext";

// Checkout can't complete without a logged-in user (POST /orders requires a Bearer
// token, CLIENT/ADMIN only) - that's the real coupling between this step (cart) and
// step 5 (login), not an accident. Anonymous checkout redirects to /login instead of
// failing silently.
export function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQuantity, subtotal, clear } = useCart();
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // WAI-ARIA authoring practices for a modal dialog: Escape must dismiss it. role="dialog"
  // aria-modal="true" alone doesn't give this for free - the browser does nothing special
  // with Escape, the app has to handle it.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  async function handleCheckout() {
    if (!isAuthenticated || !token) {
      close();
      router.push("/login?redirect=carrinho");
      return;
    }

    setError(null);
    setPlacing(true);

    try {
      await createOrder(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        token,
      );
      clear();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível finalizar a compra.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-[160] bg-black/55 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`fixed top-0 right-0 z-[170] flex h-full w-full max-w-sm flex-col bg-bg-card transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 id="cart-title" className="font-serif text-xl text-cream">
            Seu carrinho
          </h2>
          <button type="button" aria-label="Fechar carrinho" onClick={close} className="text-2xl text-cream">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-muted">Seu carrinho está vazio.</p>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 border-b border-line pb-3.5">
                  <div className="flex-1">
                    <p className="text-[13.5px] font-semibold text-cream">{item.name}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-6 w-6 rounded border border-line text-cream hover:border-gold"
                      >
                        −
                      </button>
                      <span className="text-sm text-cream">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-6 w-6 rounded border border-line text-cream hover:border-gold"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto text-xs text-danger hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <span className="text-[13.5px] font-bold text-gold-light whitespace-nowrap">
                    {formatBRL(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-line p-5">
          <div className="flex justify-between text-[15px] font-bold text-cream">
            <span>Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
          {success && <p className="text-sm text-ok">Pedido realizado com sucesso!</p>}
          {!isAuthenticated && items.length > 0 && (
            <p className="text-xs text-muted">Faça login pra finalizar a compra.</p>
          )}

          <button
            type="button"
            disabled={items.length === 0 || placing}
            onClick={handleCheckout}
            className="rounded-full bg-gold py-3 text-sm font-semibold text-bg hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {placing ? "Finalizando..." : isAuthenticated ? "Finalizar compra" : "Entrar para finalizar"}
          </button>
        </div>
      </aside>
    </>
  );
}
