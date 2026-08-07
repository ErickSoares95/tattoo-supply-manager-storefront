"use client";

import { useCart } from "@/lib/store/CartContext";
import { BagIcon } from "@/components/ui/icons";

interface AddToCartButtonProps {
  productId: number;
  name: string;
  price: number;
  inStock: boolean;
  quantity?: number;
}

// The only client piece of an otherwise server-rendered product card/page - extracted
// so CatalogProductCard and the product detail page stay Server Components except for
// this one interactive control.
export function AddToCartButton({ productId, name, price, inStock, quantity = 1 }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      disabled={!inStock}
      onClick={() => addItem({ productId, name, price }, quantity)}
      className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-gold py-2.5 text-[13px] font-semibold text-gold-light hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gold-light"
    >
      <BagIcon className="h-4 w-4" />
      {inStock ? "Adicionar ao carrinho" : "Indisponível"}
    </button>
  );
}
