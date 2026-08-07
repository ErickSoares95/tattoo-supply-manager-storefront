"use client";

import { useState } from "react";
import { useCart } from "@/lib/store/CartContext";
import { BagIcon } from "@/components/ui/icons";

interface AddToCartFormProps {
  productId: number;
  name: string;
  price: number;
  stock: number;
}

export function AddToCartForm({ productId, name, price, stock }: AddToCartFormProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const inStock = stock > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-line">
        <button
          type="button"
          aria-label="Diminuir quantidade"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-10 w-10 items-center justify-center text-cream hover:text-gold-light"
        >
          −
        </button>
        <span aria-live="polite" className="w-8 text-center text-sm text-cream">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Aumentar quantidade"
          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          className="flex h-10 w-10 items-center justify-center text-cream hover:text-gold-light"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={!inStock}
        onClick={() => addItem({ productId, name, price }, quantity)}
        className="flex items-center gap-2 rounded-full border border-gold px-7 py-3 text-sm font-semibold text-gold-light hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <BagIcon className="h-4 w-4" />
        {inStock ? "Adicionar ao carrinho" : "Indisponível"}
      </button>
    </div>
  );
}
