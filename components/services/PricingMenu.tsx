import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { serviceGroups } from '@/lib/data';

const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/**
 * Luxury salon menu card: double frame (paper card + inset gold rule), monogram header,
 * roman-numeral sections in two columns, dotted price leaders and a booking footer.
 * Content comes from `serviceGroups` in lib/data.ts.
 */
export default function PricingMenu() {
  return (
    <Reveal>
      <article className="relative mx-auto max-w-[1080px] rounded-[6px] bg-paper p-2.5 shadow-lift ring-1 ring-ink/[0.06] sm:p-3.5">
        <div className="relative rounded-[3px] border border-champagne/45 px-5 py-12 sm:px-12 sm:py-16 lg:px-16">
          {/* corner ornaments */}
          {['left-3 top-3', 'right-3 top-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
            <span key={pos} aria-hidden className={`absolute ${pos} text-[10px] leading-none text-champagne`}>
              ✦
            </span>
          ))}

          {/* Header */}
          <header className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-champagne/60 font-display text-lg font-semibold italic text-champagne">
              S44
            </span>
            <p className="mt-6 text-[10.5px] font-semibold uppercase tracking-[0.34em] text-espresso-500">Synergy 44 · Salon</p>
            <h3 className="mt-3 font-display text-[2.4rem] font-semibold leading-none tracking-[-0.01em] sm:text-[3rem]">The Menu</h3>
            <div aria-hidden className="mx-auto mt-6 flex max-w-[220px] items-center gap-3 text-champagne">
              <span className="h-px flex-1 bg-champagne/50" />
              <span className="text-[10px]">✦</span>
              <span className="h-px flex-1 bg-champagne/50" />
            </div>
            <nav aria-label="Menu sections" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {serviceGroups.map((g, i) => (
                <a key={g.id} href={`#svc-${g.id}`} className="group text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso-700 transition-colors hover:text-ink">
                  <span className="mr-1.5 font-display normal-case italic tracking-normal text-champagne">{numerals[i]}.</span>
                  <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-ink">{g.title}</span>
                </a>
              ))}
            </nav>
          </header>

          {/* Sections */}
          <div className="mt-14 grid gap-x-16 gap-y-14 md:grid-cols-2">
            {serviceGroups.map((g, i) => (
              <section key={g.id} id={`svc-${g.id}`} className="scroll-mt-36" aria-labelledby={`svc-${g.id}-title`}>
                <div className="flex items-baseline gap-3 border-b border-ink pb-3">
                  <span className="font-display text-xl font-semibold italic text-champagne">{numerals[i]}.</span>
                  <h4 id={`svc-${g.id}-title`} className="font-display text-[1.65rem] font-semibold leading-tight">
                    {g.title}
                  </h4>
                </div>
                {g.note && <p className="mt-3 font-display text-[15px] italic text-espresso-700">{g.note}</p>}
                <ul>
                  {g.services.map((s) => (
                    <li key={s.name} className="group border-b border-line py-[1.15rem] last:border-b-0">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-[1.18rem] font-semibold leading-snug transition-colors group-hover:text-sage-dark">{s.name}</span>
                        <span aria-hidden className="mb-1 min-w-6 flex-1 border-b border-dotted border-ink/30" />
                        <span className="whitespace-nowrap text-[15px] font-semibold tabular-nums">{s.price}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                        <span className="text-[13.5px] leading-relaxed text-espresso-500">{s.detail}</span>
                        {s.duration && (
                          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-espresso-400">
                            <Clock className="h-3 w-3" /> {s.duration}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-16 flex flex-col items-center gap-8 border-t border-line pt-10 text-center md:flex-row md:justify-between md:text-left">
            <ul className="space-y-1.5 text-[13px] text-espresso-500">
              <li>Prices are starting points and vary with hair length and density.</li>
              <li>Your final price is confirmed at consultation, before we begin.</li>
            </ul>
            <Link href="/contact?topic=salon" className="btn-dark shrink-0">
              Book an appointment <ArrowRight className="h-4 w-4" />
            </Link>
          </footer>
        </div>
      </article>
    </Reveal>
  );
}
