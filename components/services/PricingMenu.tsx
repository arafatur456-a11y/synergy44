'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { serviceGroups } from '@/lib/data/content';
import { cn, ease } from '@/lib/utils';

/** Editorial salon menu: tabs on all sizes, printed-menu style rows with dotted leaders. */
export default function PricingMenu() {
  const [active, setActive] = useState(serviceGroups[0].id);
  const group = serviceGroups.find((g) => g.id === active)!;

  return (
    <div className="card overflow-hidden">
      <div role="tablist" aria-label="Service categories" className="flex overflow-x-auto border-b border-espresso/[0.08] no-scrollbar">
        {serviceGroups.map((g) => (
          <button
            key={g.id}
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={active === g.id}
            aria-controls={`panel-${g.id}`}
            onClick={() => setActive(g.id)}
            className={cn(
              'relative flex-1 whitespace-nowrap px-6 py-5 text-[13px] font-semibold tracking-wide transition-colors',
              active === g.id ? 'text-espresso' : 'text-espresso-400 hover:text-espresso-700',
            )}
          >
            {g.title}
            {active === g.id && <motion.span layoutId="svc-tab" className="absolute inset-x-6 bottom-0 h-0.5 bg-sage" transition={{ duration: 0.5, ease }} />}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-10" id={`panel-${group.id}`} role="tabpanel" aria-labelledby={`tab-${group.id}`}>
        <AnimatePresence mode="wait">
          <motion.div key={group.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }}>
            <h3 className="font-display text-3xl sm:text-4xl">{group.title}</h3>
            {group.note && <p className="mt-2 text-sm text-espresso-500">{group.note}</p>}
            <ul className="mt-8 divide-y divide-espresso/[0.08]">
              {group.services.map((s) => (
                <li key={s.name} className="py-5">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-[1.45rem] leading-tight">{s.name}</span>
                    <span aria-hidden className="hidden flex-1 border-b border-dotted border-espresso/25 sm:block" />
                    <span className="ml-auto whitespace-nowrap font-semibold sm:ml-0">{s.price}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-espresso-500">
                    <span>{s.detail}</span>
                    {s.duration && (
                      <span className="inline-flex items-center gap-1 text-espresso-400">
                        <Clock className="h-3.5 w-3.5" /> {s.duration}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
