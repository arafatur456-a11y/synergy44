import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BrandMarquee from '@/components/BrandMarquee';
import ProductShowcase from '@/components/ProductShowcase';
import GlassGallery from '@/components/GlassGallery';
import Story from '@/components/Story';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BrandMarquee />
        <ProductShowcase />
        <GlassGallery />
        <Story />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
