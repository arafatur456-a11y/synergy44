'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, ShoppingBag, X } from 'lucide-react';
import { brands } from '@/lib/data/brands';
import { categories, products } from '@/lib/data/products';
import { useCart } from '@/lib/cart';
import { lockScroll } from '@/lib/lenis';
import { cn, ease } from '@/lib/utils';
import ProductVisual from '@/components/shop/ProductVisual';
import PendantVisual from '@/components/jewelry/PendantVisual';
import StudioScene from '@/components/ui/StudioScene';

const leftLinks = [
  { label: 'Hair Care', href: '/products/hair-care', mega: true },
  { label: 'Glass Jewelry', href: '/jewelry' },
  { label: 'Hair Styling', href: '/hair-styling' },
];
const rightLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
const allLinks = [...leftLinks, ...rightLinks];

const olaplex = products.find((p) => p.id === 'olaplex-3')!;

function Wordmark({ light }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Synergy 44 — home" className="group flex flex-col items-center leading-none">
      <span className={cn('font-display text-[1.6rem] font-semibold tracking-[0.12em] sm:text-[1.85rem]', light ? 'text-white' : 'text-ink')}>
        SYNERGY<span className="ml-2 italic tracking-normal text-champagne">44</span>
      </span>
      <span className={cn('mt-1.5 hidden text-[9px] font-semibold uppercase tracking-[0.42em] sm:block', light ? 'text-white/60' : 'text-espresso-500')}>
        Salon · Apothecary · Glass
      </span>
    </Link>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative py-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] transition-colors',
        active ? 'text-ink' : 'text-espresso-700 hover:text-ink',
      )}
    >
      {label}
      <span
        className={cn(
          'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ease-silk',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        )}
      />
    </Link>
  );
}

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.4, ease }}
      className="absolute inset-x-0 top-full border-b border-ink/10 bg-paper shadow-[0_40px_60px_-40px_rgba(17,17,17,.35)]"
    >
      <div className="container-x grid grid-cols-12 gap-10 py-12">
        <div className="col-span-4">
          <p className="eyebrow-plain text-espresso-500">Shop by brand</p>
          <ul className="mt-6 space-y-1">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link href={`/products/hair-care/${b.slug}`} onClick={onNavigate} className="group flex items-baseline justify-between border-b border-line py-2.5">
                  <span className="font-display text-[1.35rem] font-medium transition-transform duration-500 ease-silk group-hover:translate-x-1.5">{b.name}</span>
                  <span className="text-[11px] text-espresso-500 transition-colors group-hover:text-ink">{b.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <p className="eyebrow-plain text-espresso-500">Shop by ritual</p>
          <ul className="mt-6 space-y-3">
            {categories.map((c) => (
              <li key={c}>
                <Link href={`/products/hair-care?category=${c}`} onClick={onNavigate} className="text-[15px] font-medium text-espresso-700 transition-colors hover:text-ink">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/products/hair-care" onClick={onNavigate} className="link-underline mt-8">
            Shop all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <Link href="/products/hair-care/olaplex" onClick={onNavigate} className="group col-span-3 block">
          <div className="overflow-hidden rounded-[4px]">
            <StudioScene tone="forest" plinthWidth="58%" className="aspect-[4/5] transition-transform duration-[1.2s] ease-silk group-hover:scale-[1.04]">
              <ProductVisual {...olaplex} label="Olaplex" className="h-[150px] drop-shadow-2xl" />
            </StudioScene>
          </div>
          <p className="mt-4 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-champagne">The edit</p>
          <p className="mt-1 font-display text-xl font-semibold">Bond repair essentials</p>
        </Link>
        <Link href="/jewelry" onClick={onNavigate} className="group col-span-3 block">
          <div className="overflow-hidden rounded-[4px]">
            <StudioScene tone="velvet" plinth={false} className="aspect-[4/5] transition-transform duration-[1.2s] ease-silk group-hover:scale-[1.04]" objectsClassName="bottom-[22%]">
              <PendantVisual colors={['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6']} shape="oval" className="w-28" />
            </StudioScene>
          </div>
          <p className="mt-4 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-champagne">The studio</p>
          <p className="mt-1 font-display text-xl font-semibold">Handmade dichroic glass</p>
        </Link>
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

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

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
    closeTimer.current = setTimeout(() => setMega(false), 150);
  };
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <div className="bg-ink text-white">
        <div className="container-x flex h-9 items-center justify-center text-[10px] font-medium uppercase tracking-[0.22em] sm:justify-between">
          <span className="hidden text-white/60 sm:inline">Michigan · California</span>
          <span>
            Organic &amp; vegan hair care <span className="mx-2 text-champagne-light">✦</span> Handmade glass
          </span>
          <Link href="/contact?topic=consultation" className="hidden items-center gap-1.5 text-white/80 transition hover:text-white sm:inline-flex">
            Book a consultation <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 ease-silk',
          scrolled || mega ? 'border-ink/10 bg-cream/[0.9] shadow-[0_10px_30px_-20px_rgba(17,17,17,.35)] backdrop-blur-md' : 'border-transparent bg-cream',
        )}
        onMouseLeave={closeMega}
      >
        <nav className="container-x grid h-[84px] grid-cols-[1fr_auto_1fr] items-center" aria-label="Primary">
          {/* Left */}
          <div className="flex items-center">
            <button onClick={() => setMobile(true)} aria-label="Open menu" className="-ml-2 grid h-11 w-11 place-items-center lg:hidden">
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <ul className="hidden items-center gap-8 lg:flex">
              {leftLinks.map((l) =>
                l.mega ? (
                  <li key={l.href} onMouseEnter={openMega}>
                    <button
                      onClick={() => setMega((m) => !m)}
                      aria-expanded={mega}
                      aria-haspopup="true"
                      className={cn(
                        'group relative flex items-center gap-1.5 py-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] transition-colors',
                        isActive(l.href) || mega ? 'text-ink' : 'text-espresso-700 hover:text-ink',
                      )}
                    >
                      {l.label}
                      <ChevronDown className={cn('h-3 w-3 transition-transform duration-300', mega && 'rotate-180')} strokeWidth={2.2} />
                      <span className={cn('absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ease-silk', isActive(l.href) || mega ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')} />
                    </button>
                  </li>
                ) : (
                  <li key={l.href} onMouseEnter={closeMega}>
                    <NavLink {...l} active={isActive(l.href)} />
                  </li>
                ),
              )}
            </ul>
          </div>

          <Wordmark />

          {/* Right */}
          <div className="flex items-center justify-end gap-8">
            <ul className="hidden items-center gap-8 lg:flex" onMouseEnter={closeMega}>
              {rightLinks.map((l) => (
                <li key={l.href}>
                  <NavLink {...l} active={isActive(l.href)} />
                </li>
              ))}
            </ul>
            <button
              onClick={() => openCart(true)}
              aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
              className="group relative -mr-2 flex h-11 items-center gap-2 px-2 text-[11.5px] font-semibold uppercase tracking-[0.16em]"
            >
              <ShoppingBag className="h-[18px] w-[18px] transition-transform duration-500 ease-silk group-hover:-translate-y-0.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Bag</span>
              <span className={cn('grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] tabular-nums transition-colors', count > 0 ? 'bg-ink text-white' : 'bg-ink/10 text-ink')}>
                {count}
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>{mega && <MegaMenu onNavigate={() => setMega(false)} />}</AnimatePresence>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-white lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
            data-lenis-prevent
          >
            <div className="container-x flex h-[84px] shrink-0 items-center justify-between">
              <Wordmark light />
              <button onClick={() => setMobile(false)} aria-label="Close menu" className="-mr-2 grid h-11 w-11 place-items-center">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="container-x flex-1 overflow-y-auto pb-10">
              <ul className="border-t border-white/15">
                {allLinks.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease }}
                    className="border-b border-white/15"
                  >
                    {'mega' in l && l.mega ? (
                      <>
                        <button onClick={() => setMobileBrands((o) => !o)} aria-expanded={mobileBrands} className="flex w-full items-center justify-between py-5 font-display text-[2rem] font-medium">
                          {l.label}
                          <ChevronDown className={cn('h-5 w-5 transition-transform', mobileBrands && 'rotate-180')} strokeWidth={1.5} />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileBrands && (
                            <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="grid grid-cols-2 overflow-hidden pb-5">
                              <li className="col-span-2">
                                <Link href="/products/hair-care" className="block py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-champagne-light">
                                  Shop all hair care →
                                </Link>
                              </li>
                              {brands.map((b) => (
                                <li key={b.slug}>
                                  <Link href={`/products/hair-care/${b.slug}`} className="block py-2 text-[15px] text-white/75">
                                    {b.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link href={l.href} className="block py-5 font-display text-[2rem] font-medium">
                        {l.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
              <Link href="/contact?topic=salon" className="btn-light mt-10 w-full">
                Book a visit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
