'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { ArrowRight, Gem, Leaf, Sparkles } from 'lucide-react';
import ProductVisual from './ProductVisual';
import PendantVisual from './PendantVisual';

// WebGL is client-only and non-critical: load it after hydration so it never blocks LCP.
const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false });

const lines: { words: string[]; accent?: boolean }[] = [
  { words: ['Healthy', 'hair.'] },
  { words: ['Living', 'light.'], accent: true },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
const word: Variants = {
  hidden: { y: '115%', rotate: 4 },
  show: { y: '0%', rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.7 + d, ease: [0.16, 1, 0.3, 1] } }),
};

function FloatingCard({
  mx,
  my,
  depth,
  className,
  children,
  delay = 0,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  const rotateY = useTransform(mx, (v) => v * 18);
  const rotateX = useTransform(my, (v) => v * -18);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.9 + delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ x, y, rotateX, rotateY, transformPerspective: 900 }}
      className={`glass absolute rounded-3xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });

  // Scroll-linked depth: content recedes as you scroll past the hero
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  // Mouse parallax for glass cards
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === 'touch') return;
    rawX.set(e.clientX / window.innerWidth - 0.5);
    rawY.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-[520px] w-[520px] animate-pulse-glow rounded-full bg-jade/20 blur-[140px]" />
        <div className="absolute -right-32 top-10 h-[460px] w-[460px] animate-pulse-glow rounded-full bg-lilac/15 blur-[140px] [animation-delay:-3s]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-blush/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
      </div>

      {!reduce && (
        <div aria-hidden className="absolute inset-0">
          <ParticleField eventSource={ref} active={inView} />
        </div>
      )}

      <motion.div style={{ y: textY, opacity: fade, scale }} className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={-0.6} className="mb-8 inline-flex items-center gap-2 rounded-full border border-jade/25 bg-jade/[0.06] px-4 py-1.5 text-xs text-jade-soft backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Organic · Vegan · Handmade in Michigan
          </motion.div>

          <motion.h1 variants={container} initial="hidden" animate="show" className="font-display text-[clamp(2.8rem,7.4vw,6.9rem)] font-light leading-[0.92] tracking-[-0.035em] text-stone-50">
            {lines.map((line, i) => (
              <span key={i} className="block whitespace-nowrap">
                {line.words.map((w) => (
                  <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span variants={word} className={`inline-block ${line.accent ? 'text-gradient italic' : ''}`}>
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0} className="mt-8 max-w-xl text-base leading-relaxed text-stone-400 sm:text-lg">
            Premium organic &amp; vegan hair care from Loma, MKS eco, Olaplex and Neuma — paired with one-of-a-kind dichroic glass
            jewelry, handmade by artist and cosmetologist Cynthia Reedy.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.15} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#hair-care" className="btn-primary group">
              <Leaf className="h-4 w-4" />
              Explore Luxury Care
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#glass-art" className="btn-ghost group">
              <Gem className="h-4 w-4 text-lilac" />
              Discover Glass Art
            </a>
          </motion.div>

          <motion.dl variants={fadeUp} initial="hidden" animate="show" custom={0.3} className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[
              ['100%', 'Vegan formulas'],
              ['1 of 1', 'Glass pieces'],
              ['MI · CA', 'Salon studios'],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="font-display text-2xl text-stone-50">{k}</dt>
                <dd className="mt-1 text-xs text-stone-500">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Interactive glassmorphism cards */}
        <div className="relative hidden h-[540px] lg:col-span-5 lg:block">
          <div aria-hidden className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-jade/40 via-lilac/30 to-blush/30 blur-3xl" />

          <FloatingCard mx={mx} my={my} depth={-40} className="left-4 top-6 w-56 p-5">
            <div className="flex h-44 items-end justify-center rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent">
              <ProductVisual shape="pump" colors={['#f3e3c3', '#a3804c']} cap="#e7e5e4" label="Loma" className="h-40 drop-shadow-2xl" />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-jade/80">Loma</p>
            <p className="font-display text-lg text-stone-50">Leave-In Conditioner</p>
          </FloatingCard>

          <FloatingCard mx={mx} my={my} depth={55} delay={0.15} className="bottom-4 right-0 w-60 p-5">
            <div className="flex h-48 items-start justify-center rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent">
              <PendantVisual colors={['#34f5a4', '#3b82f6', '#a855f7', '#22d3ee']} shape="oval" className="w-28" />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-lilac">Dichroic Glass</p>
            <p className="font-display text-lg text-stone-50">Aurora Veil Pendant</p>
          </FloatingCard>

          <FloatingCard mx={mx} my={my} depth={90} delay={0.3} className="bottom-10 left-0 flex items-center gap-3 rounded-full px-4 py-2.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-jade shadow-glow" />
            <span className="text-xs text-stone-200">Now booking · Michigan &amp; California</span>
          </FloatingCard>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#hair-care"
        aria-label="Scroll to collections"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-stone-500 sm:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-jade"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  );
}
