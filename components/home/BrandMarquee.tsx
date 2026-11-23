import Link from 'next/link';
import { brands } from '@/lib/data';

/**
 * The brands, set as one sentence of large type. Each name links to its collection —
 * a typographic index rather than a scrolling marquee.
 */
export default function BrandMarquee() {
  return (
    <section aria-labelledby="brands-heading" className="bg-ink text-paper">
      <div className="container-x grid gap-8 py-16 sm:py-20 lg:grid-cols-12">
        <h2 id="brands-heading" className="text-[15px] font-medium text-sage-light lg:col-span-3 lg:pt-3">
          The lines Cynthia uses behind the chair, and sells here
        </h2>
        <p className="font-display text-[clamp(2rem,4.4vw,3.9rem)] font-medium leading-[1.08] tracking-[-0.03em] lg:col-span-9">
          {brands.map((b, i) => (
            <span key={b.slug}>
              <Link
                href={`/products/hair-care/${b.slug}`}
                className="underline decoration-white/0 decoration-2 underline-offset-[0.14em] transition-colors hover:text-iris-light hover:decoration-iris-light"
              >
                {b.name}
              </Link>
              {i < brands.length - 2 ? ', ' : i === brands.length - 2 ? ' and ' : '.'}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
