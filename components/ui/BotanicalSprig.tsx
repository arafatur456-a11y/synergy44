'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Fine-line botanical illustration.
 *
 * `draw` (default true): the lines draw themselves in once when the sprig enters view, using a
 * CSS stroke-dashoffset animation triggered by an IntersectionObserver (no per-frame JS).
 * Pass `draw={false}` for purely decorative backdrops (e.g. inside StudioScene) so scrolling past
 * them costs nothing.
 */
export default function BotanicalSprig({ className, leaves = 7, draw = true }: { className?: string; leaves?: number; draw?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!draw || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [draw]);

  const leafPaths: string[] = [];
  for (let i = 0; i < leaves; i++) {
    const y = 360 - i * 46;
    const s = 1 - i * 0.07; // leaves shrink toward the tip
    const side = i % 2 === 0 ? -1 : 1;
    const x = 100 + side * 2;
    leafPaths.push(
      `M${x} ${y} C ${x + side * 34 * s} ${y - 6 * s}, ${x + side * 56 * s} ${y - 34 * s}, ${x + side * 60 * s} ${y - 62 * s} C ${x + side * 32 * s} ${y - 52 * s}, ${x + side * 10 * s} ${y - 30 * s}, ${x} ${y}`,
    );
    leafPaths.push(`M${x} ${y} C ${x + side * 22 * s} ${y - 18 * s}, ${x + side * 42 * s} ${y - 40 * s}, ${x + side * 56 * s} ${y - 58 * s}`);
  }

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      className={cn(draw && 'sprig-draw', className)}
      aria-hidden
    >
      <path pathLength={1} d="M100 398 C 96 300, 108 190, 98 40 C 96 28, 100 18, 104 10" />
      {leafPaths.map((d, i) => (
        <path key={i} pathLength={1} d={d} strokeWidth={i % 2 ? 0.7 : 1.1} style={draw ? { animationDelay: `${0.35 + i * 0.06}s` } : undefined} />
      ))}
    </svg>
  );
}
