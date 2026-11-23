import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import InstagramLink from '@/components/ui/InstagramLink';
import { Leaf, Rabbit, Recycle } from 'lucide-react';
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
  { icon: Leaf, title: 'Organic and vegan-forward', body: 'We favor certified-organic botanicals and vegan formulas wherever we can.' },
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
            The Hair Healers &amp; the artist behind the glass.
          </>
        }
        intro="Synergy 44 brings together two crafts, healthy hair and dichroic glass, both practiced by cosmetologist and glass artist Cynthia Reedy."
      />

      {/* Portrait + story */}
      <section className="container-x grid gap-12 pb-20 pt-4 sm:pb-28 lg:grid-cols-12 lg:gap-8">
        <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
          <figure>
              <div className="relative aspect-[4/5] overflow-hidden rounded-media">
                <Image
                  src={cynthiaPortrait}
                  alt="Portrait of Cynthia Reedy, cosmetologist and glass artist, smiling outdoors"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 460px, 92vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-4 text-[14px] text-stone-500">
                <span className="font-medium text-ink">Cynthia Reedy</span>, cosmetologist and glass artist
              </figcaption>
            </figure>
        </div>
        <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-12">
          <h2 className="h-section">
            An artist’s eye, a healer’s hands.
          </h2>
          <div className="body-serif mt-8 max-w-[60ch] space-y-5 !text-[1.15rem]">
            <p>
              Cynthia studied at Eastern Michigan University, where a foundation in art, color and form shaped everything that came after.
              That same sensibility guides her work as a licensed cosmetologist — and her glass studio.
            </p>
            <p>
              Her approach to hair is restorative first: listen closely, treat gently, and recommend only what she would use herself. Her
              professional cosmetology journals document years of technique, care and client stories.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link href="/contact?topic=consultation" className="btn-dark">
              Book a consultation
            </Link>
            <InstagramLink label="Follow the studio on Instagram" />
          </div>
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          <SectionHeader title="How the practice came together" />
          <ol className="mt-12 border-t border-ink/20">
            {milestones.map((m) => (
              <li key={m.title} className="grid gap-3 border-b border-line py-8 sm:grid-cols-12 sm:gap-6">
                <p className="label sm:col-span-2 sm:pt-2">{m.phase}</p>
                <h3 className="text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] sm:col-span-4">{m.title}</h3>
                <p className="body-serif sm:col-span-6">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Guarantee — dark */}
      <section className="relative overflow-hidden bg-forest py-20 text-white sm:py-28">
        <div className="container-x relative">
          <SectionHeader
            dark
            title="If something isn’t right, we’ll make it right"
            intro="That’s the Synergy 44 guarantee, on every product, appointment and pendant."
            className="mb-12"
          />
          <GuaranteeGrid dark />
        </div>
      </section>

      {/* Sustainability */}
      <section className="container-x py-20 sm:py-28">
        <SectionHeader title="Choosing products that are easier on the planet" />
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {sustainable.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Icon className="h-6 w-6 text-sage-dark" strokeWidth={1.5} />
              <h3 className="mt-5 text-[1.3rem] font-semibold tracking-[-0.015em]">{title}</h3>
              <p className="body-serif mt-2 max-w-[34ch]">{body}</p>
            </li>
          ))}
        </ul>
        <Reveal className="mt-12 flex flex-wrap gap-3">
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
