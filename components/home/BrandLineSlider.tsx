'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { Brand } from '@/lib/types';
import { cn } from '@/lib/utils';

const GLIDE_MS = 3800;

/**
 * Brand-line showcase at the top of the home page.
 *
 * The track is a native horizontal scroller with scroll-snap: touch swipe, trackpad and
 * keyboard scrolling come for free and stay on the compositor (60fps, no layout shift — every
 * card has a fixed aspect ratio). Auto-glide advances one card at a time and pauses on hover,
 * focus, touch, when the slider is off-screen or the tab is hidden, and for reduced motion.
 */
export default function BrandLineSlider({ brands }: { brands: Brand[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || '16') || 16;
    const amount = (card?.offsetWidth ?? 260) + gap;
    const maxLeft = el.scrollWidth - el.clientWidth - 4;
    if (dir === 1 && el.scrollLeft >= maxLeft) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }, []);

  // Edge state for the prev/next buttons (rAF-throttled, passive)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      setAtStart(el.scrollLeft <= 4);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Pause when off-screen; respect reduced motion
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => setReduced(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => {
      io.disconnect();
      mq.removeEventListener('change', onMq);
    };
  }, []);

  const gliding = !hovered && !userPaused && visible && !reduced;
  useEffect(() => {
    if (!gliding) return;
    const t = setInterval(() => {
      if (!document.hidden) step(1);
    }, GLIDE_MS);
    return () => clearInterval(t);
  }, [gliding, step]);

  return (
    <section aria-labelledby="brand-lines-heading" className="relative border-b border-white/[0.06]">
      <div className="container-x pb-8 pt-6 sm:pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="brand-lines-heading" className="text-[1.35rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.5rem]">
              Shop by brand
            </h2>
            <p className="mt-1 text-[14px] text-stone-500">The lines Cynthia uses in her chair</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!reduced && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? 'Play brand slider' : 'Pause brand slider'}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-stone-500 transition-colors hover:border-accent-light/60 hover:text-ink"
              >
                {userPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous brands"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-ink transition-[background-color,border-color,opacity] hover:border-accent hover:bg-accent disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next brands"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-ink transition-[background-color,border-color] hover:border-accent hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <ul
          ref={track}
          role="list"
          aria-label="Product lines"
          tabIndex={0}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onTouchStart={() => setHovered(true)}
          onTouchEnd={() => setTimeout(() => setHovered(false), 4000)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 pt-2 outline-none sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [&:focus-visible]:ring-2 [&:focus-visible]:ring-accent/40"
        >
          {brands.map((b, i) => (
            <li key={b.slug} className="w-[62vw] max-w-[280px] shrink-0 snap-start sm:w-[240px] lg:w-[calc((100%-4*16px)/5)] lg:max-w-none">
              <Link
                href={`/products/hair-care/${b.slug}`}
                aria-label={`Shop ${b.name}: ${b.tagline}`}
                className="group block rounded-[18px] border border-white/[0.08] bg-surface p-2 transition-[transform,border-color,box-shadow] duration-500 ease-silk hover:-translate-y-1 hover:border-accent-light/50 hover:shadow-[0_24px_50px_-26px_rgba(0,0,0,0.95),0_0_32px_-10px_rgba(37,99,235,0.45)] focus-visible:border-accent-light"
              >
                <div className="relative aspect-square overflow-hidden rounded-[12px] bg-elevated" style={b.image && b.imageBg ? { background: b.imageBg } : undefined}>
                  {b.image ? (
                    <Image
                      src={b.image}
                      alt={`${b.name} product line`}
                      fill
                      priority={i < 2}
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 240px, 62vw"
                      className={cn('transition-transform duration-700 ease-silk group-hover:scale-[1.04]', b.imageFit === 'contain' ? 'object-contain' : 'object-cover')}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 grid place-items-center transition-transform duration-700 ease-silk group-hover:scale-[1.04]"
                      style={{ background: `radial-gradient(80% 70% at 50% 35%, ${b.tint}33, #1B2332 70%)` }}
                    >
                      <span className="px-4 text-center text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">{b.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-3 px-2 pb-1.5 pt-3.5">
                  <span className="min-w-0">
                    <span className="block truncate text-[15.5px] font-semibold text-ink">{b.name}</span>
                    <span className="block truncate text-[13px] text-stone-500">{b.tagline}</span>
                  </span>
                  <span className="shrink-0 text-[13px] font-medium text-iris-light opacity-80 transition-opacity group-hover:opacity-100">Shop</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
