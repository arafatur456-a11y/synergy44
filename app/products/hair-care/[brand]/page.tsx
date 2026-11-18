import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import ProductGrid from '@/components/shop/ProductGrid';
import { brands, getBrand } from '@/lib/data/brands';
import { productsByBrand } from '@/lib/data/products';
import { cn } from '@/lib/utils';

type Params = { params: Promise<{ brand: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const brand = getBrand((await params).brand);
  if (!brand) return {};
  return { title: `${brand.name} — Hair Care`, description: brand.description };
}

export default async function BrandPage({ params }: Params) {
  const { brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();
  const count = productsByBrand(slug).length;

  return (
    <>
      <PageHeader
        eyebrow={brand.tagline}
        tint={brand.tint}
        crumbs={[{ label: 'Hair Care', href: '/products/hair-care' }, { label: brand.name }]}
        title={<em className="not-italic">{brand.name}</em>}
        intro={brand.description}
      >
        <p className="mt-6 text-sm text-espresso-500">
          {count} {count === 1 ? 'product' : 'products'} in this collection
        </p>
      </PageHeader>

      <section className="container-x py-14">
        <ProductGrid lockedBrand={slug} />
      </section>

      <section className="container-x pb-10">
        <p className="eyebrow">Explore other brands</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {brands.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/products/hair-care/${b.slug}`}
                aria-current={b.slug === slug ? 'page' : undefined}
                className={cn('chip inline-block', b.slug === slug ? 'chip-on' : 'chip-off')}
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
