'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';
import PendantCard from '@/components/jewelry/PendantCard';
import QuickViewModal from '@/components/jewelry/QuickViewModal';
import type { Pendant } from '@/lib/types';
import { CARD_GRID } from '@/components/shop/CardParts';

const steps = [
  ['Cut', 'Glass is hand-cut and composed like a small painting.'],
  ['Fuse', 'Kiln-fired until the layers melt into one luminous form.'],
  ['Finish', 'Polished and set by hand — ready to catch the light.'],
];

export default function GlassStudio({ pendants }: { pendants: Pendant[] }) {
  const [selected, setSelected] = useState<Pendant | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section className="relative overflow-hidden bg-[#0D0C10] py-24 text-white sm:py-32">
      <div aria-hidden className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#5B4A7A]/25 blur-[120px]" />
      <div aria-hidden className="absolute -right-40 bottom-0 h-[420px] w-[520px] rounded-full bg-[#2E6B5A]/20 blur-[120px]" />

      <div className="container-x relative">
        <SectionHeader
          dark
          index="03"
          label="The glass studio"
          title={
            <>
              Light, <em className="font-medium italic text-champagne-light">layered</em> by hand.
            </>
          }
          intro="Dichroic glass carries microscopically thin layers of metal oxides that reflect one color and transmit another — so every pendant shifts as you move."
          action={
            <Link href="/jewelry" className="btn-light self-start">
              Enter the gallery <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <ul className={`mt-16 ${CARD_GRID} lg:grid-cols-4`}>
          {pendants.slice(0, 4).map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08}>
              <PendantCard pendant={p} onOpen={() => setSelected(p)} />
            </Reveal>
          ))}
        </ul>

        <ol className="mt-20 grid border-t border-white/15 sm:grid-cols-3">
          {steps.map(([t, b], i) => (
            <Reveal as="li" key={t} delay={i * 0.08} className="border-b border-white/15 py-7 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
              <span className="font-display text-sm italic text-champagne-light">0{i + 1}</span>
              <h3 className="mt-2 font-display text-2xl font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm text-white/60">{b}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      <QuickViewModal item={selected} onClose={close} />
    </section>
  );
}
