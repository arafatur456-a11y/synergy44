'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PendantCard from './PendantCard';
import QuickViewModal from './QuickViewModal';
import { collectionsOf } from '@/lib/catalog-utils';
import type { Pendant } from '@/lib/types';
import { CARD_GRID } from '@/components/shop/CardParts';
import { cn, ease } from '@/lib/utils';

export default function JewelryGallery({ pendants }: { pendants: Pendant[] }) {
  const collections = collectionsOf(pendants);
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState<Pendant | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const list = active === 'All' ? pendants : pendants.filter((p) => p.collection === active);

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by collection">
          {['All', ...collections].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={cn(
                'chip',
                active === c ? 'border-white bg-white text-ink' : 'border-white/20 bg-transparent text-white/75 hover:border-white/60 hover:text-white',
              )}
            >
              {c === 'All' ? 'All pieces' : c}
            </button>
          ))}
        </div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60" aria-live="polite">
          {list.length} {list.length === 1 ? 'piece' : 'pieces'}
        </p>
      </div>

      <motion.ul layout className={`mt-12 ${CARD_GRID} lg:grid-cols-3`}>
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.8, delay: i * 0.05, ease }}
            >
              <PendantCard pendant={p} onOpen={() => setSelected(p)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <QuickViewModal item={selected} onClose={close} />
    </>
  );
}
