'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import ProductVisual from './ProductVisual';
import type { Product } from '@/lib/data/products';
import { getBrand } from '@/lib/data/brands';
import { useCart } from '@/lib/cart';
import { cn, formatPrice } from '@/lib/utils';

export default function ProductCard({ product, size = 'md' }: { product: Product; size?: 'md' | 'lg' }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const brand = getBrand(product.brand);
  const brandName = brand?.name ?? product.brand;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const onAdd = () => {
    add({
      id: product.id,
      name: product.name,
      subtitle: `${brandName} · ${product.size}`,
      price: product.price,
      visual: { type: 'product', shape: product.shape, colors: product.colors, cap: product.cap, label: brandName },
    });
    setAdded(true);
  };

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-[#ECE6DC]">
        {/* Zoom layer */}
        <div className="absolute inset-0 transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.07]">
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(90% 70% at 50% 38%, #FFFFFF 0%, ${brand?.tint ?? '#EEE8DE'} 55%, #DCD3C6 100%)` }}
          />
          <div className="absolute inset-x-[18%] bottom-[14%] h-[10%] rounded-[50%] bg-ink/15 blur-xl" />
          <div className="absolute inset-0 flex items-center justify-center pb-[6%]">
            <ProductVisual shape={product.shape} colors={product.colors} cap={product.cap} label={brandName} className={cn(size === 'lg' ? 'h-[74%]' : 'h-[70%]')} />
          </div>
        </div>
        {/* Hover light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,.55),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-[2px] bg-paper px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink shadow-soft">
            {product.badge}
          </span>
        )}

        {/* Quick add — bar on desktop hover, round button on touch */}
        <button
          onClick={onAdd}
          aria-label={`Quick add ${brandName} ${product.name}`}
          className={cn(
            'absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-lift transition-transform duration-300 active:scale-95',
            'md:inset-x-3 md:right-3 md:flex md:h-12 md:w-auto md:items-center md:justify-between md:rounded-[2px] md:bg-ink/90 md:px-5 md:backdrop-blur-md',
            'md:translate-y-[calc(100%+16px)] md:group-hover:translate-y-0 md:focus-visible:translate-y-0 md:duration-500 md:ease-silk',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] md:inline">Added to bag</span>
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                <Plus className="h-4 w-4 md:hidden" />
                <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] md:inline">Quick add</span>
              </motion.span>
            )}
          </AnimatePresence>
          <span className="hidden text-[12px] font-semibold tabular-nums md:inline">{formatPrice(product.price)}</span>
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-espresso-500">{brandName}</p>
          <h3 className={cn('mt-1 font-display font-semibold leading-snug text-ink', size === 'lg' ? 'text-[1.35rem]' : 'text-[1.1rem] sm:text-[1.2rem]')}>{product.name}</h3>
          <p className="mt-1 text-[12.5px] text-espresso-500">
            {product.size}
            <span className="hidden sm:inline"> · {product.category}</span>
          </p>
        </div>
        <p className="shrink-0 pt-4 text-[15px] font-semibold tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
