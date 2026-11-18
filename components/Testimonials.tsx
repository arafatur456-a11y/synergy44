'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonials } from '@/lib/data';
import { cn } from '@/lib/utils';

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0, filter: 'blur(8px)' }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0, filter: 'blur(8px)' }),
};

function Stars({ rating, animKey }: { rating: number; animKey: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={`${animKey}-${i}`}
          initial={{ scale: 0, rotate: -40, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 400, damping: 14 }}
        >
          <Star
            className={cn('h-5 w-5', i < rating ? 'fill-jade text-jade drop-shadow-[0_0_8px_rgba(52,245,164,.85)]' : 'text-stone-700')}
          />
        </motion.span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  const paginate = useCallback(
    (d: number) => setState(([i]) => [(i + d + total) % total, d]),
    [total],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => paginate(1), 6500);
    return () => clearInterval(t);
  }, [paused, paginate, index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) paginate(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) paginate(-1);
  };

  const t = testimonials[index];

  return (
    <section id="reviews" className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36">
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-jade/10 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <p className="eyebrow">Kind Words</p>
        <h2 className="section-title mt-4">
          Loved by our <em className="text-gradient">clients</em>
        </h2>

        <div
          className="glass relative mt-14 overflow-hidden rounded-[32px] px-6 py-12 sm:px-14 sm:py-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-roledescription="carousel"
        >
          <Quote aria-hidden className="absolute left-6 top-6 h-16 w-16 text-jade/10 sm:left-10 sm:top-8" />

          <div className="relative min-h-[260px] sm:min-h-[220px]">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={onDragEnd}
                className="flex cursor-grab flex-col items-center active:cursor-grabbing"
                aria-live="polite"
              >
                <Stars rating={t.rating} animKey={index} />
                <blockquote className="mt-8 font-display text-2xl font-light leading-snug text-stone-100 sm:text-3xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-jade to-lilac font-display text-lg text-ink">
                    {t.name.charAt(0)}
                  </span>
                  <span className="text-left">
                    <span className="block font-semibold text-stone-100">{t.name}</span>
                    <span className="block text-xs text-stone-500">{t.context}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button onClick={() => paginate(-1)} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-stone-300 transition hover:border-jade hover:text-jade">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Go to review ${i + 1}`}
                  aria-current={i === index}
                  className={cn('h-2 rounded-full transition-all duration-500', i === index ? 'w-8 bg-jade shadow-glow' : 'w-2 bg-white/20 hover:bg-white/40')}
                />
              ))}
            </div>
            <button onClick={() => paginate(1)} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-stone-300 transition hover:border-jade hover:text-jade">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
