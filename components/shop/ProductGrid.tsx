'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { brands, categories } from '@/lib/data';
import type { Category, Product } from '@/lib/types';
import { CARD_GRID } from './CardParts';
import { cn, ease } from '@/lib/utils';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

function FilterList({
  title,
  items,
  value,
  onChange,
}: {
  title: string;
  items: { value: string; label: string; count: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="border-b border-ink pb-3 text-[13px] font-semibold">{title}</p>
      <ul className="mt-2">
        {items.map((it) => {
          const on = value === it.value;
          return (
            <li key={it.value}>
              <button
                onClick={() => onChange(it.value)}
                aria-pressed={on}
                disabled={it.count === 0}
                className={cn(
                  'group flex w-full items-center justify-between py-2 text-left text-[15px] transition-colors disabled:cursor-default disabled:opacity-35',
                  on ? 'font-semibold text-ink' : 'text-stone-700 hover:text-ink',
                )}
              >
                <span className="flex items-center gap-3">
                  <span className={cn('h-px transition-all duration-500 ease-silk', on ? 'w-4 bg-ink' : 'w-0 bg-ink group-hover:w-2')} />
                  {it.label}
                </span>
                <span className="text-[12px] tabular-nums text-stone-400">{it.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Boutique product grid: sticky sidebar filters (desktop), scrolling chips (mobile),
 * search + sort toolbar. Filters sync to the URL on the main catalogue.
 */
export default function ProductGrid({
  products,
  lockedBrand,
  initialCategory,
  initialBrand,
}: {
  /** Supplied by the page from lib/catalog.ts (mock or WooCommerce) */
  products: Product[];
  lockedBrand?: string;
  initialCategory?: string;
  initialBrand?: string;
}) {
  const validCat = categories.includes(initialCategory as Category) ? (initialCategory as Category) : 'All';
  const validBrand = brands.some((b) => b.slug === initialBrand) ? initialBrand! : 'all';

  const [brand, setBrand] = useState<string>(lockedBrand ?? validBrand);
  const [category, setCategory] = useState<string>(validCat);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('featured');

  const scoped = useMemo(() => (lockedBrand ? products.filter((p) => p.brand === lockedBrand) : products), [lockedBrand, products]);

  useEffect(() => {
    if (lockedBrand) return;
    const params = new URLSearchParams();
    if (brand !== 'all') params.set('brand', brand);
    if (category !== 'All') params.set('category', category);
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [brand, category, lockedBrand]);

  const q = query.trim().toLowerCase();
  const matchQ = (p: Product) => !q || `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(q);

  const results = useMemo(() => {
    const list = scoped.filter((p) => (brand === 'all' || p.brand === brand) && (category === 'All' || p.category === category) && matchQ(p));
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'featured') sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoped, brand, category, q, sort]);

  const brandItems = [
    { value: 'all', label: 'All brands', count: scoped.filter((p) => (category === 'All' || p.category === category) && matchQ(p)).length },
    ...brands.map((b) => ({
      value: b.slug,
      label: b.name,
      count: scoped.filter((p) => p.brand === b.slug && (category === 'All' || p.category === category) && matchQ(p)).length,
    })),
  ];
  const catItems = [
    { value: 'All', label: 'All rituals', count: scoped.filter((p) => (brand === 'all' || p.brand === brand) && matchQ(p)).length },
    ...categories
      .map((c) => ({ value: c, label: c, count: scoped.filter((p) => p.category === c && (brand === 'all' || p.brand === brand) && matchQ(p)).length }))
      .filter((c) => scoped.some((p) => p.category === c.value)),
  ];

  const filtersActive = (!lockedBrand && brand !== 'all') || category !== 'All' || query !== '';
  const clear = () => {
    if (!lockedBrand) setBrand('all');
    setCategory('All');
    setQuery('');
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-32 space-y-10">
          {!lockedBrand && <FilterList title="Brand" items={brandItems} value={brand} onChange={setBrand} />}
          <FilterList title="Ritual" items={catItems} value={category} onChange={setCategory} />
          {filtersActive && (
            <button onClick={clear} className="link-underline">
              Clear all <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </aside>

      <div>
        {/* Mobile chips */}
        <div className="space-y-3 lg:hidden">
          {!lockedBrand && (
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar sm:-mx-8 sm:px-8" role="group" aria-label="Filter by brand">
              {brandItems.map((b) => (
                <button key={b.value} onClick={() => setBrand(b.value)} aria-pressed={brand === b.value} className={cn('chip', brand === b.value ? 'chip-on' : 'chip-off')}>
                  {b.label}
                </button>
              ))}
            </div>
          )}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar sm:-mx-8 sm:px-8" role="group" aria-label="Filter by ritual">
            {catItems.map((c) => (
              <button key={c.value} onClick={() => setCategory(c.value)} aria-pressed={category === c.value} className={cn('chip', category === c.value ? 'chip-on' : 'chip-off')}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-col gap-4 border-y border-ink/15 py-4 sm:flex-row sm:items-center sm:justify-between lg:mt-0">
          <p className="text-[13px] font-semibold" aria-live="polite">
            {results.length} {results.length === 1 ? 'product' : 'products'}
          </p>
          <div className="flex gap-3">
            <label className="relative flex-1 sm:w-60 sm:flex-none">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-full border-b border-transparent bg-transparent pl-7 text-[14px] placeholder:text-stone-400 focus:border-ink focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-[13px] font-semibold">
              <span className="hidden text-stone-500 sm:inline">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 cursor-pointer bg-transparent pr-1 text-[13px] font-semibold focus:outline-none">
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="name">A–Z</option>
              </select>
            </label>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="py-28 text-center">
            <p className="font-display text-4xl font-semibold">Nothing matches — yet.</p>
            <p className="mt-3 text-stone-700">Try another brand or ritual.</p>
            <button onClick={clear} className="btn-outline mt-8">
              Reset filters
            </button>
          </div>
        ) : (
          <motion.ul layout className={`mt-10 ${CARD_GRID} xl:grid-cols-3`}>
            <AnimatePresence mode="popLayout">
              {results.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.8, delay: Math.min(i, 8) * 0.04, ease }}
                >
                  <ProductCard product={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
}
