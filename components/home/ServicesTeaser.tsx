import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import StudioScene from '@/components/ui/StudioScene';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import ProductVisual from '@/components/shop/ProductVisual';
import { serviceGroups } from '@/lib/data/content';

const highlights = serviceGroups
  .flatMap((g) => g.services.map((s) => ({ ...s, group: g.title })))
  .filter((s) => ['Women’s Haircut', 'Men’s Haircut', 'Full Hi-Lights', 'Glaze', 'Roots'].includes(s.name));

export default function ServicesTeaser() {
  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeader
        index="04"
        label="The salon"
        title={
          <>
            Hair styling with <em className="accent">healing hands.</em>
          </>
        }
      />

      <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-6">
        <div className="relative lg:col-span-5">
          <Parallax speed={30}>
            <StudioScene tone="espresso" plinthWidth="60%" className="aspect-[4/5] w-full rounded-[3px]" objectsClassName="gap-5">
              <ProductVisual shape="dryer" colors={['#3A3733', '#1E1D1B']} cap="#B8975E" label="Gama" className="h-[170px] sm:h-[230px]" />
              <ProductVisual shape="wand" colors={['#E8D3D8', '#B88E98']} cap="#D9C29A" label="Sutra" className="h-[200px] sm:h-[270px]" />
            </StudioScene>
          </Parallax>
          <Reveal delay={0.2} className="glass absolute -bottom-8 left-6 right-6 p-6 sm:left-10 sm:right-auto sm:w-[320px] lg:-right-12 lg:left-auto">
            <p className="font-display text-[1.4rem] font-medium italic leading-snug">Healthy hair is the most beautiful style there is.</p>
            <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-espresso-500">The Synergy 44 philosophy</p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7">
          <p className="lead max-w-lg">
            Precision cuts, dimensional hi-lights and gentle color. Every appointment starts with a conversation about the long-term
            health of your hair.
          </p>
          <ul className="mt-10 border-t border-ink">
            {highlights.map((s) => (
              <li key={s.name}>
                <Link href="/hair-styling#menu" className="group flex items-center gap-5 border-b border-line py-5 transition-colors duration-500 hover:bg-paper sm:px-3">
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[1.45rem] font-semibold leading-tight transition-transform duration-500 ease-silk group-hover:translate-x-2">{s.name}</span>
                    <span className="mt-1 block text-[12px] uppercase tracking-[0.14em] text-espresso-500">{s.group}</span>
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums">{s.price}</span>
                  <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 transition-all duration-500 ease-silk group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact?topic=salon" className="btn-dark">
              Book an appointment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/hair-styling" className="btn-outline">
              Full menu
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
