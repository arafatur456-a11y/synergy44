'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TiltCard from './TiltCard';
import ProductVisual from './ProductVisual';
import { hairProducts, type HairCategory } from '@/lib/data';
import { useCart } from '@/lib/cart';
import { cn, formatPrice } from '@/lib/utils';

const tabs: ('All' | HairCategory)[] = ['All', 'Repair', 'Hydrate', 'Style'];

export default function ProductShowcase() {
  const [active, setActive] = useState<(typeof tabs)[number]>('All');
  const { add } = useCart();

  const items = useMemo(
    () => (active === 'All' ? hairProducts : hairProducts.filter((p) => p.category === active)),
    [active],
  );

  return (
    <section id="hair-care" className="relative scroll-mt-24 py-28 sm:py-36">
      <div aria-hidden className="absolute right-0 top-40 h-96 w-96 rounded-full bg-jade/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow">Collection 01</p>
            <h2 className="section-title mt-4">
              Hair Care <em className="text-gradient">Elite</em>
            </h2>
            <p className="mt-5 max-w-lg text-stone-400">
              Salon-curated, organic and vegan formulas — chosen by our stylists to heal, hydrate and protect every hair type.
            </p>
          </motion.div>

          {/* Animated filter tabs */}
          <div role="tablist" aria-label="Filter hair care" className="glass flex w-full gap-1 overflow-x-auto rounded-full p-1.5 no-scrollbar sm:w-auto">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={active === t}
                onClick={() => setActive(t)}
                className={cn(
                  'relative flex-1 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:flex-none',
                  active === t ? 'text-ink' : 'text-stone-400 hover:text-stone-100',
                )}
              >
                {active === t && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-jade shadow-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="group glass h-full rounded-[28px] p-6">
                  <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.01] [transform:translateZ(30px)]">
                    <div
                      aria-hidden
                      className="absolute h-40 w-40 rounded-full opacity-60 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-90"
                      style={{ background: p.colors[1] }}
                    />
                    <ProductVisual
                      shape={p.shape}
                      colors={p.colors}
                      cap={p.cap}
                      label={p.brand}
                      className="relative h-60 drop-shadow-[0_25px_25px_rgba(0,0,0,.5)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105"
                    />
                    {p.tag && (
                      <span className="absolute left-4 top-4 rounded-full border border-jade/30 bg-ink/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-jade backdrop-blur">
                        {p.tag}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 [transform:translateZ(45px)]">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em]">
                      <span className="text-jade/80">{p.brand}</span>
                      <span className="text-stone-500">{p.size}</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl text-stone-50">{p.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-400">{p.blurb}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-display text-xl text-stone-100">{formatPrice(p.price)}</span>
                      <button
                        onClick={() => add(`${p.brand} ${p.name}`)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-stone-100 transition-all hover:border-jade hover:bg-jade hover:text-ink hover:shadow-glow"
                        aria-label={`Add ${p.brand} ${p.name} to bag`}
                      >
                        <Plus className="h-3.5 w-3.5" /> Add to bag
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
