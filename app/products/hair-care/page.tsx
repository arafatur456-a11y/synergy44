import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import ProductGrid from '@/components/shop/ProductGrid';
import { brands } from '@/lib/data/brands';

export const metadata: Metadata = {
  title: 'Hair Care',
  description: 'Organic, vegan and bond-repair hair care from Loma, MKS Eco, Olaplex, Neuma, plus professional tools from Gama and Sutra, and Goomee.',
};

export default async function HairCarePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string }>;
}) {
  const { category, brand } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="The apothecary"
        crumbs={[{ label: 'Hair Care' }]}
        title={
          <>
            Hair care, <em className="text-iridescent">thoughtfully</em> chosen.
          </>
        }
        intro="Every product here earned its place behind our chair first — clean, effective formulas and professional tools for healthier hair at home."
      >
        <ul className="mt-10 flex flex-wrap gap-2">
          {brands.map((b) => (
            <li key={b.slug}>
              <Link href={`/products/hair-care/${b.slug}`} className="chip chip-off inline-block">
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </PageHeader>

      <section className="container-x py-14">
        <ProductGrid initialCategory={category} initialBrand={brand} />
      </section>
    </>
  );
}
