import Image from 'next/image';
import Link from 'next/link';
import { Gem, Scissors } from 'lucide-react';
import cynthiaPortrait from '@/public/images/cynthia-reedy.jpg';
import SpotlightCard from './SpotlightCard';
import type { Product } from '@/lib/types';

/**
 * Home hero: Cynthia's two crafts on the left, her portrait in a dark-glass editorial frame on
 * the right with a studio caption and a floating "Cynthia's pick" product card.
 * Entrance is a CSS stagger (.intro / .intro-portrait / .intro-float) — no JS animation cost.
 */
export default function Hero({ spotlight }: { spotlight?: Product }) {
  return (
    <section className="relative overflow-hidden">
      {/* Soft blue light behind the portrait (a gradient, not a blur filter) */}
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] h-[760px] w-[760px] bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-x relative grid grid-cols-[minmax(0,1fr)] gap-14 pb-20 pt-12 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-24">
        <div className="intro lg:col-span-6 xl:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-stone-700">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light" />
            Studios in Michigan and California
          </p>
          <h1 className="mt-7 max-w-[14ch] font-display text-[clamp(2.8rem,6vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
            Healthier hair. Handmade glass.
          </h1>
          <p className="mt-7 max-w-[46ch] font-serif text-[1.2rem] leading-[1.6] text-stone-700 sm:text-[1.3rem]">
            Cynthia Reedy is a licensed cosmetologist who sells the clean hair care she uses in her own chair, and a glass artist who
            kiln-fuses every dichroic pendant by hand.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/products/hair-care" className="btn-primary">
              Shop hair care
            </Link>
            <Link href="/jewelry" className="btn-outline">
              Discover glass art
            </Link>
            <Link href="/hair-styling" className="link-underline ml-1 hidden sm:inline-flex">
              Book a salon visit
            </Link>
          </div>
          <ul className="mt-12 grid max-w-lg gap-4 border-t border-white/10 pt-7 sm:grid-cols-2">
            <li className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-iris-light">
                <Scissors className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span className="text-[14.5px] leading-snug text-stone-500">
                <span className="block font-medium text-ink">Licensed cosmetologist</span>
                Organic, vegan-forward care
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-iris-light">
                <Gem className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span className="text-[14.5px] leading-snug text-stone-500">
                <span className="block font-medium text-ink">Dichroic glass artist</span>
                Every pendant one of a kind
              </span>
            </li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[480px] lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <figure className="intro-portrait relative">
            {/* Dark-glass editorial frame */}
            <div className="film rounded-[30px] p-px shadow-float">
              <div className="rounded-[29px] bg-surface p-2.5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-elevated">
                  <Image
                    src={cynthiaPortrait}
                    alt="Cynthia Reedy, cosmetologist and glass artist"
                    priority
                    placeholder="blur"
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="h-full w-full object-cover object-[50%_25%]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b0f17]/80 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* Studio caption */}
            <figcaption className="glass intro-float absolute left-5 right-5 top-5 flex items-center justify-between gap-4 px-4 py-3 sm:left-auto sm:right-6 sm:top-6 sm:w-auto">
              <span className="text-[13.5px] leading-tight">
                <span className="block font-semibold text-ink">Cynthia Reedy</span>
                <span className="text-stone-500">Michigan &amp; California studios</span>
              </span>
              <Link href="/about" className="shrink-0 rounded-full bg-white/[0.06] px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:bg-accent hover:text-white">
                Her story
              </Link>
            </figcaption>
          </figure>

          {spotlight && (
            <div className="intro-float relative z-10 -mt-12 px-4 sm:px-8 lg:absolute lg:-bottom-6 lg:-left-16 lg:mt-0 lg:w-[340px] lg:px-0">
              <SpotlightCard product={spotlight} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
