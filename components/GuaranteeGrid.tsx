import { HeartHandshake, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { guarantee } from '@/lib/data/content';

const icons = { leaf: Leaf, shield: ShieldCheck, sparkle: Sparkles, heart: HeartHandshake };

export default function GuaranteeGrid() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[28px] bg-espresso/[0.08] ring-1 ring-espresso/[0.08] sm:grid-cols-2 lg:grid-cols-4">
      {guarantee.map((g, i) => {
        const Icon = icons[g.icon];
        return (
          <Reveal as="li" key={g.title} delay={i * 0.08} className="bg-cream p-8">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-pale text-sage-dark">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h3 className="mt-6 font-display text-2xl">{g.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-espresso-500">{g.body}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}
