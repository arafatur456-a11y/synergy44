import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import StudioScene from '@/components/ui/StudioScene';
import Reveal from '@/components/ui/Reveal';
import ProductCard from '@/components/shop/ProductCard';
import ProductVisual from '@/components/shop/ProductVisual';
import { featuredProducts, products } from '@/lib/data/products';

const o3 = products.find((p) => p.id === 'olaplex-3')!;
const o7 = products.find((p) => p.id === 'olaplex-7')!;
const o4 = products.find((p) => p.id === 'olaplex-4')!;

export default function FeaturedEdit() {
  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeader
        index="01"
        label="The edit"
        title={
          <>
            The ritual <em className="accent">essentials.</em>
          </>
        }
        intro="The formulas our stylists reach for most — chosen for repair, moisture and effortless, healthy styling."
        action={
          <Link href="/products/hair-care" className="link-underline self-start">
            Shop all hair care <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="mt-16 grid gap-x-5 gap-y-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Link href="/products/hair-care/olaplex" className="group relative block h-[560px] overflow-hidden rounded-[3px] sm:h-[640px] lg:sticky lg:top-32 lg:h-[min(760px,calc(100svh-160px))]">
            <div className="absolute inset-0 transition-transform duration-[1.6s] ease-silk group-hover:scale-[1.05]">
              <StudioScene tone="espresso" plinthWidth="62%" className="h-full w-full" objectsClassName="gap-3">
                <ProductVisual {...o4} label="Olaplex" className="h-[200px] -rotate-2 sm:h-[240px]" />
                <ProductVisual {...o3} label="Olaplex" className="h-[230px] sm:h-[270px]" />
                <ProductVisual {...o7} label="Olaplex" className="h-[150px] rotate-2 sm:h-[170px]" />
              </StudioScene>
            </div>
            <div className="absolute inset-x-5 top-5 flex items-start justify-between text-white">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-champagne-light">Featured edit</span>
              <span className="font-display text-sm italic text-white/70">No. 03 · 04 · 07</span>
            </div>
            <div className="glass-dark absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 p-6">
              <div>
                <h3 className="font-display text-[1.9rem] font-semibold leading-tight">The Bond Repair Edit</h3>
                <p className="mt-2 max-w-xs text-sm text-white/70">Strengthen, protect and restore shine — the three-step Olaplex ritual.</p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-silk group-hover:rotate-[-45deg]">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        </Reveal>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-5 lg:col-span-7">
          {featuredProducts.slice(0, 4).map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
