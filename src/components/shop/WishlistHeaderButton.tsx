"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/store/WishlistContext";
import { HeartIcon } from "@/components/ui/icons";

// Same shape as cart/CartButton.tsx (live count badge, only client piece Header needs
// for this) - links to /favoritos instead of opening a drawer, since a wishlist doesn't
// need the same "keep shopping without leaving the page" urgency a cart does.
export function WishlistHeaderButton() {
  const { count } = useWishlist();

  return (
    <Link
      href="/favoritos"
      aria-label="Lista de desejos"
      className="relative flex items-center justify-center rounded-full p-2 text-cream hover:bg-gold/10 hover:text-gold-light"
    >
      <HeartIcon className="h-5 w-5" />
      <span className="visually-hidden">Desejos</span>
      <span
        aria-hidden
        className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-bg"
      >
        {count}
      </span>
    </Link>
  );
}
