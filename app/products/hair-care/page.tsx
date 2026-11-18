import type { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import StudioScene from '@/components/ui/StudioScene';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductVisual from '@/components/shop/ProductVisual';
import { products } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Hair Care',
  description: 'Organic, vegan and bond-repair hair care from Loma, MKS Eco, Olaplex and Neuma, professional tools from Gama and Sutra, and Goomee.',
};

const pick = (id: string) => products.find((p) => p.id === id)!;

export default async function HairCarePage({ searchParams }: { searchParams: Promise<{ category?: string; brand?: string }> }) {
  const { category, brand } = await searchParams;
  const [a, b, c] = [pick('neuma-moisture-conditioner'), pick('loma-leave-in'), pick('mks-bounce')];

  return (
    <>
      <PageHeader
        eyebrow="The apothecary"
        crumbs={[{ label: 'Hair Care' }]}
        title={
          <>
            Hair care, <em className="accent">considered.</em>
          </>
        }
        intro="Every formula here earned its place behind our chair first — clean, effective and kind, with professional tools to match."
        scene={
          <StudioScene tone="stone" plinthWidth="62%" className="h-full w-full" objectsClassName="gap-3">
            <ProductVisual {...a} label="Neuma" className="h-[190px] -rotate-2 sm:h-[250px]" />
            <ProductVisual {...b} label="Loma" className="h-[230px] sm:h-[300px]" />
            <ProductVisual {...c} label="MKS Eco" className="h-[190px] rotate-2 sm:h-[250px]" />
          </StudioScene>
        }
      />
      <section className="container-x py-14 sm:py-20">
        <ProductGrid initialCategory={category} initialBrand={brand} />
      </section>
    </>
  );
}
