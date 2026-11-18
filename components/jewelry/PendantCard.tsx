'use client';

import { ArrowUpRight } from 'lucide-react';
import PendantVisual from './PendantVisual';
import TiltCard from '@/components/ui/TiltCard';
import type { Pendant } from '@/lib/data/jewelry';
import { formatPrice } from '@/lib/utils';

/** Dark glass gallery card: velvet spotlight, glowing pendant, hover zoom and tilt. */
export default function PendantCard({ pendant: p, onOpen }: { pendant: Pendant; onOpen?: () => void }) {
  const track = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <TiltCard max={5} className="rounded-[6px]">
      <button
        onClick={onOpen}
        onPointerMove={track}
        aria-label={`Quick view ${p.name}`}
        className="block w-full overflow-hidden rounded-[6px] border border-white/10 bg-white/[0.03] text-left text-white transition-colors duration-500 hover:border-white/25"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.08]"
            style={{ background: `radial-gradient(70% 55% at 50% 42%, ${p.colors[0]}38 0%, #1A1620 55%, #0B0A0D 100%)` }}
          >
            <div className="absolute left-1/2 top-[-10%] h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-white/[0.06] blur-2xl" />
            <div className="absolute inset-0 flex items-start justify-center">
              <PendantVisual colors={p.colors} shape={p.shape} className="w-[46%]" />
            </div>
          </div>
          <span className="absolute left-4 top-4 hidden rounded-[2px] sm:inline border border-white/20 bg-black/30 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
            One of one
          </span>
          <span className="absolute bottom-4 right-4 grid h-10 w-10 translate-y-3 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-5">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-champagne-light">{p.collection}</p>
            <h3 className="mt-1 font-display text-[1.05rem] font-semibold leading-tight sm:text-xl">{p.name}</h3>
          </div>
          <span className="text-[14px] font-semibold tabular-nums sm:text-[15px]">{formatPrice(p.price)}</span>
        </div>
      </button>
    </TiltCard>
  );
}
