import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';
import ProductCard from '@/components/shop/ProductCard';
import { getFeaturedProducts } from '@/lib/catalog';
import { CARD_GRID } from '@/components/shop/CardParts';

export default async function FeaturedEdit() {
  const featured = await getFeaturedProducts(4);
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeader
        title="What Cynthia recommends most"
        intro="Repair for stressed and colored hair, moisture for dry ends, and light styling that doesn’t weigh hair down."
        action={
          <Link href="/products/hair-care" className="link-underline">
            Shop all hair care
          </Link>
        }
      />
      <ul className={`stagger mt-14 ${CARD_GRID} lg:grid-cols-4`}>
        {featured.map((p) => (
          <Reveal as="li" key={p.id}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
