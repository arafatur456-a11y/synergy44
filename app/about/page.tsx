import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Rabbit, Recycle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import StudioScene from '@/components/ui/StudioScene';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import GuaranteeGrid from '@/components/GuaranteeGrid';
import PendantVisual from '@/components/jewelry/PendantVisual';
import ProductVisual from '@/components/shop/ProductVisual';
import { milestones } from '@/lib/data';
import cynthiaPortrait from '@/public/images/cynthia-reedy.jpg';

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
            The Hair Healers <em className="accent">&amp; the artist</em> behind the glass.
          </>
        }
        intro="Synergy 44 is where two crafts meet — the science of healthy hair and the art of light — both guided by cosmetologist and glass artist Cynthia Reedy."
        scene={
          <StudioScene tone="forest" plinthWidth="54%" className="h-full w-full" objectsClassName="items-end gap-8">
            <ProductVisual shape="dropper" colors={['#F5DFA8', '#B98436']} cap="#F7F3EC" label="Loma" className="h-[170px] sm:h-[220px]" />
            <PendantVisual colors={['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6']} shape="oval" chain={false} className="mb-4 w-24 sm:w-28" />
          </StudioScene>
        }
      />

      {/* Portrait + story */}
      <section className="container-x grid gap-16 py-24 sm:py-32 lg:grid-cols-12 lg:gap-6">
        <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
          <Parallax speed={24}>
            <figure className="rounded-[6px] bg-paper p-2.5 shadow-lift ring-1 ring-ink/[0.06] sm:p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] ring-1 ring-inset ring-champagne/40">
                <Image
                  src={cynthiaPortrait}
                  alt="Portrait of Cynthia Reedy, cosmetologist and glass artist, smiling outdoors"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 460px, 92vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="flex flex-col gap-1 px-2 pb-1 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="font-display text-[1.15rem] font-semibold">Cynthia Reedy</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-espresso-500">Cosmetologist · Glass artist</span>
              </figcaption>
            </figure>
          </Parallax>
        </div>
        <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-12">
          <p className="eyebrow">Meet Cynthia</p>
          <h2 className="h-section mt-6">
            An artist’s eye, <em className="accent">a healer’s hands.</em>
          </h2>
          <div className="mt-8 space-y-6 text-[1.08rem] leading-[1.75] text-espresso-700">
            <p>
              Cynthia studied at Eastern Michigan University, where a foundation in art, color and form shaped everything that came after.
              That same sensibility guides her work as a licensed cosmetologist — and her glass studio.
            </p>
            <p>
              Her approach to hair is restorative first: listen closely, treat gently, and recommend only what she would use herself. Her
              professional cosmetology journals document years of technique, care and client stories.
            </p>
          </div>
          <Link href="/contact?topic=consultation" className="btn-dark mt-10">
            Book a consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="border-y border-ink/10 bg-paper py-24 sm:py-32">
        <div className="container-x">
          <SectionHeader index="01" label="The journey" title={<>A practice built <em className="accent">slowly.</em></>} />
          <ol className="mt-14 border-t border-ink">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.title} delay={i * 0.06} className="group grid gap-4 border-b border-line py-9 sm:grid-cols-12 sm:gap-6">
                <span className="font-display text-[2.4rem] font-semibold italic leading-none text-champagne sm:col-span-2">0{i + 1}</span>
                <div className="sm:col-span-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso-500">{m.phase}</p>
                  <h3 className="mt-2 font-display text-[1.9rem] font-semibold leading-tight transition-transform duration-500 ease-silk group-hover:translate-x-1.5">{m.title}</h3>
                </div>
                <p className="text-[15.5px] leading-relaxed text-espresso-700 sm:col-span-6">{m.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Guarantee — dark */}
      <section className="relative overflow-hidden bg-forest py-24 text-white sm:py-32">
        <div aria-hidden className="absolute -left-40 top-0 h-[480px] w-[640px] bg-[radial-gradient(closest-side,rgba(74,107,93,0.35),transparent)]" />
        <div className="container-x relative">
          <SectionHeader
            dark
            index="02"
            label="Our promise"
            title={
              <>
                The Synergy 44 <em className="font-medium italic text-champagne-light">Guarantee.</em>
              </>
            }
            intro="Clean products, honest advice and handmade quality — backed by a simple promise: if something isn’t right, we’ll make it right."
            className="mb-14"
          />
          <GuaranteeGrid dark />
        </div>
      </section>

      {/* Sustainability */}
      <section className="container-x py-24 sm:py-32">
        <SectionHeader index="03" label="Sustainable by choice" title={<>Beauty that <em className="accent">respects</em> the planet.</>} />
        <ul className="mt-14 grid border-t border-ink md:grid-cols-3">
          {sustainable.map(({ icon: Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08} className="border-b border-line py-9 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <Icon className="h-6 w-6 text-sage-dark" strokeWidth={1.3} />
              <h3 className="mt-6 font-display text-[1.7rem] font-semibold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-espresso-700">{body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-14 flex flex-wrap gap-3">
          <Link href="/products/hair-care" className="btn-dark">
            Shop clean hair care <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="btn-outline">
            Get in touch
          </Link>
        </Reveal>
      </section>
    </>
  );
}
