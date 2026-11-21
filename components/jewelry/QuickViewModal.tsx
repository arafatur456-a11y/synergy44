'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Ruler, Sparkles, X } from 'lucide-react';
import PendantVisual from './PendantVisual';
import type { Pendant } from '@/lib/types';
import { productHref } from '@/lib/catalog-utils';
import { useCart } from '@/lib/cart';
import { lockScroll } from '@/lib/scroll-lock';
import { ease, formatPrice } from '@/lib/utils';

export default function QuickViewModal({ item, onClose }: { item: Pendant | null; onClose: () => void }) {
  const { add, items } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!item) return;
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  if (!mounted) return null;
  const inBag = !!item && items.some((i) => i.id === `pendant-${item.id}`);

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            initial={{ y: 50, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            className="relative grid max-h-[94svh] w-full max-w-5xl overflow-y-auto bg-paper shadow-float sm:rounded-[6px] md:grid-cols-[1.1fr_1fr]"
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/50 text-white transition hover:bg-white hover:text-ink md:border-ink/15 md:bg-paper md:text-ink md:hover:bg-ink md:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="sheen-live relative flex min-h-[380px] items-start justify-center overflow-hidden md:min-h-[560px]"
              style={{ background: `radial-gradient(70% 55% at 50% 42%, ${item.colors[0]}45 0%, #1A1620 55%, #0B0A0D 100%)` }}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
              }}
            >
              <div className="absolute left-1/2 top-[-10%] h-[70%] w-[70%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.09),transparent)]" />
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              ) : (
                <PendantVisual colors={item.colors} shape={item.shape} className="relative w-44 animate-drift sm:w-56" />
              )}
              <p className="absolute bottom-5 left-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">Move to see the colors shift</p>
            </div>

            <div className="flex flex-col p-8 sm:p-12">
              <p className="eyebrow">{item.collection}</p>
              <h3 id="qv-title" className="mt-5 font-display text-[2.8rem] font-semibold leading-none tracking-[-0.02em] sm:text-[3.4rem]">
                {item.name}
              </h3>
              <p className="mt-4 text-xl font-semibold tabular-nums">{formatPrice(item.price)}</p>
              <p className="mt-6 text-[15.5px] leading-relaxed text-espresso-700">{item.description}</p>

              <dl className="mt-8 divide-y divide-line border-y border-line text-[14px]">
                <div className="flex items-center justify-between py-3.5">
                  <dt className="flex items-center gap-2.5 text-espresso-500">
                    <Sparkles className="h-4 w-4 text-champagne" strokeWidth={1.6} /> Material
                  </dt>
                  <dd className="font-medium">Kiln-fused dichroic glass</dd>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <dt className="flex items-center gap-2.5 text-espresso-500">
                    <Ruler className="h-4 w-4 text-champagne" strokeWidth={1.6} /> Size
                  </dt>
                  <dd className="font-medium">{item.size ? `Approx. ${item.size}` : 'One of a kind'}</dd>
                </div>
              </dl>

              <div className="mt-auto pt-10">
                <button
                  disabled={inBag || item.inStock === false}
                  onClick={() => {
                    add({
                      id: `pendant-${item.id}`,
                      name: item.name,
                      subtitle: `Dichroic glass · ${item.collection}`,
                      price: item.price,
                      unique: true,
                      wcId: item.wcId,
                      maxQty: 1,
                      visual: item.image ? { type: 'image', src: item.image, alt: item.name } : { type: 'pendant', shape: item.shape, colors: item.colors },
                    });
                    onClose();
                  }}
                  className="btn-dark w-full"
                >
                  {item.inStock === false ? (
                    'Sold'
                  ) : inBag ? (
                    <>
                      <Check className="h-4 w-4" /> In your bag
                    </>
                  ) : (
                    <>
                      Add to bag — {formatPrice(item.price)} <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <Link href={productHref(item)} onClick={onClose} className="link-underline mx-auto mt-5 flex w-max">
                  View full details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.16em] text-espresso-500">One of a kind · handmade by Cynthia Reedy</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
