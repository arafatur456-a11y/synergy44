import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { productHref } from '@/lib/catalog-utils';
import { cn } from '@/lib/utils';

export type HeroItem = { id: string; slug?: string; name: string; image?: string; label?: string; inStock?: boolean; featured?: boolean };

/**
 * Picks up to `max` products with real photos for a collection hero:
 * in-stock and featured first, one tile per unique image.
 */
export function pickHeroItems<T extends HeroItem>(items: T[], max = 3): T[] {
  const withImages = items.filter((i) => i.image);
  const ranked = [
    ...withImages.filter((i) => i.inStock !== false && i.featured),
    ...withImages.filter((i) => i.inStock !== false && !i.featured),
    ...withImages.filter((i) => i.inStock === false),
  ];
  const seen = new Set<string>();
  return ranked.filter((i) => (seen.has(i.image!) ? false : (seen.add(i.image!), true))).slice(0, max);
}

function Tile({ item, className, sizes, priority, tone }: { item: HeroItem; className?: string; sizes: string; priority?: boolean; tone: 'light' | 'dark' }) {
  return (
    <Link
      href={productHref(item)}
      className={cn(
        'group relative block overflow-hidden rounded-media ring-1',
        tone === 'light' ? 'bg-paper shadow-soft ring-ink/[0.06]' : 'bg-[#15121A] ring-white/10',
        className,
      )}
    >
      <Image
        src={item.image!}
        alt={item.name}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.04]"
      />
      {/* Soft bottom gradient keeps the caption legible on any photo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
        <div className="min-w-0">
          {item.label && <p className="text-[13px] font-semibold text-white/75">{item.label}</p>}
          <p className="mt-1 line-clamp-2 font-display text-[1.05rem] font-semibold leading-snug sm:text-[1.2rem]">{item.name}</p>
        </div>
        <span className="hidden shrink-0 text-[13px] font-semibold text-white/80 transition-colors group-hover:text-white sm:inline">View</span>
      </div>
    </Link>
  );
}

/**
 * Editorial mosaic of real product photography for collection / brand page heroes.
 *   3 items one tall feature tile + two stacked tiles · 2 pair · 1 single frame
 * Falls back to `fallback` (the illustrated StudioScene) when the collection has no photos.
 */
export default function CollectionHero({ items, tone = 'light', fallback }: { items: HeroItem[]; tone?: 'light' | 'dark'; fallback: ReactNode }) {
  if (items.length === 0) return <>{fallback}</>;

  return (
    <div className={cn('relative h-full w-full p-3 sm:p-5 lg:p-6', tone === 'light' ? 'bg-mineral-100' : 'bg-[#0D0C10]')}>
      {/* warm wash behind the tiles */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          tone === 'light'
            ? 'bg-[radial-gradient(80%_60%_at_70%_20%,rgba(241,230,207,0.9),transparent)]'
            : 'bg-[radial-gradient(80%_60%_at_60%_20%,rgba(91,74,122,0.35),transparent)]',
        )}
      />
      <div
        className={cn(
          'relative grid h-full min-h-[360px] gap-3 sm:min-h-[440px] sm:gap-4',
          items.length >= 3 ? 'grid-cols-5 grid-rows-2' : items.length === 2 ? 'grid-cols-2' : 'grid-cols-1',
        )}
      >
        {items.length >= 3 ? (
          <>
            <Tile tone={tone} item={items[0]} priority className="col-span-3 row-span-2" sizes="(min-width: 1024px) 28vw, 60vw" />
            <Tile tone={tone} item={items[1]} className="col-span-2" sizes="(min-width: 1024px) 19vw, 40vw" />
            <Tile tone={tone} item={items[2]} className="col-span-2" sizes="(min-width: 1024px) 19vw, 40vw" />
          </>
        ) : (
          items.map((it, i) => <Tile key={it.id} tone={tone} item={it} priority={i === 0} sizes={items.length === 2 ? '(min-width: 1024px) 23vw, 50vw' : '(min-width: 1024px) 46vw, 100vw'} />)
        )}
      </div>
    </div>
  );
}
