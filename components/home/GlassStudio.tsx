'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';
import PendantCard from '@/components/jewelry/PendantCard';
import QuickViewModal from '@/components/jewelry/QuickViewModal';
import type { Pendant } from '@/lib/types';
import { CARD_GRID } from '@/components/shop/CardParts';
import InstagramLink from '@/components/ui/InstagramLink';

const steps = [
  ['Cut', 'Sheets of dichroic and clear glass are cut and stacked by hand, like a small collage.'],
  ['Fuse', 'The stack is fired in the kiln until the layers melt into a single piece.'],
  ['Finish', 'Each piece is polished, fitted with a bail and strung, ready to wear.'],
];

export default function GlassStudio({ pendants }: { pendants: Pendant[] }) {
  const [selected, setSelected] = useState<Pendant | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section className="relative overflow-hidden bg-kiln py-20 text-white sm:py-28">

      <div className="container-x relative">
        <SectionHeader
          dark
          title="Every pendant is one of a kind"
          intro="Dichroic glass carries layers of metal oxide thinner than a soap bubble. They reflect one color and let another through, so each piece changes as you move."
          action={
            <Link href="/jewelry" className="btn-light">
              See all the glass
            </Link>
          }
        />

        <ul className={`mt-14 ${CARD_GRID} lg:grid-cols-4`}>
          {pendants.slice(0, 4).map((p) => (
            <li key={p.id}>
              <PendantCard pendant={p} onOpen={() => setSelected(p)} />
            </li>
          ))}
        </ul>

        {/* A real sequence, so it's numbered */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <h3 className="text-[15px] font-medium text-white/60 lg:col-span-3">How a pendant is made</h3>
          <ol className="grid gap-8 sm:grid-cols-3 lg:col-span-9">
            {steps.map(([t, b], i) => (
              <li key={t}>
                <p className="flex items-baseline gap-3">
                  <span className="text-[15px] tabular-nums text-iris-light">{i + 1}.</span>
                  <span className="text-[1.5rem] font-semibold tracking-[-0.02em]">{t}</span>
                </p>
                <p className="mt-2 max-w-[30ch] font-serif text-[1.05rem] leading-relaxed text-white/65">{b}</p>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[15px] leading-relaxed text-white/65">
            New pieces appear in the studio feed first, along with kiln days and works in progress.
          </p>
          <InstagramLink tone="dark" variant="pill" label="Follow @synergy44llc" className="self-start sm:self-auto" />
        </Reveal>
      </div>

      <QuickViewModal item={selected} onClose={close} />
    </section>
  );
}
