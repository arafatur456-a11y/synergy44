import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import ProductCard from '@/components/shop/ProductCard';
import { featuredProducts } from '@/lib/data/products';

export default function FeaturedProducts() {
  return (
    <section className="container-x py-20">
      <SectionHeading
        eyebrow="Stylist favorites"
        title={
          <>
            The ritual <em className="text-iridescent">essentials</em>
          </>
        }
        intro="The products Cynthia reaches for most — for repair, moisture and effortless styling."
        action={
          <Link href="/products/hair-care" className="link-underline">
            Shop all hair care →
          </Link>
        }
      />
      <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {featuredProducts.slice(0, 4).map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 0.08}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
