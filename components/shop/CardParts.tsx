import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn, formatPrice } from '@/lib/utils';

/**
 * Shared card anatomy for every product and pendant tile:
 *   - media: 4:5 frame. Hair care sits in a 10px-radius rectangle on a pale mineral ground;
 *     glass sits in a cabochon oval on the kiln-dark ground — the shape it's actually cut to.
 *   - badge: small pill, top-left
 *   - action: an always-visible "Add" pill (no hover-only controls, so touch works the same)
 *   - meta: brand, name, detail, price
 */

export const CARD_GRID = 'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14';

export function MediaFrame({
  tone = 'light',
  shape = 'rect',
  background,
  badge,
  action,
  onSelect,
  selectLabel,
  href,
  children,
}: {
  tone?: 'light' | 'dark';
  shape?: 'rect' | 'cabochon';
  background?: string;
  badge?: string;
  action?: ReactNode;
  /** Makes the whole image clickable (e.g. open quick view) */
  onSelect?: () => void;
  selectLabel?: string;
  /** Makes the whole image a link (e.g. to the product page). Takes precedence over onSelect. */
  href?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          'relative aspect-[4/5] overflow-hidden',
          shape === 'cabochon' ? 'cabochon' : 'rounded-media',
          tone === 'light' ? 'bg-mineral-100' : 'bg-kiln ring-1 ring-white/10',
        )}
      >
        <div className="absolute inset-0" style={background ? { background } : undefined}>
          {children}
        </div>
      {href ? (
        <Link href={href} aria-label={selectLabel} className="absolute inset-0 z-[1]" />
      ) : (
        onSelect && <button type="button" onClick={onSelect} aria-label={selectLabel} className="absolute inset-0 z-[1] cursor-pointer" />
      )}
      </div>
      {badge && <CardBadge>{badge}</CardBadge>}
      {action}
    </div>
  );
}

export function CardBadge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute left-3 top-3 z-[2] rounded-full bg-paper/95 px-3 py-1 text-[13px] font-medium text-ink">
      {children}
    </span>
  );
}

export function CardAction({
  onClick,
  href,
  disabled,
  label,
  icon,
  price,
  ariaLabel,
}: {
  onClick?: () => void;
  /** Renders a link instead of a button (e.g. "Choose options" on the store's product page) */
  href?: string;
  disabled?: boolean;
  label: ReactNode;
  icon: ReactNode;
  price?: number;
  ariaLabel: string;
}) {
  const className = cn(
    'absolute bottom-3 right-3 z-[2] flex h-10 items-center gap-1.5 rounded-full bg-paper px-3.5 text-[14px] font-medium text-ink shadow-soft transition-colors hover:bg-ink hover:text-paper active:translate-y-px disabled:cursor-not-allowed disabled:bg-paper/80 disabled:text-stone-400 disabled:hover:bg-paper/80',
  );
  void price;
  const content = (
    <>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={className}>
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
    >
      {content}
    </button>
  );
}

export function CardMeta({
  tone = 'light',
  eyebrow,
  title,
  detail,
  price,
  compareAt,
  href,
}: {
  tone?: 'light' | 'dark';
  eyebrow: string;
  title: string;
  detail?: ReactNode;
  price: number;
  /** Original price, shown struck-through when on sale */
  compareAt?: number;
  href?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div className="mt-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className={cn('text-[13px]', dark ? 'text-iris-light' : 'text-sage-dark')}>{eyebrow}</p>
        <h3 className={cn('mt-0.5 text-[17px] font-medium leading-snug tracking-[-0.01em]', dark ? 'text-white' : 'text-ink')}>
          {href ? (
            <Link href={href} className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {detail && <p className={cn('mt-0.5 text-[14px]', dark ? 'text-white/55' : 'text-stone-500')}>{detail}</p>}
      </div>
      <p className={cn('shrink-0 pt-[1.15rem] text-right text-[16px] font-medium tabular-nums', dark ? 'text-white' : 'text-ink')}>
        {compareAt && compareAt > price && (
          <span className={cn('mr-2 text-[13px] font-medium line-through', dark ? 'text-white/45' : 'text-stone-400')}>
            <span className="sr-only">Was </span>
            {formatPrice(compareAt)}
          </span>
        )}
        {compareAt && compareAt > price && <span className="sr-only">Now </span>}
        {formatPrice(price)}
      </p>
    </div>
  );
}
