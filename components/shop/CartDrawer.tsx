'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart, type CartItem } from '@/lib/cart';
import { lockScroll } from '@/lib/lenis';
import { formatPrice, ease } from '@/lib/utils';
import ProductVisual from './ProductVisual';
import PendantVisual from '@/components/jewelry/PendantVisual';

/** Set NEXT_PUBLIC_CHECKOUT_URL (e.g. WooCommerce /checkout) to enable direct checkout. */
const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL;

function Thumb({ item }: { item: CartItem }) {
  const v = item.visual;
  return (
    <div className="grid h-24 w-20 shrink-0 place-items-center overflow-hidden rounded-[3px] bg-[#ECE6DC]">
      {v.type === 'product' ? (
        <ProductVisual shape={v.shape} colors={v.colors} cap={v.cap} label={v.label} className="h-20" />
      ) : (
        <PendantVisual colors={v.colors} shape={v.shape} chain={false} className="w-12" />
      )}
    </div>
  );
}

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, count } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-paper shadow-float"
          >
            <div className="flex items-center justify-between border-b border-espresso/[0.08] px-6 py-5">
              <p className="font-display text-[1.9rem] font-semibold">
                Your bag <span className="text-espresso-400">({count})</span>
              </p>
              <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full hover:bg-espresso/5">
                <X className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-ink">
                  <ShoppingBag className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <p className="mt-5 font-display text-[1.9rem] font-semibold">Your bag is empty</p>
                <p className="mt-2 text-sm text-espresso-500">Discover clean hair care and one-of-a-kind glass.</p>
                <div className="mt-7 flex flex-col gap-3">
                  <Link href="/products/hair-care" onClick={() => setOpen(false)} className="btn-dark">
                    Shop hair care
                  </Link>
                  <Link href="/jewelry" onClick={() => setOpen(false)} className="btn-outline">
                    Explore glass jewelry
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-espresso/[0.07] overflow-y-auto px-6" data-lenis-prevent>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="flex gap-4 overflow-hidden py-5"
                      >
                        <Thumb item={item} />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-display text-[1.15rem] font-semibold leading-tight">{item.name}</p>
                              <p className="mt-0.5 truncate text-xs text-espresso-400">{item.subtitle}</p>
                            </div>
                            <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            {item.unique ? (
                              <span className="text-xs text-sage">One of a kind</span>
                            ) : (
                              <div className="flex items-center rounded-[2px] border border-line">
                                <button onClick={() => setQty(item.id, item.qty - 1)} aria-label={`Decrease ${item.name}`} className="grid h-8 w-8 place-items-center">
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center text-sm tabular-nums">{item.qty}</span>
                                <button onClick={() => setQty(item.id, item.qty + 1)} aria-label={`Increase ${item.name}`} className="grid h-8 w-8 place-items-center">
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                            <button onClick={() => remove(item.id)} className="text-xs text-espresso-400 underline-offset-4 hover:text-espresso hover:underline">
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-ink/10 bg-cream px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-espresso-500">Subtotal</span>
                    <span className="text-xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-espresso-400">Shipping and taxes calculated at checkout.</p>
                  {CHECKOUT_URL ? (
                    <a href={CHECKOUT_URL} className="btn-dark mt-5 w-full">
                      Checkout
                    </a>
                  ) : (
                    <>
                      <Link href="/contact?topic=product" onClick={() => setOpen(false)} className="btn-dark mt-5 w-full">
                        Request this order
                      </Link>
                      <p className="mt-2 text-center text-[11px] text-espresso-400">Online checkout is being connected — we’ll confirm your order personally.</p>
                    </>
                  )}
                  <button onClick={() => setOpen(false)} className="mt-3 w-full text-center text-sm text-espresso-500 hover:text-espresso">
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
