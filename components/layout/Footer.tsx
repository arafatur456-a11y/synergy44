'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { brands } from '@/lib/data';
import { site } from '@/lib/site';

const explore = [
  ['Glass jewelry', '/jewelry'],
  ['Hair styling', '/hair-styling'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="container-x">
        <div className="grid gap-12 border-b border-white/15 py-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow !text-white">The Synergy 44 letter</p>
            <h2 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[3.4rem]">
              New glass, hair rituals &amp; <em className="font-medium text-champagne-light">quiet</em> inspiration.
            </h2>
          </div>
          <form
            className="lg:col-span-5 lg:col-start-8"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: connect to Mailchimp / Klaviyo / WordPress newsletter endpoint
              setJoined(true);
            }}
          >
            <label htmlFor="footer-email" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Occasional notes — never spam
            </label>
            <div className="mt-4 flex h-14 items-center border-b border-white/40 transition-colors focus-within:border-white">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="h-full flex-1 bg-transparent text-[16px] text-white placeholder:text-white/40 focus:outline-none"
              />
              <button type="submit" disabled={joined} className="group flex h-full items-center gap-2 pl-4 text-[12px] font-semibold uppercase tracking-[0.16em]">
                {joined ? (
                  <>
                    <Check className="h-4 w-4 text-champagne-light" /> Welcome
                  </>
                ) : (
                  <>
                    Subscribe <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="max-w-xs text-[15px] leading-relaxed text-white/70">{site.tagline}. Salon visits by appointment in {site.locations.join(' & ')}.</p>
            <Link href="/contact?topic=salon" className="btn-light mt-8">
              Book a visit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-3 lg:col-start-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Hair care</p>
            <ul className="mt-5 grid grid-cols-2 gap-y-3 text-[15px]">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/products/hair-care/${b.slug}`} className="text-white/80 transition-colors hover:text-champagne-light">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Explore</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              {explore.map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-white/80 transition-colors hover:text-champagne-light">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Studios</p>
            <ul className="mt-5 space-y-3 text-[15px] text-white/80">
              {site.locations.map((l) => (
                <li key={l}>{l}</li>
              ))}
              <li className="text-white/50">{site.hours}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="whitespace-nowrap text-center font-display text-[19vw] font-semibold leading-[0.78] tracking-[-0.04em] text-white/[0.06]">
          Synergy <em className="font-medium">44</em>
        </p>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-white/15 py-7 text-[11px] uppercase tracking-[0.16em] text-white/45 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Synergy 44</p>
        <p>Clean beauty · Handmade glass · Healthy hair</p>
      </div>
    </footer>
  );
}
