'use client';

import Link from 'next/link';
import PendantVisual from '@/components/jewelry/PendantVisual';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import { pendants } from '@/lib/data/jewelry';
import { formatPrice } from '@/lib/utils';

const picks = pendants.slice(0, 4);

export default function JewelryTeaser() {
  const track = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <div className="iridescent relative overflow-hidden rounded-[40px] px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
          <div aria-hidden className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/50 blur-3xl" />
          <div className="relative grid gap-12 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow text-[#7A6893]">The glass studio</p>
              <h2 className="h-section mt-4">
                Light, <em>layered</em> by hand.
              </h2>
              <p className="lead mt-5">
                Dichroic glass carries thin layers of metal oxides that reflect one color and transmit another — so every pendant
                shifts as you move.
              </p>
              <Link href="/jewelry" className="btn-dark mt-8">
                View the gallery
              </Link>
            </Reveal>

            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 no-scrollbar sm:-mx-12 sm:px-12 lg:col-span-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
              {picks.map((p, i) => (
                <Parallax key={p.id} speed={i % 2 ? 26 : 12} className="w-[62vw] shrink-0 snap-center sm:w-[260px] lg:w-auto">
                  <Link href="/jewelry" onPointerMove={track} className="frost group block rounded-[26px] p-3">
                    <div className="flex h-56 items-start justify-center overflow-hidden rounded-[20px] bg-white/40">
                      <PendantVisual colors={p.colors} shape={p.shape} className="w-28 transition-transform duration-700 ease-silk group-hover:scale-105" />
                    </div>
                    <div className="px-2 pb-1 pt-4">
                      <p className="font-display text-xl leading-tight">{p.name}</p>
                      <p className="mt-1 text-xs text-espresso-500">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                </Parallax>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
