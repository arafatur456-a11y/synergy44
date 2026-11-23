import { HeartHandshake, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { guarantee } from '@/lib/data';
import { cn } from '@/lib/utils';
import Reveal from '@/components/ui/Reveal';

const icons = { leaf: Leaf, shield: ShieldCheck, sparkle: Sparkles, heart: HeartHandshake };

/** Four promises. Not a sequence, so no numbering — an icon and a plain statement each. */
export default function GuaranteeGrid({ dark }: { dark?: boolean }) {
  return (
    <ul className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {guarantee.map((g) => {
        const Icon = icons[g.icon];
        return (
          <Reveal as="li" key={g.title} className="card card-hover flex flex-col p-6 sm:p-7">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-accent/10 text-iris-light">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <h3 className={cn('mt-6 text-[1.25rem] font-semibold leading-tight tracking-[-0.015em]', dark && 'text-white')}>{g.title}</h3>
            <p className={cn('mt-2 max-w-[32ch] font-serif text-[1.05rem] leading-relaxed', dark ? 'text-white/65' : 'text-stone-700')}>{g.body}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}
