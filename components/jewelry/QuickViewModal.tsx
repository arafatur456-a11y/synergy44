'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Ruler, Sparkles, X } from 'lucide-react';
import PendantVisual from './PendantVisual';
import type { Pendant } from '@/lib/data/jewelry';
import { useCart } from '@/lib/cart';
import { lockScroll } from '@/lib/lenis';
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
          <div className="absolute inset-0 bg-espresso/35 backdrop-blur-[4px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.6, ease }}
            className="relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-[32px] bg-cream shadow-lift sm:rounded-[32px] md:grid-cols-2"
            data-lenis-prevent
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream/80 backdrop-blur transition hover:bg-espresso hover:text-cream"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="iridescent relative flex min-h-[340px] items-start justify-center overflow-hidden p-10"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
              }}
            >
              <PendantVisual colors={item.colors} shape={item.shape} className="w-44 animate-drift sm:w-52" />
            </div>

            <div className="flex flex-col p-8 sm:p-10">
              <p className="eyebrow text-champagne">{item.collection}</p>
              <h3 id="qv-title" className="mt-3 font-display text-4xl font-light sm:text-5xl">
                {item.name}
              </h3>
              <p className="mt-3 font-display text-2xl">{formatPrice(item.price)}</p>
              <p className="mt-6 leading-relaxed text-espresso-500">{item.description}</p>

              <ul className="mt-8 space-y-3 border-t border-espresso/[0.08] pt-6 text-sm text-espresso-700">
                <li className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-champagne" strokeWidth={1.6} /> Handmade, kiln-fused dichroic glass
                </li>
                <li className="flex items-center gap-3">
                  <Ruler className="h-4 w-4 text-champagne" strokeWidth={1.6} /> Approx. {item.size}
                </li>
              </ul>

              <div className="mt-auto pt-10">
                <button
                  disabled={inBag}
                  onClick={() => {
                    add({
                      id: `pendant-${item.id}`,
                      name: item.name,
                      subtitle: `Dichroic glass · ${item.collection}`,
                      price: item.price,
                      unique: true,
                      visual: { type: 'pendant', shape: item.shape, colors: item.colors },
                    });
                    onClose();
                  }}
                  className="btn-dark w-full"
                >
                  {inBag ? (
                    <>
                      <Check className="h-4 w-4" /> In your bag
                    </>
                  ) : (
                    'Add to bag'
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-espresso-400">One of a kind — colors shift with the light.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
