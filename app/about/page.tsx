import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Recycle, Rabbit } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import BotanicalSprig from '@/components/ui/BotanicalSprig';
import GuaranteeGrid from '@/components/GuaranteeGrid';
import SectionHeading from '@/components/ui/SectionHeading';
import { milestones } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Cynthia Reedy — cosmetologist and glass artist — and the Synergy 44 Guarantee.',
};

const sustainable = [
  { icon: Leaf, title: 'Organic & vegan-forward', body: 'We favor certified-organic botanicals and vegan formulas wherever we can.' },
  { icon: Rabbit, title: 'Kind by design', body: 'We choose brands that share our respect for animals and people.' },
  { icon: Recycle, title: 'Less waste', body: 'From reusable Goomee pads to refill-friendly sizes, we look for ways to waste less.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        crumbs={[{ label: 'About' }]}
        title={
          <>
            The Hair Healers <em className="text-iridescent">&amp; the artist</em> behind the glass.
          </>
        }
        intro="Synergy 44 is where two crafts meet — the science of healthy hair and the art of light — both guided by cosmetologist and glass artist Cynthia Reedy."
      />

      {/* Portrait + intro */}
      <section className="container-x grid items-center gap-16 py-24 lg:grid-cols-2 lg:gap-24">
        <Parallax speed={30}>
          {/* Replace with <Image> portrait of Cynthia */}
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-t-full bg-gradient-to-b from-sage-mist to-champagne-pale shadow-float">
            <BotanicalSprig className="absolute bottom-0 left-1/2 h-[85%] -translate-x-1/2 text-sage/40" leaves={8} />
            <span className="absolute left-1/2 top-[30%] -translate-x-1/2 font-display text-8xl italic text-espresso/15">CR</span>
          </div>
        </Parallax>
        <Reveal>
          <p className="eyebrow">Meet Cynthia</p>
          <h2 className="h-section mt-4">
            An artist’s eye, <em>a healer’s</em> hands.
          </h2>
          <div className="lead mt-6 space-y-5">
            <p>
              Cynthia studied at Eastern Michigan University, where a foundation in art, color and form shaped everything that came
              after. That same sensibility guides her work as a licensed cosmetologist — and her glass studio.
            </p>
            <p>
              Her approach to hair is restorative first: listen closely, treat gently, and recommend only what she would use herself.
              Her professional cosmetology journals document years of technique, care and client stories.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="container-x py-16">
        <SectionHeading eyebrow="The journey" title={<>A practice built <em>slowly</em>.</>} />
        <ol className="relative mt-14 border-l border-espresso/10 pl-8 sm:pl-12">
          {milestones.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 0.06} className="relative pb-14 last:pb-0">
              <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-cream bg-sage ring-1 ring-sage sm:-left-[53px]" />
              <p className="eyebrow text-champagne">{m.phase}</p>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl">{m.title}</h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-espresso-500">{m.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Guarantee */}
      <section className="py-24">
        <div className="container-x">
          <div className="rounded-[40px] bg-sage-mist px-6 py-16 sm:px-12 lg:px-16">
            <SectionHeading
              align="center"
              eyebrow="Our promise"
              title={
                <>
                  The Synergy 44 <em className="text-iridescent">Guarantee</em>
                </>
              }
              intro="Clean products, honest advice and handmade quality — backed by a simple promise: if something isn’t right, we’ll make it right."
              className="mb-14"
            />
            <GuaranteeGrid />
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="container-x py-12">
        <SectionHeading eyebrow="Sustainable by choice" title={<>Beauty that <em>respects</em> the planet.</>} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {sustainable.map(({ icon: Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08} className="card p-8">
              <Icon className="h-6 w-6 text-sage" strokeWidth={1.4} />
              <h3 className="mt-6 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-espresso-500">{body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-16 flex flex-wrap justify-center gap-3">
          <Link href="/products/hair-care" className="btn-dark">
            Shop clean hair care
          </Link>
          <Link href="/contact" className="btn-outline">
            Get in touch
          </Link>
        </Reveal>
      </section>
    </>
  );
}
