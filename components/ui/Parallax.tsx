import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Subtle scroll-linked depth. `speed` is the travel in px across the element's pass through
 * the viewport.
 *
 * Performance: implemented with a CSS scroll-driven animation (`animation-timeline: view()`),
 * which runs off the main thread — zero JavaScript per scroll frame. Browsers without
 * scroll-timeline support simply render the element static. Disabled for reduced motion.
 */
export default function Parallax({ children, speed = 60, className }: { children: ReactNode; speed?: number; className?: string }) {
  return (
    <div className={cn('parallax', className)} style={{ '--parallax': `${speed}px` } as CSSProperties}>
      {children}
    </div>
  );
}
