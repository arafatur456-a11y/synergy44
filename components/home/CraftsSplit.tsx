import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import StudioScene from '@/components/ui/StudioScene';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import ProductVisual from '@/components/shop/ProductVisual';
import PendantVisual from '@/components/jewelry/PendantVisual';

export default function CraftsSplit() {
  return (
    <section className="border-y border-ink/10 bg-paper py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          index="02"
          label="Two crafts, one philosophy"
          title={
            <>
              Care for your hair. <em className="accent">Wear the light.</em>
            </>
          }
          intro="A clean-beauty apothecary and an artisan glass studio, guided by the same belief in patience, quality and beauty that lasts."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7">
            <Link href="/products/hair-care" className="group block">
              <div className="relative overflow-hidden rounded-[3px]">
                <div className="transition-transform duration-[1.6s] ease-silk group-hover:scale-[1.04]">
                  <StudioScene tone="stone" plinthWidth="60%" className="aspect-[4/3.4] w-full" objectsClassName="gap-3 sm:gap-5">
                    <ProductVisual shape="pump" colors={['#E6DCEF', '#9584B7']} cap="#F6F3F8" label="Neuma" className="h-[180px] sm:h-[260px]" />
                    <ProductVisual shape="tube" colors={['#FBFAF8', '#D9D3CA']} cap="#2B2926" label="Olaplex" className="h-[200px] sm:h-[300px]" />
                    <ProductVisual shape="spray" colors={['#C9DCCF', '#6F9480']} cap="#F4F1EB" label="MKS Eco" className="h-[180px] sm:h-[260px]" />
                    <ProductVisual shape="jar" colors={['#F2E6D0', '#CDB28A']} cap="#E7DCC8" label="Loma" className="hidden h-[200px] sm:block sm:h-[230px]" />
                  </StudioScene>
                </div>
                <span className="absolute left-5 top-5 font-display text-[4.5rem] font-semibold italic leading-none text-ink/10">I</span>
              </div>
              <div className="mt-7 flex items-end justify-between gap-6 border-b border-ink pb-6">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-champagne">The apothecary</p>
                  <h3 className="mt-2 font-display text-[2.2rem] font-semibold leading-none sm:text-[2.6rem]">Hair care</h3>
                  <p className="mt-3 max-w-md text-[15px] text-espresso-700">Seven trusted brands, chosen behind the chair for healthier hair at home.</p>
                </div>
                <span className="link-underline shrink-0">
                  Shop <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5 lg:pt-40">
            <Parallax speed={40}>
              <Link href="/jewelry" className="group block">
                <div className="relative overflow-hidden rounded-[3px]">
                  <div className="transition-transform duration-[1.6s] ease-silk group-hover:scale-[1.04]">
                    <StudioScene tone="velvet" plinth={false} className="aspect-[4/5] w-full" objectsClassName="bottom-[18%] gap-5 items-start">
                      <PendantVisual colors={['#E3955A', '#E8C468', '#B85A6A', '#EBA977']} shape="teardrop" className="mt-10 w-[22%]" />
                      <PendantVisual colors={['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6']} shape="oval" className="w-[30%]" />
                      <PendantVisual colors={['#9C82D8', '#D88AB5', '#6E8FD8', '#B99BDE']} shape="cabochon" className="mt-14 w-[22%]" />
                    </StudioScene>
                  </div>
                  <span className="absolute left-5 top-5 font-display text-[4.5rem] font-semibold italic leading-none text-white/15">II</span>
                </div>
                <div className="mt-7 flex items-end justify-between gap-6 border-b border-ink pb-6">
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-champagne">The studio</p>
                    <h3 className="mt-2 font-display text-[2.2rem] font-semibold leading-none sm:text-[2.6rem]">Dichroic glass</h3>
                    <p className="mt-3 max-w-sm text-[15px] text-espresso-700">Kiln-fused pendants by Cynthia Reedy. Each one unique.</p>
                  </div>
                  <span className="link-underline shrink-0">
                    View <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
