'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CONCIERGE_EVENT, type ConciergeOpen } from '@/lib/concierge';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/utils';

// The drawer (chat, booking flow) is only downloaded the first time someone opens it.
const ConciergeDrawer = dynamic(() => import('./ConciergeDrawer'), { ssr: false });

/** Floating "Concierge" button + lazy drawer. Mounted once in the root layout. */
export default function ConciergeLauncher() {
  const { open: cartOpen } = useCart();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const [request, setRequest] = useState<ConciergeOpen & { n: number }>({ n: 0 });

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<ConciergeOpen>).detail ?? {};
      setRequest((r) => ({ ...detail, n: r.n + 1 }));
      setLoaded(true);
      setOpen(true);
    };
    window.addEventListener(CONCIERGE_EVENT, onOpen);
    return () => window.removeEventListener(CONCIERGE_EVENT, onOpen);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={() => setLoaded(true) /* warm the chunk on hover */}
        aria-label="Open the Synergy 44 Concierge"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-[70] flex h-14 items-center gap-3 rounded-full border border-champagne/40 bg-ink pl-4 pr-4 text-white shadow-float transition-[opacity,transform] duration-500 ease-silk hover:-translate-y-0.5 sm:right-6 sm:pr-6',
          (open || cartOpen) && 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#F1E6CF,#A27D42_70%)] text-ink">
          <Sparkles className="h-4 w-4" strokeWidth={1.7} />
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block font-display text-[1.02rem] font-semibold italic">Concierge</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">Hair · Glass · Booking</span>
        </span>
      </button>
      {loaded && <ConciergeDrawer open={open} onClose={close} request={request} />}
    </>
  );
}
