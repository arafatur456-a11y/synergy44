'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { brands } from '@/lib/data/brands';
import BotanicalSprig from '@/components/ui/BotanicalSprig';
import { site } from '@/lib/site';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <footer className="relative mt-32 overflow-hidden bg-espresso text-cream/80">
      <BotanicalSprig className="absolute -left-10 bottom-0 h-[420px] text-cream/[0.07]" leaves={8} />

      <div className="container-x relative">
        <div className="grid gap-12 border-b border-cream/10 py-20 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-champagne-light">The Synergy 44 letter</p>
            <h2 className="mt-4 font-display text-4xl font-light leading-tight text-cream sm:text-5xl">
              Hair rituals, new glass &amp; <em>quiet</em> inspiration.
            </h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: connect to Mailchimp / Klaviyo / WordPress newsletter endpoint
              setJoined(true);
            }}
          >
            <label htmlFor="footer-email" className="text-sm text-cream/60">
              Occasional notes — never spam.
            </label>
            <div className="mt-3 flex border-b border-cream/30 focus-within:border-champagne-light">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent py-4 text-cream placeholder:text-cream/40 focus:outline-none"
              />
              <button type="submit" className="inline-flex items-center gap-2 text-sm font-semibold text-cream transition hover:text-champagne-light" disabled={joined}>
                {joined ? 'Welcome ✦' : 'Subscribe'} {!joined && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-3xl text-cream">
              Synergy <em className="text-champagne-light">44</em>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">{site.tagline}.</p>
            <p className="mt-6 flex items-center gap-2 text-sm text-cream/70">
              <MapPin className="h-4 w-4 text-champagne-light" /> {site.locations.join(' · ')}
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cream">Hair care brands</p>
            <ul className="mt-5 grid grid-cols-2 gap-y-2.5 text-sm">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/products/hair-care/${b.slug}`} className="text-cream/60 transition hover:text-cream">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cream">Explore</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                ['Glass jewelry', '/jewelry'],
                ['Hair styling', '/hair-styling'],
                ['About', '/about'],
                ['Contact', '/contact'],
              ].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-cream/60 transition hover:text-cream">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cream">Visit</p>
            <p className="mt-5 text-sm leading-relaxed text-cream/60">{site.hours}. Book online and we’ll confirm your time personally.</p>
            <Link href="/contact?topic=salon" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-champagne-light hover:text-cream">
              Book a consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-cream/10 py-8 text-xs text-cream/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Synergy 44. All rights reserved.</p>
          <p>Clean beauty · Handmade glass · Healthy hair</p>
        </div>
      </div>
    </footer>
  );
}
