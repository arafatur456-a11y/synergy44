'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { categories, products, type Category } from '@/lib/data/products';
import { brands } from '@/lib/data/brands';
import { cn, ease } from '@/lib/utils';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

/**
 * Filterable product grid. On /products/hair-care brand + category filters are client-side
 * and mirrored to the URL; on brand pages pass `lockedBrand` to scope the catalogue.
 */
export default function ProductGrid({
  lockedBrand,
  initialCategory,
  initialBrand,
}: {
  lockedBrand?: string;
  initialCategory?: string;
  initialBrand?: string;
}) {
  const validCat = categories.includes(initialCategory as Category) ? (initialCategory as Category) : 'All';
  const validBrand = brands.some((b) => b.slug === initialBrand) ? initialBrand! : 'all';

  const [brand, setBrand] = useState<string>(lockedBrand ?? validBrand);
  const [category, setCategory] = useState<Category | 'All'>(validCat);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('featured');

  const scoped = useMemo(() => (lockedBrand ? products.filter((p) => p.brand === lockedBrand) : products), [lockedBrand]);
  const availableCats = useMemo(() => categories.filter((c) => scoped.some((p) => p.category === c)), [scoped]);

  // Keep filters shareable without triggering a navigation
  useEffect(() => {
    if (lockedBrand) return;
    const params = new URLSearchParams();
    if (brand !== 'all') params.set('brand', brand);
    if (category !== 'All') params.set('category', category);
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [brand, category, lockedBrand]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = scoped.filter(
      (p) =>
        (brand === 'all' || p.brand === brand) &&
        (category === 'All' || p.category === category) &&
        (!q || `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'featured') sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return sorted;
  }, [scoped, brand, category, query, sort]);

  const filtersActive = (!lockedBrand && brand !== 'all') || category !== 'All' || query !== '';
  const clear = () => {
    if (!lockedBrand) setBrand('all');
    setCategory('All');
    setQuery('');
  };

  return (
    <div>
      <div className="space-y-5 border-b border-espresso/[0.08] pb-8">
        {!lockedBrand && (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by brand">
            {[{ slug: 'all', name: 'All brands' }, ...brands].map((b) => (
              <button
                key={b.slug}
                onClick={() => setBrand(b.slug)}
                aria-pressed={brand === b.slug}
                className={cn('chip', brand === b.slug ? 'chip-on' : 'chip-off')}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-5 flex gap-1 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0" role="group" aria-label="Filter by category">
            {(['All', ...availableCats] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  'relative whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors',
                  category === c ? 'text-sage-dark' : 'text-espresso-500 hover:text-espresso',
                )}
              >
                {category === c && <motion.span layoutId={`cat-${lockedBrand ?? 'all'}`} className="absolute inset-0 rounded-full bg-sage-pale" transition={{ duration: 0.5, ease }} />}
                <span className="relative">{c === 'All' ? 'All rituals' : c}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <label className="relative flex-1 lg:w-64 lg:flex-none">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="input !rounded-full !py-2.5 pl-10" />
            </label>
            <label>
              <span className="sr-only">Sort products</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="input !w-auto !rounded-full !py-2.5 pr-9">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-6 text-sm text-espresso-500">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? 'product' : 'products'}
        </p>
        {filtersActive && (
          <button onClick={clear} className="inline-flex items-center gap-1 text-espresso hover:text-sage">
            <X className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-espresso/15 py-24 text-center">
          <p className="font-display text-3xl">Nothing matches just yet</p>
          <p className="mt-2 text-espresso-500">Try another brand or ritual.</p>
          <button onClick={clear} className="btn-outline mt-6">
            Reset filters
          </button>
        </div>
      ) : (
        <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, delay: Math.min(i, 8) * 0.04, ease }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
