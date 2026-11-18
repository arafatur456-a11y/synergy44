import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import BotanicalSprig from '@/components/ui/BotanicalSprig';
import { serviceGroups } from '@/lib/data/content';

const highlights = serviceGroups.flatMap((g) => g.services).filter((s) =>
  ['Women’s Haircut', 'Men’s Haircut', 'Full Hi-Lights', 'Glaze', 'Roots'].includes(s.name),
);

export default function ServicesTeaser() {
  return (
    <section className="container-x grid items-center gap-16 py-20 lg:grid-cols-2 lg:gap-24">
      <Parallax speed={30} className="order-2 lg:order-1">
        <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-t-full bg-gradient-to-b from-champagne-pale to-sage-mist shadow-float">
          <BotanicalSprig className="absolute bottom-0 left-1/2 h-[80%] -translate-x-1/2 text-sage/40" leaves={6} />
          <div className="absolute inset-x-8 bottom-8 rounded-3xl bg-cream/85 p-6 backdrop-blur-md">
            <p className="font-display text-2xl italic leading-snug">Healthy hair is the most beautiful style there is.</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-espresso-500">The Synergy 44 philosophy</p>
          </div>
        </div>
      </Parallax>

      <Reveal className="order-1 lg:order-2">
        <p className="eyebrow">The salon</p>
        <h2 className="h-section mt-4">
          Hair styling, <em className="text-iridescent">with healing hands.</em>
        </h2>
        <p className="lead mt-5 max-w-lg">
          Precision cuts, dimensional hi-lights and gentle color — every service begins with a conversation about the health of your
          hair.
        </p>

        <ul className="mt-10 divide-y divide-espresso/[0.08] border-y border-espresso/[0.08]">
          {highlights.map((s) => (
            <li key={s.name} className="flex items-baseline gap-4 py-4">
              <span className="font-display text-xl">{s.name}</span>
              <span aria-hidden className="flex-1 border-b border-dotted border-espresso/25" />
              <span className="text-sm font-semibold">{s.price}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/hair-styling" className="btn-dark">
            See full menu
          </Link>
          <Link href="/contact?topic=salon" className="btn-outline">
            Book a consultation
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
