'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import BotanicalSprig from '@/components/ui/BotanicalSprig';
import ProductVisual from '@/components/shop/ProductVisual';
import PendantVisual from '@/components/jewelry/PendantVisual';
import { ease } from '@/lib/utils';

const lines = [
  <>The art of</>,
  <>
    <em className="text-iridescent pr-1">healthy</em> hair
  </>,
  <>
    &amp; <em className="text-iridescent pr-1">handmade</em> light.
  </>,
];

function Float({
  mx,
  my,
  depth,
  className,
  delay,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className: string;
  delay: number;
  children: React.ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute z-10 ${className}`}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay, ease }}>
        <div className="animate-drift" style={{ animationDelay: `${-delay * 3}s` }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 40, damping: 20 });
  const my = useSpring(rawY, { stiffness: 40, damping: 20 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const archY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    rawX.set(e.clientX / window.innerWidth - 0.5);
    rawY.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section ref={ref} onPointerMove={onMove} className="relative overflow-hidden">
      <div aria-hidden className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-champagne-pale opacity-70 blur-3xl" />

      <div className="container-x relative grid items-center gap-14 pb-24 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-16">
        <motion.div style={reduce ? undefined : { y: textY }} className="lg:col-span-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }} className="eyebrow">
            Organic hair care · Artisan glass · Salon
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.9rem,5.2vw,5.1rem)] font-light leading-[1] tracking-[-0.015em]">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.3, delay: 0.15 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.65, ease }}>
            <p className="lead mt-8 max-w-lg">
              Clean, organic and vegan hair care from Loma, MKS Eco, Olaplex and Neuma — alongside one-of-a-kind dichroic glass
              jewelry, handmade by cosmetologist and artist Cynthia Reedy.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/products/hair-care" className="btn-dark group">
                Shop Hair Care <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <Link href="/jewelry" className="btn-outline">
                Discover Glass Art
              </Link>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-espresso-500">
              <li className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-sage" strokeWidth={1.6} /> Organic &amp; vegan-forward
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-champagne" strokeWidth={1.6} /> Handmade glass
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sage" strokeWidth={1.6} /> Licensed cosmetologist
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Editorial composition */}
        <div className="relative h-[480px] sm:h-[600px] lg:col-span-6 lg:h-[640px]">
          <motion.div
            style={reduce ? undefined : { y: archY }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease }}
            className="absolute right-0 top-0 h-[92%] w-[80%] overflow-hidden rounded-t-full shadow-float"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-sage-mist via-[#E5ECE4] to-champagne-pale" />
            <div className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full bg-champagne-light/70 blur-2xl" />
            <BotanicalSprig className="absolute bottom-0 left-1/2 h-[88%] -translate-x-1/2 text-sage/45" leaves={8} />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-champagne-pale/90 to-transparent" />
          </motion.div>

          <Float mx={mx} my={my} depth={-18} delay={0.5} className="bottom-6 left-0 w-44 sm:bottom-10 sm:w-56">
            <TiltCard className="frost rounded-[26px] p-4">
              <div className="flex h-40 items-end justify-center rounded-[20px] bg-gradient-to-b from-white/80 to-cream-100/50 sm:h-52">
                <ProductVisual shape="spray" colors={['#F1E4CA', '#B99766']} cap="#F7F3EC" label="Loma" className="h-[88%]" />
              </div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">Loma</p>
              <p className="font-display text-lg leading-tight">Leave-In Conditioner</p>
            </TiltCard>
          </Float>

          <Float mx={mx} my={my} depth={24} delay={0.7} className="right-2 top-8 w-40 sm:right-6 sm:w-48">
            <TiltCard className="frost rounded-[26px] p-4">
              <div
                className="flex h-40 items-start justify-center overflow-hidden rounded-[20px] bg-gradient-to-b from-white/80 to-cream-100/40 sm:h-48"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
                }}
              >
                <PendantVisual colors={['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6']} shape="oval" className="w-24 sm:w-28" />
              </div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne">Dichroic glass</p>
              <p className="font-display text-lg leading-tight">Aurora Veil</p>
            </TiltCard>
          </Float>

          <Float mx={mx} my={my} depth={36} delay={0.9} className="bottom-24 right-0 hidden sm:block">
            <div className="frost flex items-center gap-3 rounded-full py-2.5 pl-3 pr-5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sage text-cream">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <span className="text-[13px] font-medium">The Synergy 44 Guarantee</span>
            </div>
          </Float>
        </div>
      </div>
    </section>
  );
}
