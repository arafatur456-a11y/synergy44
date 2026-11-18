'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, Plus, Star } from 'lucide-react';
import StudioScene from '@/components/ui/StudioScene';
import ProductVisual from '@/components/shop/ProductVisual';
import PendantVisual from '@/components/jewelry/PendantVisual';
import { useCart } from '@/lib/cart';
import Image from 'next/image';
import { getBrand, products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ease, formatPrice } from '@/lib/utils';

const leaveIn = products.find((p) => p.id === 'loma-leave-in')!;
const bond = products.find((p) => p.id === 'olaplex-7')!;
const bounce = products.find((p) => p.id === 'mks-bounce')!;

function Float({ mx, my, depth, className, delay, children }: { mx: MotionValue<number>; my: MotionValue<number>; depth: number; className: string; delay: number; children: React.ReactNode }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute z-20 ${className}`}>
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.3, delay, ease }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Floating "quick add" card — uses a live catalog product passed from the page. */
function SpotlightCard({ product: p }: { product: Product }) {
  const { add } = useCart();
  const brandName = getBrand(p.brand)?.name ?? p.brand;
  const canAdd = p.inStock !== false && p.type !== 'variable';
  return (
    <div className="glass p-3">
      <div className="flex gap-3">
        <div className="relative grid h-[86px] w-[70px] shrink-0 place-items-center overflow-hidden rounded-[8px] bg-gradient-to-b from-white to-cream-100">
          {p.image ? (
            <Image src={p.image} alt={p.name} fill sizes="70px" className="object-cover" />
          ) : (
            <ProductVisual shape={p.shape} colors={p.colors} cap={p.cap} label={brandName} className="h-[74px]" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col py-0.5">
          <p className="truncate text-[9.5px] font-semibold uppercase tracking-[0.18em] text-sage-dark">
            {p.badge ?? 'Featured'} · {brandName}
          </p>
          <p className="mt-1 line-clamp-2 font-display text-[1.05rem] font-semibold leading-tight">{p.name}</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm font-semibold tabular-nums">{formatPrice(p.price)}</span>
            {canAdd ? (
              <button
                onClick={() =>
                  add({
                    id: p.id,
                    name: p.name,
                    subtitle: [brandName, p.size].filter(Boolean).join(' · '),
                    price: p.price,
                    wcId: p.wcId,
                    maxQty: p.stockQuantity,
                    visual: p.image ? { type: 'image', src: p.image, alt: p.name } : { type: 'product', shape: p.shape, colors: p.colors, cap: p.cap, label: brandName },
                  })
                }
                aria-label={`Quick add ${brandName} ${p.name}`}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white transition-transform duration-300 hover:scale-110 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            ) : (
              <a href={p.permalink ?? '/products/hair-care'} className="text-[10px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4">
                View
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ spotlight }: { spotlight?: Product }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 50, damping: 18 });
  const my = useSpring(rawY, { stiffness: 50, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    rawX.set(e.clientX / window.innerWidth - 0.5);
    rawY.set(e.clientY / window.innerHeight - 0.5);
  };

  const words = ['Hair,', 'healed.'];

  return (
    <section ref={ref} onPointerMove={onMove} className="relative overflow-hidden border-b border-ink/10">
      <div className="grid lg:min-h-[calc(100svh-120px)] lg:grid-cols-[1.02fr_1fr]">
        {/* Copy */}
        <motion.div style={reduce ? undefined : { y: textY }} className="relative z-10 flex flex-col justify-center px-5 pb-16 pt-12 sm:px-8 lg:py-14 lg:pl-[max(3rem,calc((100vw-1380px)/2+3rem))] lg:pr-16">
          <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease }} className="eyebrow">
            Organic hair care · Artisan glass
          </motion.p>

          <h1 className="mt-7 font-display font-semibold leading-[0.92] tracking-[-0.035em] text-ink">
            <span className="block overflow-hidden pb-[0.04em] text-[clamp(3.3rem,6.3vw,6.8rem)]">
              {words.map((w, i) => (
                <motion.span key={w} className="mr-[0.2em] inline-block" initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.1 + i * 0.1, ease }}>
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden pb-[0.12em] text-[clamp(3.3rem,6.3vw,6.8rem)]">
              <motion.span className="inline-block" initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.32, ease }}>
                Light, <em className="font-medium text-champagne">handmade.</em>
              </motion.span>
            </span>
          </h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.6, ease }}>
            <p className="lead mt-7 max-w-[34rem]">
              A salon, an apothecary and a glass studio under one roof — clean, organic hair care and one-of-a-kind dichroic jewelry,
              handmade by cosmetologist and artist Cynthia Reedy.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/products/hair-care" className="btn-dark">
                Shop hair care <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/jewelry" className="btn-outline">
                Discover glass art
              </Link>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-ink/15 border-y border-ink/15">
              {[
                ['07', 'Trusted brands'],
                ['1/1', 'Every pendant'],
                ['MI·CA', 'Salon studios'],
              ].map(([k, v]) => (
                <div key={v} className="px-4 py-5 first:pl-0">
                  <dt className="font-display text-[1.9rem] font-semibold leading-none">{k}</dt>
                  <dd className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-espresso-500">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>

        {/* Editorial scene */}
        <div className="relative min-h-[560px] sm:min-h-[680px] lg:min-h-0">
          <motion.div
            initial={{ clipPath: 'inset(0 0 0 100%)' }}
            animate={{ clipPath: 'inset(0 0 0 0%)' }}
            transition={{ duration: 1.6, ease, delay: 0.05 }}
            className="absolute inset-0 overflow-hidden"
          >
            <motion.div style={reduce ? undefined : { scale: sceneScale }} className="absolute inset-0">
              <StudioScene tone="forest" priority plinthWidth="56%" className="h-full w-full" objectsClassName="gap-2 sm:gap-4">
                <ProductVisual {...bounce} label="MKS Eco" className="h-[170px] -rotate-2 sm:h-[230px] lg:h-[250px]" />
                <ProductVisual {...leaveIn} label="Loma" className="h-[220px] sm:h-[300px] lg:h-[330px]" />
                <ProductVisual {...bond} label="Olaplex" className="h-[150px] rotate-2 sm:h-[200px] lg:h-[215px]" />
              </StudioScene>
            </motion.div>
            {/* hanging pendant with glow */}
            <div className="absolute right-[12%] top-0 z-10 hidden w-24 flex-col items-center sm:flex lg:w-28">
              <div className="absolute -inset-10 top-24 rounded-full bg-[#7CC9D6]/30 blur-3xl" />
              <div className="h-24 w-px bg-gradient-to-b from-transparent to-champagne-light/80" />
              <div className="-mt-1 h-4 w-3 rounded-full border-[1.5px] border-champagne-light" />
              <div className="-mt-1 w-full animate-drift">
                <PendantVisual colors={['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6']} shape="teardrop" chain={false} className="w-full" />
              </div>
            </div>
          </motion.div>

          {/* Floating glass cards */}
          <Float mx={mx} my={my} depth={-22} delay={1.0} className="bottom-8 left-4 w-[230px] sm:bottom-14 sm:left-8 lg:-left-16 lg:w-[270px]">
            {spotlight && <SpotlightCard product={spotlight} />}
          </Float>

          <Float mx={mx} my={my} depth={26} delay={1.2} className="right-4 top-8 w-[200px] sm:right-8 sm:top-auto sm:bottom-[42%] lg:w-[220px]">
            <Link href="/jewelry" className="glass-dark group block p-4">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-champagne-light">One of one</p>
              <p className="mt-1.5 font-display text-lg font-semibold leading-tight">Dichroic glass, kiln-fused by hand.</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/80 transition-colors group-hover:text-white">
                The gallery <ArrowRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          </Float>

          <Float mx={mx} my={my} depth={40} delay={1.4} className="left-6 top-8 hidden sm:block lg:left-10">
            <div className="glass flex items-center gap-3 rounded-full py-2 pl-2 pr-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink">
                <Star className="h-4 w-4 fill-champagne-light text-champagne-light" />
              </span>
              <span className="text-[12px] font-semibold leading-tight">
                Licensed cosmetologist
                <span className="block text-[10.5px] font-medium text-espresso-500">Consultations in MI &amp; CA</span>
              </span>
            </div>
          </Float>
        </div>
      </div>
    </section>
  );
}
