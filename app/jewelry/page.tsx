import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import JewelryGallery from '@/components/jewelry/JewelryGallery';
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
        tint="#E6DEF0"
        crumbs={[{ label: 'Glass Jewelry' }]}
        title={
          <>
            Dichroic glass, <em className="text-iridescent">alive</em> with light.
          </>
        }
        intro="Each pendant is cut, layered and kiln-fused by hand. Thin metal-oxide coatings reflect one color and transmit another, so no two pieces — and no two moments — look the same."
      />

      <section className="container-x py-16 sm:py-20">
        <JewelryGallery />
      </section>

      <section className="container-x py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">The process</p>
            <h2 className="h-section mt-4">
              Slow craft, <em>fired</em> in glass.
            </h2>
          </Reveal>
          <ol className="grid gap-px overflow-hidden rounded-[28px] bg-espresso/[0.08] ring-1 ring-espresso/[0.08] sm:grid-cols-3 lg:col-span-8">
            {process.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.1} className="bg-cream p-8">
                <span className="font-display text-5xl italic text-champagne">{s.n}</span>
                <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-espresso-500">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x pb-8">
        <Reveal>
          <div className="iridescent flex flex-col items-start justify-between gap-8 rounded-[36px] p-10 sm:p-14 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-4xl font-light sm:text-5xl">Commission a piece</h2>
              <p className="mt-3 max-w-lg text-espresso-500">Have a color story in mind? Cynthia creates custom pendants for gifts and special occasions.</p>
            </div>
            <Link href="/contact?topic=jewelry" className="btn-dark shrink-0">
              Start a commission
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
