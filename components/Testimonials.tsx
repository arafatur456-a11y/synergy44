'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { testimonials } from '@/lib/data';
import { cn, ease } from '@/lib/utils';

export default function Testimonials({ index = '05', label = 'Kind words', className }: { index?: string; label?: string; className?: string }) {
  const [[active, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const idle = paused || !inView;

  const go = useCallback((d: number) => setState(([i]) => [(i + d + total) % total, d]), [total]);
  const select = (i: number) => setState(([cur]) => [i, i >= cur ? 1 : -1]);

  useEffect(() => {
    if (idle) return;
    const t = setTimeout(() => go(1), 7500);
    return () => clearTimeout(t);
  }, [idle, go, active]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  const t = testimonials[active];

  return (
    <section ref={ref} className={cn('container-x py-24 sm:py-32', className)} aria-roledescription="carousel" aria-label="Client testimonials" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <SectionHeader index={index} label={label} title={<>In their <em className="accent">words.</em></>} />

      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <ol className="order-2 border-t border-line lg:order-1 lg:col-span-4">
          {testimonials.map((r, i) => (
            <li key={r.name}>
              <button onClick={() => select(i)} aria-current={i === active} className="group relative flex w-full items-center justify-between border-b border-line py-5 text-left">
                <span>
                  <span className={cn('block font-display text-xl font-semibold transition-colors', i === active ? 'text-ink' : 'text-espresso-400 group-hover:text-ink')}>{r.name}</span>
                  <span className="mt-0.5 block text-[11px] uppercase tracking-[0.16em] text-espresso-500">{r.context}</span>
                </span>
                <span className="relative h-px w-10 overflow-hidden bg-line">
                  {i === active && (
                    <motion.span
                      key={`${active}-${idle}`}
                      className="absolute inset-y-0 left-0 bg-ink"
                      initial={{ width: idle ? '100%' : '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: idle ? 0 : 7.5, ease: 'linear' }}
                    />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="relative order-1 lg:order-2 lg:col-span-7 lg:col-start-6">
          <span aria-hidden className="block h-14 select-none font-display text-[9rem] font-semibold leading-[0.9] text-champagne">
            “
          </span>
          <div className="mt-4 flex gap-1" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-champagne text-champagne" />
            ))}
          </div>
          <div className="relative mt-6 min-h-[260px] sm:min-h-[230px]">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.figure
                key={active}
                initial={{ opacity: 0, y: dir * 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: dir * -24, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={onDragEnd}
                className="cursor-grab active:cursor-grabbing"
                aria-live="polite"
              >
                <blockquote className="font-display text-[1.85rem] font-medium leading-[1.22] tracking-[-0.01em] text-ink sm:text-[2.5rem]">{t.quote}</blockquote>
                <figcaption className="mt-8 text-[12px] font-semibold uppercase tracking-[0.2em]">
                  {t.name} <span className="text-espresso-400">— {t.context}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex gap-2">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white active:scale-95">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white active:scale-95">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
