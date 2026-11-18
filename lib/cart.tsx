'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

type CartContextValue = { count: number; add: (name: string) => void };

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Minimal client-side cart for the landing page.
 * Swap `add` for a WooCommerce Store API / Shopify Storefront call when wiring checkout.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState<{ id: number; name: string } | null>(null);

  const add = useCallback((name: string) => {
    setCount((c) => c + 1);
    setToast({ id: Date.now(), name });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <CartContext.Provider value={{ count, add }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="glass flex items-center gap-3 rounded-full px-5 py-3 text-sm text-stone-100"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-jade text-ink">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span>
                <strong className="font-semibold">{toast.name}</strong> added to your bag
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
