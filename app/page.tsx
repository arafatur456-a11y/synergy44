import Hero from '@/components/home/Hero';
import BrandMarquee from '@/components/home/BrandMarquee';
import FeaturedEdit from '@/components/home/FeaturedEdit';
import CraftsSplit from '@/components/home/CraftsSplit';
import GlassStudio from '@/components/home/GlassStudio';
import ServicesTeaser from '@/components/home/ServicesTeaser';
import Testimonials from '@/components/Testimonials';
import GuaranteeGrid from '@/components/GuaranteeGrid';
import SectionHeader from '@/components/ui/SectionHeader';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <FeaturedEdit />
      <CraftsSplit />
      <GlassStudio />
      <ServicesTeaser />
      <Testimonials />
      <section className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <SectionHeader
            index="06"
            label="Our promise"
            title={
              <>
                The Synergy 44 <em className="accent">Guarantee.</em>
              </>
            }
            intro="Clean products, honest advice and handmade quality — backed by a simple promise: if something isn’t right, we’ll make it right."
            className="mb-14"
          />
          <GuaranteeGrid />
        </div>
      </section>
    </>
  );
}
