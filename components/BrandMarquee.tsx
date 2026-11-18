import { brands } from '@/lib/data';

export default function BrandMarquee() {
  const row = [...brands, ...brands];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-ink-900/60 py-7 mask-fade-x" aria-label="Featured brands">
      <div className="flex w-max animate-marquee gap-14 whitespace-nowrap hover:[animation-play-state:paused]">
        {row.map((b, i) => (
          <span key={i} className="flex items-center gap-14 font-display text-2xl font-light italic text-stone-500 sm:text-3xl">
            {b}
            <span aria-hidden className="text-base not-italic text-jade/70">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
