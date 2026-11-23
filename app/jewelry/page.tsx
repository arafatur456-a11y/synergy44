import type { Metadata } from 'next';
import Link from 'next/link';
import InstagramLink from '@/components/ui/InstagramLink';
import PageHeader from '@/components/ui/PageHeader';
import StudioScene from '@/components/ui/StudioScene';
import SectionHeader from '@/components/ui/SectionHeader';
import JewelryGallery from '@/components/jewelry/JewelryGallery';
import PendantVisual from '@/components/jewelry/PendantVisual';
import Reveal from '@/components/ui/Reveal';
import { getPendants } from '@/lib/catalog';
import CollectionHero, { pickHeroItems } from '@/components/shop/CollectionHero';

export const metadata: Metadata = {
  title: 'Dichroic Glass Jewelry',
  description: 'Handmade, kiln-fused dichroic glass pendants by artist Cynthia Reedy — every piece one of a kind.',
};

const process = [
  { n: '1', title: 'Cut', body: 'Dichroic and clear glass are cut and stacked by hand, like a small collage.' },
  { n: '2', title: 'Fuse', body: 'The stack is fired in the kiln until the layers melt into a single piece.' },
  { n: '3', title: 'Finish', body: 'Edges are polished and a bail is set by hand, ready to wear.' },
];

export default async function JewelryPage() {
  const pendants = await getPendants();
  return (
    <>
      <PageHeader
        eyebrow="Handmade by Cynthia Reedy"
        crumbs={[{ label: 'Glass jewelry' }]}
        title={
          <>
            Dichroic glass pendants, one of each
          </>
        }
        intro="Cynthia cuts, layers and kiln-fuses each pendant by hand. The metal-oxide layers reflect one color and pass another, so a piece looks different as you move. When one sells, it’s gone."
        scene={
          <CollectionHero
            tone="dark"
            items={pickHeroItems(pendants).map((p) => ({ ...p, label: p.collection }))}
            fallback={
              <StudioScene tone="velvet" plinth={false} className="h-full w-full" objectsClassName="bottom-[16%] items-start gap-6">
                <PendantVisual colors={['#E3955A', '#E8C468', '#B85A6A', '#EBA977']} shape="teardrop" className="mt-16 w-[18%] max-w-[110px]" />
                <PendantVisual colors={['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6']} shape="oval" className="w-[26%] max-w-[160px]" />
                <PendantVisual colors={['#9C82D8', '#D88AB5', '#6E8FD8', '#B99BDE']} shape="cabochon" className="mt-24 w-[18%] max-w-[110px]" />
              </StudioScene>
            }
          />
        }
      />

      <section className="relative overflow-hidden bg-kiln py-20 text-white sm:py-28">
        <div className="container-x relative">
          <JewelryGallery pendants={pendants} />
        </div>
      </section>

      <section className="container-x py-20 sm:py-28">
        <SectionHeader title="How each piece is made" />
        <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {process.map((s) => (
            <li key={s.n} className="border-t border-ink/20 pt-6">
              <p className="flex items-baseline gap-3">
                <span className="text-[15px] tabular-nums text-iris">{s.n}.</span>
                <span className="text-[1.5rem] font-semibold tracking-[-0.02em]">{s.title}</span>
              </p>
              <p className="body-serif mt-2 max-w-[30ch]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-media border border-white/10 bg-surface px-6 py-14 text-white sm:px-14 sm:py-20">
            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <h2 className="max-w-[16ch] font-display text-[2.4rem] font-semibold leading-[1] tracking-[-0.03em] sm:text-[3.4rem]">
                  Commission a pendant in your colors
                </h2>
                <p className="mt-5 max-w-lg font-serif text-[1.15rem] text-white/70">For a gift, a birthstone palette or a milestone. Tell Cynthia the colors and the occasion and she’ll propose a design.</p>
              </div>
              <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:items-end">
                <Link href="/contact?topic=jewelry" className="btn-light">
                  Start a commission
                </Link>
                <InstagramLink tone="dark" label="New pieces on Instagram" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
