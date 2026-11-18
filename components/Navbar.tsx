'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/utils';

const links = [
  { href: '#hair-care', label: 'Hair Care' },
  { href: '#glass-art', label: 'Glass Art' },
  { href: '#story', label: 'Our Story' },
  { href: '#reviews', label: 'Reviews' },
];

export default function Navbar() {
  const { count } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 30);
    setHidden(y > prev && y > 400 && !open);
  });

  return (
    <motion.header
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 sm:px-7',
          scrolled ? 'glass' : 'border border-transparent',
        )}
      >
        <a href="#top" className="flex items-center gap-2" aria-label="Synergy 44 home">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-jade to-lilac font-display text-sm font-semibold text-ink">
            44
          </span>
          <span className="font-display text-xl tracking-tight text-stone-50">
            Synergy<span className="text-jade">44</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative rounded-full px-4 py-2 text-sm text-stone-400 transition-colors hover:text-stone-50">
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-jade transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden rounded-full border border-jade/40 px-5 py-2 text-sm font-medium text-jade transition hover:bg-jade hover:text-ink sm:inline-flex">
            Book a visit
          </a>
          <button aria-label={`Shopping bag, ${count} items`} className="relative grid h-10 w-10 place-items-center rounded-full text-stone-200 transition hover:bg-white/5">
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-jade px-1 text-[10px] font-bold text-ink shadow-glow"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-stone-200 transition hover:bg-white/5 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="glass mx-auto mt-3 max-w-7xl rounded-3xl bg-ink-900/90 p-4 md:hidden"
          >
            <ul className="flex flex-col">
              {[...links, { href: '#contact', label: 'Book a visit' }].map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3.5 font-display text-2xl text-stone-100 hover:bg-white/5">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
