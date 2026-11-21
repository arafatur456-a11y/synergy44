'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PendantShape, ProductShape } from './types';

export type CartVisual =
  | { type: 'image'; src: string; alt: string }
  | { type: 'product'; shape: ProductShape; colors: [string, string]; cap: string; label: string }
  | { type: 'pendant'; shape: PendantShape; colors: [string, string, string, string] };

export type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  qty: number;
  visual: CartVisual;
  /** One-of-a-kind pieces can only be added once */
  unique?: boolean;
  /** WooCommerce product ID — present for live catalog items; required for online checkout */
  wcId?: number;
  /** Our product page for this item (/product/[slug]) */
  href?: string;
  /** WooCommerce variation ID for variable products */
  variationId?: number;
  /** Max purchasable quantity reported by WooCommerce (null/undefined = no limit) */
  maxQty?: number | null;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  /** Patch an item (e.g. sync live price / stock limits from a checkout quote) */
  update: (id: string, patch: Partial<Pick<CartItem, 'price' | 'qty' | 'maxQty' | 'name'>>) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'synergy44.cart.v1';

/**
 * Client cart persisted to localStorage. Items keep their WooCommerce product ID (`wcId`);
 * at checkout only IDs + quantities are sent to /api/checkout, which re-prices everything
 * against live WooCommerce data and creates the order server-side.
 * or a Shopify Storefront cart when connecting checkout.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const cap = item.unique ? 1 : Math.min(10, item.maxQty ?? existing?.maxQty ?? Infinity);
      if (existing) {
        if (existing.unique) return prev;
        return prev.map((i) => (i.id === item.id ? { ...i, ...item, qty: Math.min(cap, i.qty + qty) } : i));
      }
      return [...prev, { ...item, qty: Math.max(1, Math.min(cap, qty)) }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty: i.unique ? 1 : Math.min(qty, 10, i.maxQty ?? Infinity) } : i)),
    );
  }, []);

  const update = useCallback((id: string, patch: Partial<Pick<CartItem, 'price' | 'qty' | 'maxQty' | 'name'>>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      update,
      clear,
    }),
    [items, open, add, setQty, remove, update, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
