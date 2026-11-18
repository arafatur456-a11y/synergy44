import Link from 'next/link';
import { brands } from '@/lib/data';

/** Dark editorial band of brand names — a strong separator between hero and content. */
export default function BrandMarquee() {
  const row = [...brands, ...brands];
  return (
    <section aria-label="Our brands" className="relative overflow-hidden bg-ink py-7 text-white">
      <div className="mask-fade-x">
        <ul className="flex w-max animate-marquee items-center gap-12 hover:[animation-play-state:paused]">
          {row.map((b, i) => (
            <li key={i} className="flex items-center gap-12" aria-hidden={i >= brands.length}>
              <Link
                href={`/products/hair-care/${b.slug}`}
                tabIndex={i >= brands.length ? -1 : undefined}
                className="font-display text-[1.9rem] font-medium italic text-white/85 transition-colors duration-500 hover:text-champagne-light sm:text-[2.4rem]"
              >
                {b.name}
              </Link>
              <span className="text-sm text-champagne">✦</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
