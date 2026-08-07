"use client";

import { useCart } from "@/lib/store/CartContext";
import { BagIcon } from "@/components/ui/icons";

// The only piece of Header that needs client state (the live item count + the
// open/close toggle) - kept as its own small component instead of making the whole
// Header a Client Component.
export function CartButton() {
  const { totalItems, open } = useCart();

  return (
    <button
      type="button"
      aria-label="Abrir carrinho de compras"
      onClick={open}
      className="relative flex items-center justify-center rounded-full p-2 text-cream hover:bg-gold/10 hover:text-gold-light"
    >
      <BagIcon className="h-5 w-5" />
      <span className="visually-hidden">Carrinho</span>
      <span
        aria-hidden
        className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-bg"
      >
        {totalItems}
      </span>
    </button>
  );
}
