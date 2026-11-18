'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { testimonials } from '@/lib/data/content';
import { cn, ease } from '@/lib/utils';

export default function Testimonials({ eyebrow = 'Kind words', className }: { eyebrow?: string; className?: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  const go = useCallback((d: number) => setState(([i]) => [(i + d + total) % total, d]), [total]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), 7000);
    return () => clearTimeout(t);
  }, [paused, go, index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  const t = testimonials[index];

  return (
    <section
      className={cn('container-x py-24 sm:py-32', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow">{eyebrow}</p>
        <div className="mt-6 flex justify-center gap-1.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-champagne text-champagne" />
          ))}
        </div>

        <div className="relative mt-8 min-h-[250px] sm:min-h-[220px]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.figure
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.7, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={onDragEnd}
              className="cursor-grab active:cursor-grabbing"
              aria-live="polite"
            >
              <blockquote className="font-display text-[1.9rem] font-light leading-[1.25] sm:text-[2.6rem]">“{t.quote}”</blockquote>
              <figcaption className="mt-8 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-espresso-400"> — {t.context}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-espresso/15 transition hover:border-espresso hover:bg-espresso hover:text-cream">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index}
                className={cn('h-1.5 rounded-full transition-all duration-500', i === index ? 'w-8 bg-sage' : 'w-1.5 bg-espresso/20 hover:bg-espresso/40')}
              />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-espresso/15 transition hover:border-espresso hover:bg-espresso hover:text-cream">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
