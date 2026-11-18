import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarHeart, MessageCircle, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import PricingMenu from '@/components/services/PricingMenu';
import Testimonials from '@/components/Testimonials';
import Reveal from '@/components/ui/Reveal';

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
        tint="#EFE2C6"
        crumbs={[{ label: 'Hair Styling' }]}
        title={
          <>
            Hair styling with <em className="text-iridescent">healing</em> hands.
          </>
        }
        intro="Cuts, hi-lights, glazes and root color from a licensed cosmetologist who puts the long-term health of your hair first."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact?topic=salon" className="btn-dark">
            Book an appointment
          </Link>
          <a href="#menu" className="btn-outline">
            View the menu
          </a>
        </div>
      </PageHeader>

      <section className="container-x py-20">
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08} className="flex gap-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sage-pale text-sage-dark">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-espresso-500">{body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="menu" className="container-x scroll-mt-28 py-10">
        <Reveal className="mb-10 max-w-2xl">
          <p className="eyebrow">The menu</p>
          <h2 className="h-section mt-4">
            Services &amp; <em>pricing</em>
          </h2>
          <p className="lead mt-4">Prices vary with hair length, density and the time your service needs. We’ll confirm everything at your consultation.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <PricingMenu />
        </Reveal>
      </section>

      <Testimonials eyebrow="From our salon chair" />

      <section className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-espresso px-8 py-16 text-center text-cream sm:px-16">
            <div aria-hidden className="absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-sage/40 blur-3xl" />
            <h2 className="relative font-display text-4xl font-light sm:text-5xl">
              Ready for <em className="text-champagne-light">healthier</em> hair?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-cream/70">Request a time that suits you — we’ll confirm your appointment personally.</p>
            <Link href="/contact?topic=salon" className="btn relative mt-8 bg-cream text-espresso hover:bg-champagne-light">
              Request an appointment
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
