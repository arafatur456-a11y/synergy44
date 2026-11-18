'use client';

import { useCallback, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Eye } from 'lucide-react';
import PendantVisual from './PendantVisual';
import QuickViewModal from './QuickViewModal';
import { pendants, type Pendant } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GlassGallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Pendant | null>(null);
  const close = useCallback(() => setSelected(null), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and translate the track horizontally,
      // while each card swings in from depth (rotateY + translateZ).
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const scroller = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>('.glass-card').forEach((card) => {
          gsap.fromTo(
            card,
            { rotateY: -32, z: -260, opacity: 0.35 },
            {
              rotateY: 0,
              z: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroller,
                start: 'left 105%',
                end: 'left 55%',
                scrub: true,
              },
            },
          );
        });

        gsap.to('.gallery-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  const onCardMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section ref={section} id="glass-art" className="relative scroll-mt-0 overflow-hidden py-24 md:h-[100svh] md:py-0">
      <div aria-hidden className="absolute left-1/3 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-lilac/10 blur-[150px]" />

      <div className="relative flex h-full flex-col justify-center">
        <div className="mx-auto mb-12 flex w-full max-w-7xl flex-col justify-between gap-6 px-5 sm:px-8 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-lilac">Collection 02 · Handmade by Cynthia Reedy</p>
            <h2 className="section-title mt-4">
              Dichroic <em className="text-gradient">Glass Gallery</em>
            </h2>
          </div>
          <p className="max-w-sm text-stone-400">
            Wearable light. Each pendant is kiln-fused from layered dichroic glass — colors shift as you move. Tap any piece for a closer
            look.
          </p>
        </div>

        <div className="[perspective:1800px]">
          <div
            ref={track}
            className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 no-scrollbar sm:px-8 md:w-max md:snap-none md:overflow-visible md:pb-0 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] md:pr-[12vw]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {pendants.map((p, i) => (
              <article
                key={p.id}
                onPointerMove={onCardMove}
                className="glass-card group glass relative w-[78vw] shrink-0 snap-center overflow-hidden rounded-[30px] sm:w-[340px] md:w-[360px]"
              >
                <button
                  onClick={() => setSelected(p)}
                  className="block w-full text-left"
                  aria-label={`Quick view ${p.name}`}
                >
                  {/* Shimmer border sweep */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(400px circle at var(--mx,50%) var(--my,50%), ${p.colors[0]}22, transparent 45%)`,
                    }}
                  />
                  <div className="relative flex h-80 items-start justify-center overflow-hidden">
                    <div aria-hidden className="absolute bottom-6 h-40 w-40 rounded-full opacity-50 blur-[70px] transition-opacity duration-500 group-hover:opacity-90" style={{ background: p.colors[0] }} />
                    <PendantVisual
                      colors={p.colors}
                      shape={p.shape}
                      className="relative w-40 transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110"
                    />
                    <span className="absolute left-5 top-5 font-display text-sm italic text-stone-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="relative border-t border-white/10 p-6">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-lilac/90">{p.collection}</p>
                    <div className="mt-2 flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl text-stone-50">{p.name}</h3>
                      <span className="font-display text-lg text-jade">{formatPrice(p.price)}</span>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-stone-300 transition-colors group-hover:text-jade">
                      <Eye className="h-4 w-4" /> Quick view
                    </span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 hidden w-full max-w-7xl px-8 md:block">
          <div className="h-px w-full bg-white/10">
            <div className="gallery-progress h-px origin-left scale-x-0 bg-gradient-to-r from-jade via-lilac to-blush" />
          </div>
        </div>
      </div>

      <QuickViewModal item={selected} onClose={close} />
    </section>
  );
}
