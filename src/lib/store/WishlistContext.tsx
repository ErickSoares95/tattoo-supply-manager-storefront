"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface WishlistContextValue {
  productIds: number[];
  isWishlisted: (productId: number) => boolean;
  toggle: (productId: number) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const STORAGE_KEY = "wishlist";

// Same Provider+localStorage pattern as CartContext/AccessibilityContext - the heart
// icon used to be pure decoration (no onClick anywhere, see git history on ProductCard/
// Header) despite the "Desejos" label promising something real. This makes it real:
// per-browser persisted list of product ids, no backend involvement (there's no
// Wishlist concept on the Spring Boot side, and it doesn't need one - this is exactly
// the kind of per-viewer preference localStorage is for).
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setProductIds(JSON.parse(stored) as number[]);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
  }, [productIds, hydrated]);

  function toggle(productId: number) {
    setProductIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );
  }

  function isWishlisted(productId: number) {
    return productIds.includes(productId);
  }

  return (
    <WishlistContext.Provider value={{ productIds, isWishlisted, toggle, count: productIds.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
