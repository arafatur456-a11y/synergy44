'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { scrollToTop, setLenis } from '@/lib/lenis';

/** Calm inertial scrolling. Disabled entirely for users who prefer reduced motion. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, autoRaf: true, anchors: { offset: -96 } });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  // Reset scroll on route change (Lenis keeps its own position otherwise)
  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
}
