import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarHeart, MessageCircle, Sparkles } from 'lucide-react';
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
        crumbs={[{ label: 'Hair Styling' }]}
        title={
          <>
            Hair styling with <em className="accent">healing</em> hands.
          </>
        }
        intro="Cuts, hi-lights, glazes and root color from a licensed cosmetologist who puts the long-term health of your hair first."
        scene={
          <StudioScene tone="espresso" plinthWidth="58%" className="h-full w-full" objectsClassName="gap-4">
            <ProductVisual shape="dryer" colors={['#3A3733', '#1E1D1B']} cap="#B8975E" label="Gama" className="h-[170px] sm:h-[220px]" />
            <ProductVisual shape="wand" colors={['#E8D3D8', '#B88E98']} cap="#D9C29A" label="Sutra" className="h-[200px] sm:h-[260px]" />
          </StudioScene>
        }
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact?topic=salon" className="btn-dark">
            Book an appointment <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#menu" className="btn-outline">
            View the menu
          </a>
        </div>
      </PageHeader>

      <section className="container-x py-20">
        <ol className="grid border-t border-ink md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08} className="border-b border-line py-9 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <div className="flex items-center justify-between">
                <span className="font-display text-[2.4rem] font-semibold italic leading-none text-champagne">0{i + 1}</span>
                <Icon className="h-5 w-5 text-sage-dark" strokeWidth={1.4} />
              </div>
              <h2 className="mt-6 font-display text-[1.8rem] font-semibold">{title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-espresso-700">{body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="menu" className="relative scroll-mt-28 overflow-hidden border-y border-ink/10 bg-cream-100 py-24 sm:py-32">
        <div aria-hidden className="absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(241,230,207,0.75),transparent)]" />
        <div className="container-x relative">
          <SectionHeader
            index="01"
            label="The menu"
            title={
              <>
                Services &amp; <em className="accent">pricing.</em>
              </>
            }
            intro="Prices vary with hair length, density and the time your service needs. We’ll confirm everything at your consultation."
            className="mb-14"
          />
          <PricingMenu />
        </div>
      </section>

      <Testimonials index="02" label="From our salon chair" />

      <section className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[4px] bg-forest px-8 py-20 text-center text-white sm:px-16">
            <div aria-hidden className="absolute -top-24 left-1/2 h-72 w-[700px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(74,107,93,0.45),transparent)]" />
            <h2 className="relative font-display text-[2.6rem] font-semibold leading-[1.02] sm:text-[3.8rem]">
              Ready for <em className="font-medium text-champagne-light">healthier</em> hair?
            </h2>
            <p className="relative mx-auto mt-5 max-w-md text-white/70">Request a time that suits you — we’ll confirm your appointment personally.</p>
            <Link href="/contact?topic=salon" className="btn-light relative mt-10">
              Request an appointment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
