import Link from 'next/link';
import BookPackageButton from '@/components/concierge/BookPackageButton';
import { serviceGroups } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';

const highlights = serviceGroups
  .flatMap((g) => g.services.map((s) => ({ ...s, group: g.title })))
  .filter((s) => ['Women’s Haircut', 'Men’s Haircut', 'Full Hi-Lights', 'Glaze', 'Roots'].includes(s.name));

/** Salon preview: a short price list, set like a menu card rather than a feature block. */
export default function ServicesTeaser() {
  return (
    <section className="border-y border-white/[0.06] bg-surface">
      <div className="container-x grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 className="h-section max-w-[12ch] text-balance">Cuts and color in Cynthia’s chair</h2>
          <p className="lead mt-6 !text-[1.15rem]">
            Every appointment starts with a conversation about your hair’s long-term health, then the cut or color you came for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookPackageButton variant="dark" label="Book a haircut" />
            <Link href="/hair-styling" className="btn-outline">
              See the full menu
            </Link>
          </div>
        </div>

        <ul className="stagger self-end lg:col-span-6 lg:col-start-7">
          {highlights.map((s) => (
            <Reveal as="li" key={s.name} className="flex items-baseline gap-4 border-b border-white/[0.08] py-4 first:border-t">
              <span className="text-[1.3rem] font-medium tracking-[-0.015em]">{s.name}</span>
              <span className="hidden text-[14px] text-stone-500 sm:inline">{s.duration}</span>
              <span aria-hidden className="flex-1 translate-y-[-4px] border-b border-dotted border-white/15" />
              <span className="text-[1.1rem] tabular-nums text-ink">{s.price}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
