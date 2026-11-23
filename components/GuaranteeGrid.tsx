import { HeartHandshake, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { guarantee } from '@/lib/data';
import { cn } from '@/lib/utils';

const icons = { leaf: Leaf, shield: ShieldCheck, sparkle: Sparkles, heart: HeartHandshake };

/** Four promises. Not a sequence, so no numbering — an icon and a plain statement each. */
export default function GuaranteeGrid({ dark }: { dark?: boolean }) {
  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {guarantee.map((g) => {
        const Icon = icons[g.icon];
        return (
          <li key={g.title} className="flex flex-col">
            <Icon className={cn('h-6 w-6', dark ? 'text-iris-light' : 'text-sage-dark')} strokeWidth={1.5} />
            <h3 className={cn('mt-5 text-[1.3rem] font-semibold leading-tight tracking-[-0.015em]', dark && 'text-white')}>{g.title}</h3>
            <p className={cn('mt-2 max-w-[32ch] font-serif text-[1.05rem] leading-relaxed', dark ? 'text-white/65' : 'text-stone-700')}>{g.body}</p>
          </li>
        );
      })}
    </ul>
  );
}
