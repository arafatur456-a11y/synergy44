import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductVisual from '@/components/shop/ProductVisual';
import PendantVisual from '@/components/jewelry/PendantVisual';

export default function CraftsSplit() {
  return (
    <section className="container-x py-28 sm:py-36">
      <SectionHeading
        align="center"
        eyebrow="Two crafts, one philosophy"
        title={
          <>
            Care for your hair. <em className="text-iridescent">Wear the light.</em>
          </>
        }
        intro="Synergy 44 brings together a clean hair-care apothecary and an artisan glass studio — both guided by the same belief in quality, patience and beauty that lasts."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <Reveal>
          <Link href="/products/hair-care" className="block h-full">
            <TiltCard className="card overflow-hidden p-3">
              <div className="relative flex h-[340px] items-end justify-center gap-2 overflow-hidden rounded-[22px] bg-gradient-to-br from-sage-mist via-[#E7EDE6] to-champagne-pale pb-10 sm:h-[420px]">
                <div aria-hidden className="absolute bottom-8 h-10 w-3/4 rounded-full bg-espresso/10 blur-2xl" />
                <ProductVisual shape="pump" colors={['#E6DCEF', '#9584B7']} cap="#F6F3F8" label="Neuma" className="relative h-44 -rotate-3 transition-transform duration-700 ease-silk group-hover:-translate-y-2 sm:h-56" />
                <ProductVisual shape="tube" colors={['#FBFAF8', '#D9D3CA']} cap="#2B2926" label="Olaplex" className="relative h-52 transition-transform duration-700 ease-silk group-hover:-translate-y-3 sm:h-64" />
                <ProductVisual shape="spray" colors={['#C9DCCF', '#6F9480']} cap="#F4F1EB" label="MKS Eco" className="relative h-44 rotate-3 transition-transform duration-700 ease-silk group-hover:-translate-y-2 sm:h-56" />
              </div>
              <div className="flex items-end justify-between gap-6 p-6">
                <div>
                  <p className="eyebrow">The apothecary</p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl">Hair Care</h3>
                  <p className="mt-2 max-w-sm text-sm text-espresso-500">Seven trusted brands, chosen by a stylist for healthier hair.</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-espresso/15 transition-all duration-500 group-hover:border-espresso group-hover:bg-espresso group-hover:text-cream">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                </span>
              </div>
            </TiltCard>
          </Link>
        </Reveal>

        <Reveal delay={0.12}>
          <Link href="/jewelry" className="block h-full">
            <TiltCard className="card overflow-hidden p-3">
              <div className="iridescent relative flex h-[340px] items-start justify-center gap-6 overflow-hidden rounded-[22px] sm:h-[420px]">
                <PendantVisual colors={['#E3955A', '#E8C468', '#B85A6A', '#EBA977']} shape="teardrop" className="mt-6 w-24 transition-transform duration-700 ease-silk group-hover:translate-y-2 sm:w-28" />
                <PendantVisual colors={['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6']} shape="oval" className="w-32 transition-transform duration-700 ease-silk group-hover:translate-y-3 sm:w-36" />
                <PendantVisual colors={['#9C82D8', '#D88AB5', '#6E8FD8', '#B99BDE']} shape="cabochon" className="mt-10 w-24 transition-transform duration-700 ease-silk group-hover:translate-y-2 sm:w-28" />
              </div>
              <div className="flex items-end justify-between gap-6 p-6">
                <div>
                  <p className="eyebrow text-champagne">The studio</p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl">Dichroic Glass</h3>
                  <p className="mt-2 max-w-sm text-sm text-espresso-500">Kiln-fused pendants, handmade by Cynthia Reedy. Each one unique.</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-espresso/15 transition-all duration-500 group-hover:border-espresso group-hover:bg-espresso group-hover:text-cream">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                </span>
              </div>
            </TiltCard>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
