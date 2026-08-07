"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Same sanctioned exception as AuthContext - hydrating from localStorage (browser-
    // only) can't happen in a lazy useState initializer without a hydration mismatch.
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setItems(JSON.parse(stored) as CartItem[]);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...current, { ...item, quantity }];
    });
    setIsOpen(true);
  }

  function removeItem(productId: number) {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((current) => current.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function clear() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clear,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
