'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { serviceGroups } from '@/lib/data/content';
import { cn, ease } from '@/lib/utils';

/** Printed-menu style salon pricing: numbered category tabs, rows with dotted leaders. */
export default function PricingMenu() {
  const [active, setActive] = useState(serviceGroups[0].id);
  const group = serviceGroups.find((g) => g.id === active)!;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
      <div role="tablist" aria-label="Service categories" aria-orientation="vertical" className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0 lg:col-span-4 lg:flex-col lg:gap-0 lg:border-t lg:border-ink">
        {serviceGroups.map((g, i) => (
          <button
            key={g.id}
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={active === g.id}
            aria-controls={`panel-${g.id}`}
            onClick={() => setActive(g.id)}
            className={cn(
              'group relative flex shrink-0 items-baseline gap-4 whitespace-nowrap rounded-[2px] border px-4 py-3 text-left transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-6',
              active === g.id ? 'border-ink bg-ink text-white lg:bg-transparent lg:text-ink' : 'border-line text-espresso-500 hover:text-ink',
            )}
          >
            <span className="hidden font-display text-lg italic text-champagne lg:inline">0{i + 1}</span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] lg:font-display lg:text-[1.7rem] lg:font-semibold lg:normal-case lg:tracking-normal">{g.title}</span>
            {active === g.id && <motion.span layoutId="svc-bar" className="absolute bottom-[-1px] left-0 hidden h-[2px] w-full bg-ink lg:block" transition={{ duration: 0.5, ease }} />}
          </button>
        ))}
      </div>

      <div className="lg:col-span-7 lg:col-start-6" id={`panel-${group.id}`} role="tabpanel" aria-labelledby={`tab-${group.id}`}>
        <AnimatePresence mode="wait">
          <motion.div key={group.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease }}>
            <div className="card relative overflow-hidden p-7 shadow-soft sm:p-10">
              <span aria-hidden className="absolute -right-4 -top-8 font-display text-[9rem] font-semibold italic leading-none text-ink/[0.04]">
                {group.title.charAt(0)}
              </span>
              <h3 className="relative font-display text-[2.2rem] font-semibold leading-none">{group.title}</h3>
              {group.note && <p className="relative mt-3 text-[14px] text-espresso-700">{group.note}</p>}
              <ul className="relative mt-8 border-t border-ink">
                {group.services.map((s) => (
                  <li key={s.name} className="group border-b border-line py-5">
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-[1.4rem] font-semibold leading-tight transition-transform duration-500 ease-silk group-hover:translate-x-1">{s.name}</span>
                      <span aria-hidden className="hidden flex-1 translate-y-[-4px] border-b border-dotted border-ink/30 sm:block" />
                      <span className="ml-auto whitespace-nowrap text-[16px] font-semibold tabular-nums sm:ml-0">{s.price}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-espresso-500">
                      <span>{s.detail}</span>
                      {s.duration && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
                          <Clock className="h-3.5 w-3.5" /> {s.duration}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
