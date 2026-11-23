import Image from 'next/image';
import Link from 'next/link';
import cynthiaPortrait from '@/public/images/cynthia-reedy.jpg';
import SpotlightRow from './SpotlightRow';
import type { Product } from '@/lib/types';

/**
 * Home hero. The one bold device on the site lives here: Cynthia's portrait set in a
 * cabochon (the oval her pendants are cut to) with a dichroic thin-film rim. The rim's hue
 * turns as the page scrolls (CSS scroll timeline, no JS) and settles on load.
 */
export default function Hero({ spotlight }: { spotlight?: Product }) {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-12 pb-16 pt-10 sm:pt-14 lg:min-h-[calc(100svh-96px)] lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-20">
        <div className="intro lg:col-span-7">
          <h1 className="max-w-[13ch] font-display text-[clamp(2.9rem,6.6vw,6.1rem)] font-semibold leading-[0.93] tracking-[-0.04em] text-ink">
            Healthier hair and handmade glass, from one studio.
          </h1>
          <p className="lead mt-8 max-w-[40ch]">
            Cynthia Reedy is a licensed cosmetologist and a glass artist. She sells the clean hair care she trusts in her own chair, and
            kiln-fuses every dichroic pendant herself.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/products/hair-care" className="btn-dark">
              Shop hair care
            </Link>
            <Link href="/jewelry" className="btn-outline">
              See the glass
            </Link>
          </div>
          {spotlight && (
            <div className="mt-14 max-w-xl">
              <SpotlightRow product={spotlight} />
            </div>
          )}
        </div>

        <figure className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
          {/* Thin-film rim: a conic interference gradient behind an inset oval */}
          <div className="intro-film film film-scroll cabochon relative aspect-[4/5] w-full p-[5px] shadow-float sm:p-[6px]">
            <div className="cabochon relative h-full w-full overflow-hidden bg-forest">
              <Image
                src={cynthiaPortrait}
                alt="Cynthia Reedy, cosmetologist and glass artist"
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="h-full w-full object-cover object-[50%_25%]"
              />
              {/* Faint reflected light across the glass */}
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(155deg,rgba(255,255,255,0.22)_0%,transparent_32%,transparent_70%,rgba(110,91,208,0.18)_100%)]" />
            </div>
          </div>
          <figcaption className="mt-5 flex items-baseline justify-between gap-4 px-2 text-[14px] text-stone-500">
            <span>
              <span className="font-medium text-ink">Cynthia Reedy</span>, studios in Michigan and California
            </span>
            <Link href="/about" className="link-underline shrink-0 text-[14px]">
              Her story
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
