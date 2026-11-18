import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import StudioScene from '@/components/ui/StudioScene';
import SectionHeader from '@/components/ui/SectionHeader';
import JewelryGallery from '@/components/jewelry/JewelryGallery';
import PendantVisual from '@/components/jewelry/PendantVisual';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Dichroic Glass Jewelry',
  description: 'Handmade, kiln-fused dichroic glass pendants by artist Cynthia Reedy — every piece one of a kind.',
};

const process = [
  { n: '01', title: 'Cut', body: 'Dichroic and art glass are hand-cut and composed, layer by layer, like a small painting.' },
  { n: '02', title: 'Fuse', body: 'Each piece is fired in a kiln until the layers melt into a single, luminous form.' },
  { n: '03', title: 'Finish', body: 'Edges are polished and a bail is set by hand — ready to catch the light.' },
];

export default function JewelryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Handmade by Cynthia Reedy"
        crumbs={[{ label: 'Glass Jewelry' }]}
        title={
          <>
            Glass, <em className="accent">alive</em> with light.
          </>
        }
        intro="Each pendant is cut, layered and kiln-fused by hand. Thin metal-oxide coatings reflect one color and transmit another — so no two pieces, and no two moments, look the same."
        scene={
          <StudioScene tone="velvet" plinth={false} className="h-full w-full" objectsClassName="bottom-[16%] items-start gap-6">
            <PendantVisual colors={['#E3955A', '#E8C468', '#B85A6A', '#EBA977']} shape="teardrop" className="mt-16 w-[18%] max-w-[110px]" />
            <PendantVisual colors={['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6']} shape="oval" className="w-[26%] max-w-[160px]" />
            <PendantVisual colors={['#9C82D8', '#D88AB5', '#6E8FD8', '#B99BDE']} shape="cabochon" className="mt-24 w-[18%] max-w-[110px]" />
          </StudioScene>
        }
      />

      <section className="relative overflow-hidden bg-[#0D0C10] py-20 text-white sm:py-28">
        <div aria-hidden className="absolute left-1/4 top-0 h-[520px] w-[800px] rounded-full bg-[#5B4A7A]/25 blur-[130px]" />
        <div className="container-x relative">
          <JewelryGallery />
        </div>
      </section>

      <section className="container-x py-24 sm:py-32">
        <SectionHeader index="01" label="The process" title={<>Slow craft, <em className="accent">fired</em> in glass.</>} />
        <ol className="mt-14 grid border-t border-ink sm:grid-cols-3">
          {process.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.1} className="border-b border-line py-9 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
              <span className="font-display text-[3rem] font-semibold italic leading-none text-champagne">{s.n}</span>
              <h3 className="mt-6 font-display text-[1.8rem] font-semibold">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-espresso-700">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[4px] bg-ink px-8 py-16 text-white sm:px-16 sm:py-20">
            <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#7CC9D6]/20 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="eyebrow !text-white">Commissions</p>
                <h2 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] sm:text-[3.6rem]">
                  A color story, <em className="font-medium text-champagne-light">made for you.</em>
                </h2>
                <p className="mt-5 max-w-lg text-white/70">Cynthia creates custom pendants for gifts, milestones and special occasions.</p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link href="/contact?topic=jewelry" className="btn-light">
                  Start a commission <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
