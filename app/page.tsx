import Hero from '@/components/home/Hero';
import BrandStrip from '@/components/home/BrandStrip';
import CraftsSplit from '@/components/home/CraftsSplit';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import JewelryTeaser from '@/components/home/JewelryTeaser';
import ServicesTeaser from '@/components/home/ServicesTeaser';
import Testimonials from '@/components/Testimonials';
import GuaranteeGrid from '@/components/GuaranteeGrid';
import SectionHeading from '@/components/ui/SectionHeading';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <CraftsSplit />
      <FeaturedProducts />
      <JewelryTeaser />
      <ServicesTeaser />
      <Testimonials />
      <section className="container-x pb-8">
        <SectionHeading
          eyebrow="Our promise"
          title={
            <>
              The Synergy 44 <em className="text-iridescent">Guarantee</em>
            </>
          }
          className="mb-12"
        />
        <GuaranteeGrid />
      </section>
    </>
  );
}
