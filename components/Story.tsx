'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Brush, Flame, GraduationCap, HeartHandshake, Scissors } from 'lucide-react';
import { milestones } from '@/lib/data';
import { cn } from '@/lib/utils';

const icons = [GraduationCap, Scissors, HeartHandshake, Flame, Brush];

export default function Story() {
  const timeline = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timeline, offset: ['start 70%', 'end 60%'] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="story" className="relative scroll-mt-24 py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow">Our Story</p>
          <h2 className="section-title mt-4">
            The Hair Healers <span className="block font-display italic text-stone-400">&amp; the artist behind the glass</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-stone-400">
            Synergy 44 is where two crafts meet: the science of healthy hair and the art of light. Both are guided by Cynthia Reedy — a
            trained artist and professional cosmetologist.
          </p>
        </motion.div>

        <div ref={timeline} className="relative mt-24">
          {/* Spine + scroll-linked glow fill */}
          <div aria-hidden className="absolute bottom-0 left-5 top-0 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            aria-hidden
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-5 top-0 w-px origin-top bg-gradient-to-b from-jade via-lilac to-blush shadow-glow md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="space-y-20 md:space-y-28">
            {milestones.map((m, i) => {
              const Icon = icons[i % icons.length];
              const flip = i % 2 === 1;
              return (
                <li key={m.title} className="relative grid items-center gap-8 pl-14 md:grid-cols-2 md:gap-20 md:pl-0">
                  {/* Node */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="absolute left-5 top-2 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-jade/40 bg-ink text-jade shadow-glow md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>

                  {/* Visual — swap the gradient block for a real photo via next/image */}
                  <motion.div
                    initial={{ opacity: 0, x: flip ? 60 : -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn('order-2 md:order-none', flip && 'md:col-start-2')}
                  >
                    <div className="glass group relative aspect-[4/3] overflow-hidden rounded-[28px]">
                      <div
                        className="absolute inset-0 opacity-70 transition-transform duration-[1.5s] group-hover:scale-110"
                        style={{
                          background: `radial-gradient(circle at 25% 30%, ${m.accent[0]}55, transparent 55%), radial-gradient(circle at 80% 80%, ${m.accent[1]}55, transparent 50%)`,
                        }}
                      />
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0_14px,rgba(255,255,255,.03)_14px_15px)]" />
                      <span className="absolute bottom-5 left-6 font-display text-[5.5rem] font-light italic leading-none text-white/10">
                        0{i + 1}
                      </span>
                      <Icon className="absolute right-6 top-6 h-8 w-8 text-white/30" strokeWidth={1.2} />
                    </div>
                  </motion.div>

                  {/* Copy */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn('order-1 md:order-none', flip && 'md:col-start-1 md:row-start-1 md:text-right')}
                  >
                    <p className="eyebrow">{m.phase}</p>
                    <h3 className="mt-3 font-display text-3xl font-light text-stone-50 sm:text-4xl">{m.title}</h3>
                    <p className={cn('mt-4 max-w-md leading-relaxed text-stone-400', flip && 'md:ml-auto')}>{m.body}</p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
