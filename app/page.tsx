import Hero from '@/components/home/Hero';
import BrandMarquee from '@/components/home/BrandMarquee';
import FeaturedEdit from '@/components/home/FeaturedEdit';
import GlassStudio from '@/components/home/GlassStudio';
import ServicesTeaser from '@/components/home/ServicesTeaser';
import Testimonials from '@/components/Testimonials';
import GuaranteeGrid from '@/components/GuaranteeGrid';
import SectionHeader from '@/components/ui/SectionHeader';
import { getPendants, getSpotlightProduct } from '@/lib/catalog';

export default async function HomePage() {
  // Live WooCommerce data (or the demo catalog when the store isn't configured)
  const [pendants, spotlight] = await Promise.all([getPendants(), getSpotlightProduct()]);
  return (
    <>
      <Hero spotlight={spotlight} />
      <BrandMarquee />
      <FeaturedEdit />
      <GlassStudio pendants={pendants.slice(0, 4)} />
      <ServicesTeaser />
      <Testimonials />
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeader
            title="If something isn’t right, we’ll make it right"
            intro="That’s the Synergy 44 guarantee, on every product, appointment and pendant."
            className="mb-12"
          />
          <GuaranteeGrid />
        </div>
      </section>
    </>
  );
}
