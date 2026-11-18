'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ChevronDown, Menu, ShoppingBag, X } from 'lucide-react';
import { nav } from '@/lib/site';
import { brands } from '@/lib/data/brands';
import { categories, products } from '@/lib/data/products';
import { useCart } from '@/lib/cart';
import { lockScroll } from '@/lib/lenis';
import { cn, ease } from '@/lib/utils';
import ProductVisual from '@/components/shop/ProductVisual';

const spotlight = products.find((p) => p.id === 'olaplex-3')!;

function Wordmark() {
  return (
    <Link href="/" className="group flex items-baseline gap-1.5" aria-label="Synergy 44 — home">
      <span className="font-display text-[1.7rem] font-medium leading-none tracking-tight">Synergy</span>
      <span className="font-display text-[1.7rem] italic leading-none text-sage transition-colors group-hover:text-champagne">44</span>
    </Link>
  );
}

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease }}
      className="absolute inset-x-0 top-full pt-3"
    >
      <div className="container-x">
        <div className="grid grid-cols-12 gap-10 rounded-[28px] bg-cream p-10 shadow-lift ring-1 ring-espresso/[0.06]">
          <div className="col-span-5">
            <p className="eyebrow">Shop by brand</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-8 gap-y-1">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/products/hair-care/${b.slug}`} onClick={onNavigate} className="group block rounded-xl py-2.5">
                    <span className="font-display text-xl transition-colors group-hover:text-sage">{b.name}</span>
                    <span className="block text-xs text-espresso-400">{b.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-3 border-l border-espresso/[0.08] pl-10">
            <p className="eyebrow">Shop by ritual</p>
            <ul className="mt-5 space-y-1">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/products/hair-care?category=${c}`}
                    onClick={onNavigate}
                    className="block py-2 text-[15px] text-espresso-700 transition-colors hover:text-sage"
                  >
                    {c}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <Link href="/products/hair-care" onClick={onNavigate} className="link-underline">
                  View all hair care
                </Link>
              </li>
            </ul>
          </div>
          <Link
            href="/products/hair-care/olaplex"
            onClick={onNavigate}
            className="group col-span-4 flex items-center gap-5 overflow-hidden rounded-3xl bg-sage-mist p-6"
          >
            <ProductVisual {...spotlight} label="Olaplex" className="h-40 shrink-0 transition-transform duration-700 ease-silk group-hover:-translate-y-1 group-hover:rotate-[-3deg]" />
            <div>
              <p className="eyebrow">Stylist favorite</p>
              <p className="mt-2 font-display text-2xl leading-tight">{spotlight.name}</p>
              <p className="mt-2 text-sm text-espresso-500">Bond repair for stronger, healthier hair.</p>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { count, setOpen: openCart } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileBrands, setMobileBrands] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12));

  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    lockScroll(mobile);
    return () => lockScroll(false);
  }, [mobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false);
        setMobile(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMega(false), 140);
  };

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-sage-dark py-2 text-center text-[10px] tracking-[0.16em] sm:text-[11px] sm:tracking-[0.18em] text-cream/90">
        ORGANIC &amp; VEGAN HAIR CARE <span className="mx-2 text-champagne-light">✦</span> HANDMADE<span className="hidden sm:inline"> DICHROIC</span> GLASS
      </div>

      <div
        className={cn(
          'relative transition-all duration-500 ease-silk',
          scrolled || mega ? 'bg-cream/[0.97] shadow-[0_1px_0_rgba(30,29,27,.06)] backdrop-blur-xl' : 'bg-cream',
        )}
      >
        <nav className="container-x flex h-[76px] items-center justify-between" aria-label="Primary">
          <Wordmark />

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) =>
              item.mega ? (
                <li key={item.href} onMouseEnter={openMega} onMouseLeave={closeMega} className="static">
                  <button
                    onClick={() => setMega((m) => !m)}
                    aria-expanded={mega}
                    aria-haspopup="true"
                    className={cn(
                      'flex items-center gap-1 rounded-full px-4 py-2 text-[13.5px] font-medium tracking-wide transition-colors',
                      isActive(item.href) ? 'text-sage' : 'text-espresso-700 hover:text-espresso',
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', mega && 'rotate-180')} />
                  </button>
                  <AnimatePresence>{mega && <MegaMenu onNavigate={() => setMega(false)} />}</AnimatePresence>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-[13.5px] font-medium tracking-wide transition-colors',
                      isActive(item.href) ? 'text-sage' : 'text-espresso-700 hover:text-espresso',
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span layoutId="nav-dot" className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sage" />
                    )}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-1.5">
            <Link href="/contact?topic=salon" className="btn-dark hidden !px-5 !py-2.5 sm:inline-flex">
              Book a visit
            </Link>
            <button
              onClick={() => openCart(true)}
              aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
              className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-espresso/5"
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.6} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-sage px-1 text-[10px] font-bold text-cream"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => setMobile(true)}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-espresso/5 lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            className="fixed inset-0 z-[60] bg-cream lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            data-lenis-prevent
          >
            <div className="container-x flex h-[76px] items-center justify-between">
              <Wordmark />
              <button onClick={() => setMobile(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full hover:bg-espresso/5">
                <X className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>
            <div className="container-x h-[calc(100svh-76px)] overflow-y-auto pb-12">
              <ul className="divide-y divide-espresso/[0.08] border-y border-espresso/[0.08]">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease }}
                  >
                    {item.mega ? (
                      <>
                        <button
                          onClick={() => setMobileBrands((o) => !o)}
                          aria-expanded={mobileBrands}
                          className="flex w-full items-center justify-between py-5 font-display text-3xl"
                        >
                          {item.label}
                          <ChevronDown className={cn('h-5 w-5 transition-transform', mobileBrands && 'rotate-180')} strokeWidth={1.5} />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileBrands && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="grid grid-cols-2 gap-x-4 overflow-hidden pb-5"
                            >
                              <li className="col-span-2">
                                <Link href="/products/hair-care" className="block py-2 text-sm font-semibold text-sage">
                                  All hair care →
                                </Link>
                              </li>
                              {brands.map((b) => (
                                <li key={b.slug}>
                                  <Link href={`/products/hair-care/${b.slug}`} className="block py-2 text-[15px] text-espresso-700">
                                    {b.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link href={item.href} className="block py-5 font-display text-3xl">
                        {item.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
              <Link href="/contact?topic=salon" className="btn-dark mt-8 w-full">
                Book a visit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
