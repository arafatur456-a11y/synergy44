import type { PendantShape } from '@/lib/data';
import { cn } from '@/lib/utils';

const RADIUS: Record<PendantShape, string> = {
  oval: '50%',
  teardrop: '0 50% 50% 50%',
  square: '22%',
  cabochon: '50% 50% 46% 46% / 58% 58% 42% 42%',
};

/**
 * CSS-rendered dichroic glass pendant: conic colour field + striations + animated sheen.
 * The sheen follows the pointer via --mx / --my CSS variables set by the parent card.
 */
export default function PendantVisual({
  colors,
  shape,
  className,
  chain = true,
}: {
  colors: readonly string[];
  shape: PendantShape;
  className?: string;
  chain?: boolean;
}) {
  const [a, b, c, d] = colors;
  const isTear = shape === 'teardrop';

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {chain && <div className="h-12 w-px bg-gradient-to-b from-transparent via-stone-300/60 to-stone-200" />}
      <div className="relative z-10 -mb-1.5 h-4 w-3 rounded-full border-2 border-stone-200/90 shadow-[0_0_6px_rgba(255,255,255,.4)]" />
      <div
        className={cn('relative aspect-square', isTear ? 'mt-3 w-[68%]' : shape === 'square' ? 'w-[78%] rotate-45 mt-4' : 'w-[86%]')}
        style={{
          borderRadius: RADIUS[shape],
          transform: isTear ? 'rotate(45deg)' : undefined,
          background: `
            radial-gradient(circle at 32% 26%, rgba(255,255,255,.6), transparent 20%),
            repeating-linear-gradient(118deg, transparent 0 7px, ${b}66 7px 10px, transparent 10px 17px, ${d}44 17px 19px),
            radial-gradient(circle at 70% 75%, ${c}cc, transparent 55%),
            conic-gradient(from 200deg at 50% 50%, ${a}, ${b}, ${c}, ${d}, ${a})`,
          boxShadow: `0 0 50px -6px ${a}aa, 0 0 90px -20px ${c}aa, inset 0 0 0 1px rgba(255,255,255,.28), inset 0 -10px 30px rgba(0,0,0,.45)`,
        }}
      >
        <div className="dichroic-sheen" />
      </div>
    </div>
  );
}
