"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/app/types/types";

export interface CartItem {
  product: Product;
  count: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (product: Product, count?: number) => void;
  setItemCount: (productId: number, count: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "shopping-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item): item is CartItem =>
            item && typeof item.count === "number" && item.count > 0 &&
            item.product && typeof item.product.id === "number"
          ));
        }
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((product: Product, count = 1) => {
    if (product.quantity < 1) return;
    const amount = Math.max(1, Math.min(Math.floor(count), product.quantity));
    if (!amount) return;
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (!existing) return [...current, { product, count: amount }];
      return current.map((item) => item.product.id === product.id
        ? { product, count: Math.min(item.count + amount, product.quantity) }
        : item);
    });
  }, []);

  const setItemCount = useCallback((productId: number, count: number) => {
    setItems((current) => current.flatMap((item) => {
      if (item.product.id !== productId) return [item];
      const nextCount = Math.min(Math.floor(count), item.product.quantity);
      return nextCount > 0 ? [{ ...item, count: nextCount }] : [];
    }));
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);
  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.count, 0),
    addItem,
    setItemCount,
    removeItem,
    clearCart,
  }), [items, addItem, setItemCount, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
