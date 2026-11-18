'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import PendantVisual from './PendantVisual';
import QuickViewModal from './QuickViewModal';
import TiltCard from '@/components/ui/TiltCard';
import { collections, pendants, type Pendant } from '@/lib/data/jewelry';
import { cn, ease, formatPrice } from '@/lib/utils';

export default function JewelryGallery() {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState<Pendant | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const list = active === 'All' ? pendants : pendants.filter((p) => p.collection === active);

  const track = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by collection">
        {['All', ...collections].map((c) => (
          <button key={c} onClick={() => setActive(c)} aria-pressed={active === c} className={cn('chip', active === c ? 'chip-on' : 'chip-off')}>
            {c === 'All' ? 'All pieces' : c}
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-10 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
              transition={{ duration: 0.8, delay: i * 0.05, ease }}
              className={cn(i % 3 === 1 && 'lg:mt-12')}
            >
              <TiltCard className="frost rounded-[30px]">
                <button onClick={() => setSelected(p)} onPointerMove={track} className="block w-full p-3 text-left" aria-label={`Quick view ${p.name}`}>
                  <div className="relative flex h-80 items-start justify-center overflow-hidden rounded-[24px] bg-gradient-to-b from-white/70 via-cream-100/60 to-champagne-pale/60">
                    <div aria-hidden className="absolute bottom-8 h-28 w-28 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-70" style={{ background: p.colors[0] }} />
                    <PendantVisual colors={p.colors} shape={p.shape} className="relative w-36 transition-transform duration-1000 ease-silk group-hover:-rotate-2 group-hover:scale-105" />
                    <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-full bg-cream/90 px-4 py-2 text-xs font-semibold opacity-0 shadow-soft transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <Eye className="h-3.5 w-3.5" /> Quick view
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 px-3 pb-3 pt-5">
                    <div>
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-champagne">{p.collection}</p>
                      <h3 className="mt-1 font-display text-2xl">{p.name}</h3>
                    </div>
                    <span className="font-display text-xl">{formatPrice(p.price)}</span>
                  </div>
                </button>
              </TiltCard>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <QuickViewModal item={selected} onClose={close} />
    </>
  );
}
