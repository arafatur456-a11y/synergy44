import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

type Props = {
  /** `light` for mineral/paper sections, `dark` for ink/forest sections */
  tone?: 'light' | 'dark';
  /** `inline`: icon + handle as an underlined link · `pill`: bordered button · `icon`: round icon only */
  variant?: 'inline' | 'pill' | 'icon';
  label?: string;
  className?: string;
};

/** Link to the studio's Instagram. Always opens in a new tab. */
export default function InstagramLink({ tone = 'light', variant = 'inline', label, className }: Props) {
  const text = label ?? `@${site.instagram.handle}`;
  const dark = tone === 'dark';
  return (
    <a
      href={site.instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${text} on Instagram (opens in a new tab)`}
      className={cn(
        'group inline-flex items-center transition-colors duration-300',
        variant === 'icon' && cn('h-11 w-11 justify-center rounded-full border', dark ? 'border-white/25 text-white hover:border-iris-light hover:text-iris-light' : 'border-ink/20 text-ink hover:border-iris hover:text-iris'),
        variant === 'pill' &&
          cn('h-12 gap-3 rounded-[8px] border px-5 text-[13px] font-semibold', dark ? 'border-white/30 text-white hover:border-iris-light hover:text-iris-light' : 'border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white'),
        variant === 'inline' && cn('gap-2.5 text-[14px] font-medium', dark ? 'text-white/80 hover:text-iris-light' : 'text-ink hover:text-iris'),
        className,
      )}
    >
      <InstagramIcon className={cn('shrink-0 transition-transform duration-500 ease-silk group-hover:-rotate-6', variant === 'inline' ? 'h-[18px] w-[18px]' : 'h-[18px] w-[18px]')} />
      {variant !== 'icon' && <span className={cn(variant === 'inline' && 'underline decoration-current/30 underline-offset-[5px] group-hover:decoration-current')}>{text}</span>}
    </a>
  );
}
