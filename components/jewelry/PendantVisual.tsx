import type { PendantShape } from '@/lib/data/jewelry';
import { cn } from '@/lib/utils';

const RADIUS: Record<PendantShape, string> = {
  oval: '50%',
  teardrop: '0 50% 50% 50%',
  square: '22%',
  cabochon: '50% 50% 46% 46% / 58% 58% 42% 42%',
};

/**
 * CSS-rendered dichroic glass pendant: layered colour field, fine striations and
 * a slow sheen. The highlight follows the pointer via --mx / --my on any ancestor.
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
  const isSquare = shape === 'square';

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {chain && <div className="h-12 w-px bg-gradient-to-b from-transparent via-champagne/60 to-champagne" />}
      <div className="relative z-10 -mb-1.5 h-4 w-3 rounded-full border-[1.5px] border-champagne bg-champagne-pale/40" />
      <div
        className={cn('relative aspect-square', isTear ? 'mt-3 w-[66%]' : isSquare ? 'mt-4 w-[74%]' : 'w-[86%]')}
        style={{
          borderRadius: RADIUS[shape],
          transform: isTear || isSquare ? 'rotate(45deg)' : undefined,
          background: `
            radial-gradient(circle at 30% 24%, rgba(255,255,255,.75), transparent 22%),
            repeating-linear-gradient(118deg, transparent 0 7px, ${b}55 7px 10px, transparent 10px 17px, ${d}40 17px 19px),
            radial-gradient(circle at 72% 76%, ${c}dd, transparent 58%),
            conic-gradient(from 200deg at 50% 50%, ${a}, ${b}, ${c}, ${d}, ${a})`,
          boxShadow: `0 24px 40px -18px ${a}99, 0 10px 18px -10px rgba(30,29,27,.25), inset 0 0 0 1px rgba(255,255,255,.55), inset 0 -8px 22px rgba(30,29,27,.18)`,
        }}
      >
        <div className="dichroic-sheen" />
      </div>
    </div>
  );
}
