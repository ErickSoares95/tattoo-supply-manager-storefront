"use client";

import { useWishlist } from "@/lib/store/WishlistContext";
import { HeartIcon } from "@/components/ui/icons";

const DEFAULT_CLASS =
  "absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-black/50 text-cream hover:border-gold hover:text-gold-light";

export function WishlistButton({
  productId,
  name,
  className = DEFAULT_CLASS,
}: {
  productId: number;
  name: string;
  className?: string;
}) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      aria-label={active ? `Remover ${name} da lista de desejos` : `Adicionar ${name} à lista de desejos`}
      aria-pressed={active}
      onClick={() => toggle(productId)}
      className={className}
    >
      <HeartIcon className={`h-4 w-4 ${active ? "fill-gold-light text-gold-light" : "fill-transparent"}`} />
    </button>
  );
}
