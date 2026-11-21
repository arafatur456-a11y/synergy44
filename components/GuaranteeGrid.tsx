import { HeartHandshake, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { guarantee } from '@/lib/data';
import { cn } from '@/lib/utils';

const icons = { leaf: Leaf, shield: ShieldCheck, sparkle: Sparkles, heart: HeartHandshake };
const numerals = ['i', 'ii', 'iii', 'iv'];

/**
 * Four pillars on hairlines — no boxes.
 * Every cell gets the same horizontal padding at every breakpoint (no first/odd-child
 * overrides, which used to leave the 3rd cell flush against its divider). Dividers sit only
 * between columns, and titles reserve two lines on desktop so the body copy aligns.
 */
export default function GuaranteeGrid({ dark }: { dark?: boolean }) {
  return (
    <ul className={cn('grid border-t sm:grid-cols-2 lg:grid-cols-4', dark ? 'border-white/20' : 'border-ink')}>
      {guarantee.map((g, i) => {
        const Icon = icons[g.icon];
        return (
          <Reveal
            as="li"
            key={g.title}
            delay={i * 0.08}
            className={cn(
              'group flex flex-col border-b py-9 sm:px-8 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:px-8 lg:last:border-r-0 xl:px-10',
              dark ? 'border-white/15' : 'border-line',
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn('font-display text-[2.6rem] font-semibold italic leading-none', dark ? 'text-champagne-light' : 'text-champagne')}>{numerals[i]}.</span>
              <Icon className={cn('h-5 w-5 transition-transform duration-500 ease-silk group-hover:-translate-y-1', dark ? 'text-white/60' : 'text-sage-dark')} strokeWidth={1.4} />
            </div>
            <h3 className={cn('mt-8 font-display text-[1.6rem] font-semibold leading-tight lg:min-h-[2.5em]', dark && 'text-white')}>{g.title}</h3>
            <p className={cn('mt-3 text-[14.5px] leading-relaxed', dark ? 'text-white/65' : 'text-espresso-700')}>{g.body}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}
