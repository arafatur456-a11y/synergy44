'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, ShoppingBag, X } from 'lucide-react';
import { brands } from '@/lib/data';
import { categories } from '@/lib/data';
import { useCart } from '@/lib/cart';
import { lockScroll } from '@/lib/scroll-lock';
import { cn, ease } from '@/lib/utils';

const leftLinks = [
  { label: 'Hair care', href: '/products/hair-care', mega: true },
  { label: 'Glass jewelry', href: '/jewelry' },
  { label: 'Salon', href: '/hair-styling' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
const allLinks = leftLinks;

/** Wordmark: the name set plainly, with "44" sitting in a small thin-film cabochon. */
function Wordmark({ light }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Synergy 44, home" className="group flex items-center gap-2 leading-none">
      <span className={cn('font-display text-[1.45rem] font-semibold tracking-[-0.03em]', light ? 'text-white' : 'text-ink')}>Synergy</span>
      <span className="film cabochon grid h-[30px] w-[26px] place-items-center p-[2px]" aria-hidden>
        <span className={cn('cabochon grid h-full w-full place-items-center text-[12px] font-semibold tracking-[-0.02em]', light ? 'bg-mineral text-white' : 'bg-mineral text-ink')}>44</span>
      </span>
    </Link>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative py-2 text-[15px] font-medium transition-colors',
        active ? 'text-ink' : 'text-stone-500 hover:text-ink',
      )}
    >
      {label}
      <span
        className={cn(
          'absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-iris transition-opacity duration-200',
          active ? 'opacity-100' : 'opacity-0',
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
      className="absolute inset-x-0 top-full border-b border-ink/10 bg-paper shadow-[0_40px_60px_-40px_rgba(30,45,39,.35)]"
    >
      <div className="container-x grid grid-cols-12 gap-10 py-12">
        <div className="col-span-4">
          <p className="label">Brands</p>
          <ul className="mt-6 space-y-1">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link href={`/products/hair-care/${b.slug}`} onClick={onNavigate} className="group flex items-baseline justify-between border-b border-line py-2.5">
                  <span className="text-[1.2rem] font-medium group-hover:text-iris">{b.name}</span>
                  <span className="text-[13px] text-stone-500">{b.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <p className="label">By step</p>
          <ul className="mt-6 space-y-3">
            {categories.map((c) => (
              <li key={c}>
                <Link href={`/products/hair-care?category=${c}`} onClick={onNavigate} className="text-[15px] font-medium text-stone-700 transition-colors hover:text-ink">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-5 col-start-8 self-end">
          <p className="body-serif">
            Every line here is one Cynthia uses behind the chair: organic and vegan formulas, bond repair, and professional tools.
          </p>
          <Link href="/products/hair-care" onClick={onNavigate} className="btn-dark mt-6">
            Shop all hair care
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { count, setOpen: openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileBrands, setMobileBrands] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // "Scrolled" state from an IntersectionObserver on a sentinel near the top of the page —
  // no scroll listener, so the navbar does zero work while the page scrolls.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute left-0 top-[24px] h-px w-px" />
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 ease-silk',
          scrolled || mega ? 'border-ink/10 bg-mineral/[0.92] backdrop-blur-md' : 'border-transparent bg-mineral',
        )}
        onMouseLeave={closeMega}
      >
        <nav className="container-x flex h-[76px] items-center gap-10" aria-label="Primary">
          <Wordmark />
          <div className="flex flex-1 items-center">
            <ul className="hidden items-center gap-7 lg:flex">
              {leftLinks.map((l) =>
                l.mega ? (
                  <li key={l.href} onMouseEnter={openMega}>
                    <button
                      onClick={() => setMega((m) => !m)}
                      aria-expanded={mega}
                      aria-haspopup="true"
                      className={cn(
                        'group relative flex items-center gap-1 py-2 text-[15px] font-medium transition-colors',
                        isActive(l.href) || mega ? 'text-ink' : 'text-stone-500 hover:text-ink',
                      )}
                    >
                      {l.label}
                      <ChevronDown className={cn('h-3 w-3 transition-transform duration-300', mega && 'rotate-180')} strokeWidth={2.2} />
                      <span className={cn('absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-iris transition-opacity duration-200', isActive(l.href) ? 'opacity-100' : 'opacity-0')} />
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

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => openCart(true)}
              aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
              className="-mr-2 flex h-11 items-center gap-2 rounded-full px-3 text-[15px] font-medium transition-colors hover:bg-ink/[0.05]"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
              <span className="hidden sm:inline">Bag</span>
              <span className={cn('grid h-5 min-w-5 place-items-center rounded-full px-1 text-[12px] tabular-nums', count > 0 ? 'bg-accent text-white' : 'bg-ink/10 text-ink')}>
                {count}
              </span>
            </button>
            <button onClick={() => setMobile(true)} aria-label="Open menu" className="-mr-2 grid h-11 w-11 place-items-center lg:hidden">
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
        </nav>

        <AnimatePresence>{mega && <MegaMenu onNavigate={() => setMega(false)} />}</AnimatePresence>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-mineral text-white lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="container-x flex h-[76px] shrink-0 items-center justify-between">
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
                        <button onClick={() => setMobileBrands((o) => !o)} aria-expanded={mobileBrands} className="flex w-full items-center justify-between py-4 font-display text-[1.9rem] font-medium tracking-[-0.02em]">
                          {l.label}
                          <ChevronDown className={cn('h-5 w-5 transition-transform', mobileBrands && 'rotate-180')} strokeWidth={1.5} />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileBrands && (
                            <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="grid grid-cols-2 overflow-hidden pb-5">
                              <li className="col-span-2">
                                <Link href="/products/hair-care" className="block py-2 text-[15px] font-medium text-iris-light">
                                  All hair care
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
                      <Link href={l.href} className="block py-4 font-display text-[1.9rem] font-medium tracking-[-0.02em]">
                        {l.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
              <Link href="/contact?topic=salon" className="btn-light mt-10 w-full">
                Book a visit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
