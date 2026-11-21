import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductPurchase from '@/components/product/ProductPurchase';
import ProductCard from '@/components/shop/ProductCard';
import PendantCard from '@/components/jewelry/PendantCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { CARD_GRID } from '@/components/shop/CardParts';
import { getProductDetail, getRelatedProducts } from '@/lib/catalog';
import { getBrand } from '@/lib/data';
import { site } from '@/lib/site';
import type { Pendant, Product } from '@/lib/types';
import { cn } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

// Rendered on first request, then cached and refreshed with the catalog (ISR + webhook tag).
export const revalidate = 300;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const detail = await getProductDetail(decodeURIComponent((await params).slug));
  if (!detail) return { title: 'Product not found' };
  const description = detail.item.description;
  const image = detail.images[0]?.src;
  return {
    title: `${detail.item.name} — ${detail.label}`,
    description,
    alternates: { canonical: `/product/${detail.slug}` },
    openGraph: { title: detail.item.name, description, type: 'website', images: image ? [{ url: image }] : undefined },
  };
}

export default async function ProductPage({ params }: Params) {
  const slug = decodeURIComponent((await params).slug);
  const detail = await getProductDetail(slug);
  if (!detail) notFound();

  const related = await getRelatedProducts(detail, 4);
  const { item, kind } = detail;
  const isPendant = kind === 'pendant';
  const brandName = isPendant ? 'Synergy 44' : getBrand((item as Product).brand)?.name ?? detail.label;
  const crumbs = isPendant
    ? [{ label: 'Glass Jewelry', href: '/jewelry' }]
    : [{ label: 'Hair Care', href: '/products/hair-care' }, ...(detail.labelHref !== '/products/hair-care' ? [{ label: detail.label, href: detail.labelHref }] : [])];

  const facts = [
    detail.sku && ['SKU', detail.sku],
    !isPendant && ['Ritual', (item as Product).category],
    isPendant && ['Collection', (item as Pendant).collection],
    ...detail.attributes.filter((a) => !a.variation && !['brand', 'collection', 'shape', 'ritual'].includes(a.name.toLowerCase())).map((a) => [a.name, a.options.join(', ')]),
  ].filter(Boolean) as [string, string][];

  // Structured data for search engines (Product + Offer)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    sku: detail.sku,
    image: detail.images.map((i) => i.src),
    description: item.description,
    brand: { '@type': 'Brand', name: isPendant ? site.name : brandName },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: item.price.toFixed(2),
      availability: item.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `${site.url}/product/${detail.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <section className="container-x pb-20 pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso-500 sm:mb-12">
          <ol className="flex flex-wrap items-center gap-2.5">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-2.5">
                <span aria-hidden className="h-px w-4 bg-espresso-400" />
                <Link href={c.href} className="transition-colors hover:text-ink">
                  {c.label}
                </Link>
              </li>
            ))}
            <li className="hidden min-w-0 items-center gap-2.5 sm:flex">
              <span aria-hidden className="h-px w-4 bg-espresso-400" />
              <span aria-current="page" className="truncate text-ink">
                {item.name}
              </span>
            </li>
          </ol>
        </nav>

        <ProductPurchase detail={detail} brandName={brandName}>
          <Link href={detail.labelHref} className="eyebrow transition-colors hover:text-champagne">
            {detail.label}
          </Link>
          <h1 className="mt-5 font-display text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.02em] text-balance sm:text-[3.1rem]">{item.name}</h1>
          {detail.sku && <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso-400">SKU {detail.sku}</p>}
        </ProductPurchase>
      </section>

      {(detail.descriptionHtml || facts.length > 0) && (
        <section className="border-y border-ink/10 bg-paper py-20 sm:py-24">
          <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-4">
              <p className="eyebrow">{isPendant ? 'About this piece' : 'The details'}</p>
              {facts.length > 0 && (
                <dl className="mt-8 border-t border-ink">
                  {facts.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 border-b border-line py-3.5 text-[14px]">
                      <dt className="text-espresso-500">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            {detail.descriptionHtml && (
              <div className={cn('prose-s44 text-[16px] lg:col-span-7 lg:col-start-6')} dangerouslySetInnerHTML={{ __html: detail.descriptionHtml }} />
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className={cn('py-20 sm:py-28', isPendant && 'bg-[#0D0C10] text-white')}>
          <div className="container-x">
            <SectionHeader
              dark={isPendant}
              label={isPendant ? 'More from the studio' : `More from ${detail.label}`}
              title={isPendant ? <>You may also <em className="font-medium italic text-champagne-light">love.</em></> : <>Complete the <em className="accent">ritual.</em></>}
              action={
                <Link href={detail.labelHref} className={cn('link-underline self-start', isPendant && '!text-white')}>
                  View all
                </Link>
              }
            />
            <ul className={cn('mt-14', CARD_GRID, 'lg:grid-cols-4')}>
              {related.map((r) => (
                <li key={r.id}>{isPendant ? <PendantCard pendant={r as Pendant} /> : <ProductCard product={r as Product} />}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
