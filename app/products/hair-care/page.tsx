import type { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import StudioScene from '@/components/ui/StudioScene';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductVisual from '@/components/shop/ProductVisual';
import CollectionHero, { pickHeroItems } from '@/components/shop/CollectionHero';
import { getBrand } from '@/lib/data';
import { products as editorial } from '@/lib/data';
import { getProducts } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Hair Care',
  description: 'Organic, vegan and bond-repair hair care from Loma, MKS Eco, Olaplex and Neuma, professional tools from Gama and Sutra, and Goomee.',
};

// Fallback scene (illustrated) is only used when no product has a photo, e.g. in demo mode.
const pick = (id: string) => editorial.find((p) => p.id === id)!;

export default async function HairCarePage({ searchParams }: { searchParams: Promise<{ category?: string; brand?: string }> }) {
  const [{ category, brand }, products] = await Promise.all([searchParams, getProducts()]);
  const [a, b, c] = [pick('neuma-moisture-conditioner'), pick('loma-leave-in'), pick('mks-bounce')];
  // Hero: one photo per brand where possible, so the mosaic shows the range
  const byBrand = Array.from(new Map(pickHeroItems(products, 40).map((p) => [p.brand, p])).values());
  const photos = pickHeroItems([...byBrand, ...products]).map((p) => ({ ...p, label: getBrand(p.brand)?.name }));

  return (
    <>
      <PageHeader
        eyebrow="The apothecary"
        crumbs={[{ label: 'Hair care' }]}
        title={
          <>
            Hair care Cynthia uses in the salon
          </>
        }
        intro="Organic and vegan-forward formulas, bond repair, and the professional dryers and irons she styles with."
        scene={
          <CollectionHero
            items={photos}
            fallback={
              <StudioScene tone="stone" plinthWidth="62%" className="h-full w-full" objectsClassName="gap-3">
                <ProductVisual {...a} label="Neuma" className="h-[190px] -rotate-2 sm:h-[250px]" />
                <ProductVisual {...b} label="Loma" className="h-[230px] sm:h-[300px]" />
                <ProductVisual {...c} label="MKS Eco" className="h-[190px] rotate-2 sm:h-[250px]" />
              </StudioScene>
            }
          />
        }
      />
      <section className="container-x py-14 sm:py-20">
        <ProductGrid products={products} initialCategory={category} initialBrand={brand} />
      </section>
    </>
  );
}
