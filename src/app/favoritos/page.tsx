"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchProductById } from "@/lib/api/products";
import type { ProductResponse } from "@/lib/api/types";
import { useWishlist } from "@/lib/store/WishlistContext";
import { CatalogProductCard } from "@/components/shop/CatalogProductCard";

// Client Component: the wishlist itself lives in localStorage (see WishlistContext),
// so there's nothing to fetch server-side until we already know which product ids to
// ask the API for. Each id is fetched individually with fetchProductById rather than
// a batch endpoint - there's no GET /products?ids=... on the backend, and a wishlist
// realistically stays small enough that N requests here is not a real cost.
export default function FavoritosPage() {
  const { productIds } = useWishlist();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      // Keeps `products` in sync when the last item is removed from the wishlist while
      // this page is open - same kind of external-state sync as CartContext/
      // AccessibilityContext's localStorage hydration effects.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      productIds.map((id) =>
        fetchProductById(id).catch((err) => {
          // A product favorited earlier may have been deleted since - skip it instead
          // of breaking the whole page over one stale id.
          if (err instanceof ApiError && err.status === 404) return null;
          throw err;
        }),
      ),
    )
      .then((results) => setProducts(results.filter((p): p is ProductResponse => p !== null)))
      .finally(() => setLoading(false));
  }, [productIds]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <h1 className="font-serif text-3xl text-cream">Lista de desejos</h1>

      {loading && <p className="mt-6 text-muted">Carregando...</p>}

      {!loading && products.length === 0 && (
        <p className="mt-6 text-muted">
          Sua lista de desejos está vazia.{" "}
          <Link href="/produtos" className="text-gold-light hover:underline">
            Ver produtos
          </Link>
        </p>
      )}

      {!loading && products.length > 0 && (
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
          {products.map((product) => (
            <CatalogProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
