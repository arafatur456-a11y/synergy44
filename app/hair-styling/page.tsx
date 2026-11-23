import type { Metadata } from 'next';
import Link from 'next/link';
import BookPackageButton from '@/components/concierge/BookPackageButton';
import { CalendarHeart, MessageCircle, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import StudioScene from '@/components/ui/StudioScene';
import SectionHeader from '@/components/ui/SectionHeader';
import PricingMenu from '@/components/services/PricingMenu';
import Testimonials from '@/components/Testimonials';
import Reveal from '@/components/ui/Reveal';
import ProductVisual from '@/components/shop/ProductVisual';

export const metadata: Metadata = {
  title: 'Hair Styling & Salon Services',
  description: 'Women’s and men’s haircuts, hi-lights, glaze and root color with a licensed cosmetologist in Michigan & California.',
};

const steps = [
  { icon: MessageCircle, title: 'Consult', body: 'Every visit begins with a conversation about your hair’s history, health and goals.' },
  { icon: Sparkles, title: 'Create', body: 'Precision technique and gentle, clean products — chosen for your hair, not a trend.' },
  { icon: CalendarHeart, title: 'Care', body: 'Leave with a simple at-home ritual to keep your hair healthy between visits.' },
];

export default function HairStylingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Salon services · Michigan & California"
        crumbs={[{ label: 'Salon' }]}
        title={
          <>
            Cuts and color that put your hair’s health first
          </>
        }
        intro="Cuts, hi-lights, glazes and root color with Cynthia Reedy, a licensed cosmetologist, in Michigan and California."
        scene={
          <StudioScene tone="umber" plinthWidth="58%" className="h-full w-full" objectsClassName="gap-4">
            <ProductVisual shape="dryer" colors={['#3A3733', '#1E1D1B']} cap="#B8975E" label="Gama" className="h-[170px] sm:h-[220px]" />
            <ProductVisual shape="wand" colors={['#E8D3D8', '#B88E98']} cap="#D9C29A" label="Sutra" className="h-[200px] sm:h-[260px]" />
          </StudioScene>
        }
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact?topic=salon" className="btn-dark">
            Book an appointment
          </Link>
          <BookPackageButton />
          <a href="#menu" className="btn-outline">
            View the menu
          </a>
        </div>
      </PageHeader>

      <section className="container-x pb-20 pt-6">
        <h2 className="text-[15px] font-medium text-sage-dark">What happens at a visit</h2>
        <ol className="mt-6 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map(({ title, body }, i) => (
            <li key={title} className="border-t border-ink/20 pt-6">
              <p className="flex items-baseline gap-3">
                <span className="text-[15px] tabular-nums text-iris">{i + 1}.</span>
                <span className="text-[1.5rem] font-semibold tracking-[-0.02em]">{title}</span>
              </p>
              <p className="body-serif mt-2 max-w-[34ch]">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="menu" className="relative scroll-mt-28 overflow-hidden border-y border-ink/10 bg-mineral-100 py-24 sm:py-32">
        <div className="container-x relative">
          <SectionHeader
            title="Services and prices"
            intro="Prices vary with hair length, density and the time your service needs. We’ll confirm everything at your consultation."
            className="mb-14"
          />
          <PricingMenu />
        </div>
      </section>

      <Testimonials />

      <section className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-media bg-forest px-6 py-16 text-white sm:px-14 sm:py-20">
            <h2 className="max-w-[18ch] font-display text-[2.4rem] font-semibold leading-[1] tracking-[-0.03em] sm:text-[3.4rem]">
              Request an appointment time
            </h2>
            <p className="mt-5 max-w-md font-serif text-[1.15rem] text-white/70">Tell us when suits you and Cynthia will confirm your appointment personally.</p>
            <Link href="/contact?topic=salon" className="btn-light relative mt-10">
              Request an appointment
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
