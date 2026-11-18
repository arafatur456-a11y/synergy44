import Link from 'next/link';
import { brands } from '@/lib/data/brands';
import Reveal from '@/components/ui/Reveal';

export default function BrandStrip() {
  return (
    <section aria-labelledby="brands-heading" className="border-y border-espresso/[0.07] bg-cream-100/60">
      <div className="container-x py-14">
        <Reveal>
          <p id="brands-heading" className="eyebrow text-center">
            The brands we trust, behind the chair and at home
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 sm:gap-x-6">
            {brands.map((b, i) => (
              <li key={b.slug} className="flex items-center gap-3 sm:gap-6">
                <Link
                  href={`/products/hair-care/${b.slug}`}
                  className="font-display text-[1.7rem] italic text-espresso-500 transition-colors duration-500 hover:text-sage sm:text-[2.1rem]"
                >
                  {b.name}
                </Link>
                {i < brands.length - 1 && (
                  <span aria-hidden className="text-xs text-champagne">
                    ✦
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
