'use client';

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Gentle fade-and-rise as content enters the viewport.
 *
 * Performance: one shared IntersectionObserver adds `.is-visible` once; the motion itself is a
 * CSS transition on `opacity` + `transform`, which the browser runs on the compositor thread —
 * no per-frame JavaScript while scrolling. Plays once, never re-triggers.
 * (Hidden state only applies when JS is running — see the `js` class set in app/layout.tsx.)
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            observer!.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    );
  }
  return observer;
}

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'p' | 'span';
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return createElement(
    as,
    {
      ref,
      className: cn('reveal', className),
      style: { '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` } as CSSProperties,
    },
    children,
  );
}
