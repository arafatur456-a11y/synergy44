'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Ruler, ShoppingBag, Sparkles, X } from 'lucide-react';
import PendantVisual from './PendantVisual';
import type { Pendant } from '@/lib/data';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

export default function QuickViewModal({ item, onClose }: { item: Pendant | null; onClose: () => void }) {
  const { add } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape to close, lock page scroll, move focus into the dialog
  useEffect(() => {
    if (!item) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    stageRef.current?.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    stageRef.current?.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  // Portal to <body>: the gallery section is GSAP-pinned (transformed), which would trap `position: fixed`.
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-lenis-prevent
        >
          <div className="absolute inset-0 bg-ink/75 backdrop-blur-md" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="glass relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-[32px] bg-ink-900/80 sm:rounded-[32px] md:grid-cols-2"
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink/60 text-stone-200 transition hover:border-jade hover:text-jade"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              ref={stageRef}
              onPointerMove={onMove}
              className="relative flex min-h-[340px] items-start justify-center overflow-hidden bg-gradient-to-b from-white/[0.05] to-transparent p-10"
            >
              <div aria-hidden className="absolute bottom-0 h-48 w-48 rounded-full blur-[90px]" style={{ background: item.colors[0] }} />
              <PendantVisual colors={item.colors} shape={item.shape} className="relative w-44 animate-float sm:w-52" />
            </div>

            <div className="flex flex-col p-8 sm:p-10">
              <p className="eyebrow text-lilac">{item.collection}</p>
              <h3 id="qv-title" className="mt-3 font-display text-4xl font-light text-stone-50">
                {item.name}
              </h3>
              <p className="mt-2 font-display text-2xl text-jade">{formatPrice(item.price)}</p>
              <p className="mt-6 leading-relaxed text-stone-400">{item.description}</p>

              <ul className="mt-8 space-y-3 text-sm text-stone-300">
                <li className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-jade" /> Handmade, kiln-fused dichroic glass — one of a kind
                </li>
                <li className="flex items-center gap-3">
                  <Ruler className="h-4 w-4 text-jade" /> Approx. {item.size} · sterling-finish bail
                </li>
              </ul>

              <div className="mt-auto pt-10">
                <button
                  onClick={() => {
                    add(item.name);
                    onClose();
                  }}
                  className="btn-primary w-full justify-center"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to bag
                </button>
                <p className="mt-3 text-center text-xs text-stone-500">Colors shift with light — no two pieces are alike.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
