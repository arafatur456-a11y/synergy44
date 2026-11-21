import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn, formatPrice } from '@/lib/utils';

/**
 * Shared card anatomy for every product and pendant tile, so grids stay immaculate:
 *   • media: 4:5 ratio · 4px radius · hairline ring · soft → lifted shadow · 1.4s zoom on hover
 *   • badge: paper chip, top-left
 *   • action: slide-up bar on desktop hover, round button on touch
 *   • meta: eyebrow / serif title / detail line / price
 */

export const CARD_GRID = 'grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-5';

export function MediaFrame({
  tone = 'light',
  background,
  badge,
  action,
  onSelect,
  selectLabel,
  href,
  children,
}: {
  tone?: 'light' | 'dark';
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
    <div
      className={cn(
        'relative aspect-[4/5] overflow-hidden rounded-[4px] transition-shadow duration-700 ease-silk',
        tone === 'light' ? 'bg-[#ECE6DC] shadow-soft ring-1 ring-ink/[0.06] group-hover:shadow-lift' : 'bg-[#0F0D12] ring-1 ring-white/10 group-hover:ring-white/25',
      )}
    >
      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.06]" style={background ? { background } : undefined}>
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100',
          tone === 'light' ? 'bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,.55),transparent)]' : 'bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,.12),transparent)]',
        )}
      />
      {href ? (
        <Link href={href} aria-label={selectLabel} className="absolute inset-0 z-[1]" />
      ) : (
        onSelect && <button type="button" onClick={onSelect} aria-label={selectLabel} className="absolute inset-0 z-[1] cursor-pointer" />
      )}
      {badge && <CardBadge>{badge}</CardBadge>}
      {action}
    </div>
  );
}

export function CardBadge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute left-3 top-3 z-[2] rounded-[2px] bg-paper px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink shadow-soft">
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
    'absolute bottom-3 right-3 z-[2] grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-lift transition-transform duration-300 active:scale-95 disabled:cursor-not-allowed disabled:bg-espresso-400',
    'md:left-3 md:flex md:h-12 md:w-auto md:items-center md:justify-between md:rounded-[2px] md:bg-ink/95 md:px-5 md:disabled:bg-espresso-500/90',
    'md:translate-y-[calc(100%+16px)] md:duration-500 md:ease-silk md:group-hover:translate-y-0 md:focus-visible:translate-y-0',
  );
  const content = (
    <>
      <span className="flex items-center gap-2">
        <span className="md:hidden">{icon}</span>
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] md:inline">{label}</span>
      </span>
      {price !== undefined && <span className="hidden text-[12px] font-semibold tabular-nums md:inline">{formatPrice(price)}</span>}
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
        <p className={cn('text-[10px] font-semibold uppercase tracking-[0.2em]', dark ? 'text-champagne-light' : 'text-espresso-500')}>{eyebrow}</p>
        <h3 className={cn('mt-1 font-display text-[1.1rem] font-semibold leading-snug sm:text-[1.2rem]', dark ? 'text-white' : 'text-ink')}>
          {href ? (
            <Link href={href} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-silk hover:bg-[length:100%_1px]">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {detail && <p className={cn('mt-1 text-[12.5px]', dark ? 'text-white/55' : 'text-espresso-500')}>{detail}</p>}
      </div>
      <p className={cn('shrink-0 pt-4 text-right text-[15px] font-semibold tabular-nums', dark ? 'text-white' : 'text-ink')}>
        {compareAt && compareAt > price && (
          <span className={cn('mr-2 text-[13px] font-medium line-through', dark ? 'text-white/45' : 'text-espresso-400')}>
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
