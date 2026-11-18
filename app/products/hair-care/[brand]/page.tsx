import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import StudioScene, { type SceneTone } from '@/components/ui/StudioScene';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductVisual from '@/components/shop/ProductVisual';
import { brands, getBrand } from '@/lib/data';
import { productsByBrand } from '@/lib/data';
import { getProductsByBrand } from '@/lib/catalog';
import { cn } from '@/lib/utils';

type Params = { params: Promise<{ brand: string }> };

export const dynamicParams = false;

const sceneTone: Record<string, SceneTone> = {
  loma: 'stone',
  'mks-eco': 'forest',
  olaplex: 'espresso',
  neuma: 'velvet',
  gama: 'espresso',
  sutra: 'stone',
  goomee: 'forest',
};

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
  const items = await getProductsByBrand(slug);
  // Header scene always uses the illustrated packshots for a consistent art direction
  const hero = productsByBrand(slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={brand.tagline}
        crumbs={[{ label: 'Hair Care', href: '/products/hair-care' }, { label: brand.name }]}
        title={brand.name}
        intro={brand.description}
        scene={
          <StudioScene tone={sceneTone[slug] ?? 'stone'} plinthWidth="62%" className="h-full w-full" objectsClassName="gap-3">
            {hero.map((p, i) => (
              <ProductVisual
                key={p.id}
                {...p}
                label={brand.name}
                className={cn(
                  p.shape === 'dryer' ? 'h-[170px] sm:h-[220px]' : i === 1 ? 'h-[220px] sm:h-[290px]' : 'h-[180px] sm:h-[240px]',
                  i === 0 && hero.length > 1 && '-rotate-2',
                  i === 2 && 'rotate-2',
                )}
              />
            ))}
          </StudioScene>
        }
      >
        <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-espresso-500">
          {items.length} {items.length === 1 ? 'product' : 'products'} in this collection
        </p>
      </PageHeader>

      <section className="container-x py-14 sm:py-20">
        <ProductGrid products={items} lockedBrand={slug} />
      </section>

      <section className="container-x border-t border-ink/10 py-14">
        <p className="eyebrow">Explore other brands</p>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {brands.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/products/hair-care/${b.slug}`}
                aria-current={b.slug === slug ? 'page' : undefined}
                className={cn('font-display text-[1.8rem] font-semibold transition-colors', b.slug === slug ? 'text-ink' : 'text-espresso-400 hover:text-ink')}
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
