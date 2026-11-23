'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Lock, Minus, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import ProductGallery from './ProductGallery';
import { useCart, type CartItem } from '@/lib/cart';
import type { Pendant, Product, ProductDetail, ProductVariation } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';
import { productHref } from '@/lib/catalog-utils';

/** Find the variation matching the chosen options ('' in a variation = "any"). */
function matchVariation(variations: ProductVariation[], chosen: Record<string, string>) {
  return variations.find((v) => Object.entries(v.attributes).every(([name, opt]) => opt === '' || chosen[name] === opt));
}

/**
 * Gallery + purchase panel (client): variation choice, live price/stock, quantity, Add to Bag.
 * Rendered as one client island so a chosen variation can swap the gallery image.
 */
export default function ProductPurchase({ detail, brandName, children }: { detail: ProductDetail; brandName: string; children?: React.ReactNode }) {
  const { add } = useCart();
  const item = detail.item;
  const isPendant = detail.kind === 'pendant';
  const variable = detail.variations.length > 0;
  const choiceAttrs = detail.attributes.filter((a) => a.variation);

  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const allChosen = choiceAttrs.every((a) => chosen[a.name]);
  const variation = variable && allChosen ? matchVariation(detail.variations, chosen) : undefined;

  // Options that can still lead to an in-stock variation, given the other choices
  const availableOption = (name: string, option: string) =>
    detail.variations.some(
      (v) =>
        v.inStock &&
        (v.attributes[name] === '' || v.attributes[name] === option) &&
        Object.entries(chosen).every(([n, o]) => n === name || v.attributes[n] === '' || v.attributes[n] === o),
    );

  const price = variation?.price ?? item.price;
  const compareAt = variation ? variation.regularPrice : (item as Product).regularPrice;
  const stockQty = variation ? variation.stockQuantity : (item as Product).stockQuantity ?? null;
  const inStock = variable ? (variation ? variation.inStock : detail.variations.some((v) => v.inStock)) : item.inStock !== false;
  const maxQty = isPendant ? 1 : Math.max(1, Math.min(10, typeof stockQty === 'number' && stockQty > 0 ? stockQty : 10));
  const canAdd = inStock && (!variable || (allChosen && !!variation?.inStock));

  useEffect(() => setQty((q) => Math.min(q, maxQty)), [maxQty]);
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  const stockLine = useMemo(() => {
    if (!inStock) return { text: isPendant ? 'Sold — this piece has found its home' : 'Sold out', tone: 'text-[#A4452F]' };
    if (variable && !allChosen) return { text: `Choose ${choiceAttrs.map((a) => a.name.toLowerCase()).join(' & ')}`, tone: 'text-stone-500' };
    if (variable && variation && !variation.inStock) return { text: 'This option is sold out', tone: 'text-[#A4452F]' };
    if (isPendant) return { text: 'One of a kind, ready to ship', tone: 'text-sage-dark' };
    if (typeof stockQty === 'number' && stockQty > 0 && stockQty <= 5) return { text: `Only ${stockQty} left`, tone: 'text-[#A4452F]' };
    return { text: 'In stock', tone: 'text-sage-dark' };
  }, [inStock, isPendant, variable, allChosen, variation, stockQty, choiceAttrs]);

  const onAdd = () => {
    if (!canAdd) return;
    const optionLabel = variation ? Object.values(chosen).filter(Boolean).join(' / ') : '';
    const subtitle = [isPendant ? `Dichroic glass, ${(item as Pendant).collection}` : brandName, optionLabel || (item as Product).size].filter(Boolean).join(', ');
    const image = variation?.image ?? detail.images[0]?.src;
    const cartItem: Omit<CartItem, 'qty'> = {
      // Pendants use the same id as the quick view so a one-of-a-kind piece can't be added twice
      id: isPendant ? `pendant-${item.id}` : variation ? `${item.id}-v${variation.id}` : item.id,
      href: productHref(item),
      name: item.name,
      subtitle,
      price,
      wcId: item.wcId,
      variationId: variation?.id,
      maxQty: isPendant ? 1 : stockQty,
      unique: isPendant || undefined,
      visual: image
        ? { type: 'image', src: image, alt: item.name }
        : isPendant
          ? { type: 'pendant', shape: (item as Pendant).shape, colors: (item as Pendant).colors }
          : { type: 'product', shape: (item as Product).shape, colors: (item as Product).colors, cap: (item as Product).cap, label: brandName },
    };
    add(cartItem, qty);
    setAdded(true);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <ProductGallery images={detail.images} kind={detail.kind} item={item} brandName={brandName} activeSrc={variation?.image} />
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          {children /* title block from the server page */}

          <div className="mt-6 flex items-baseline gap-3">
            {compareAt && compareAt > price && (
              <span className="text-lg font-medium text-stone-400 line-through">
                <span className="sr-only">Was </span>
                {formatPrice(compareAt)}
              </span>
            )}
            <span className="text-[1.9rem] font-semibold tabular-nums">
              {variable && !variation ? `From ${formatPrice(Math.min(...detail.variations.map((v) => v.price).filter((p) => p > 0)))}` : formatPrice(price)}
            </span>
            {compareAt && compareAt > price && <span className="rounded-full bg-accent px-2.5 py-1 text-[13px] font-semibold text-white">Sale</span>}
          </div>
          <p className={cn('mt-2 text-[13px] font-semibold', stockLine.tone)} aria-live="polite">
            {stockLine.text}
          </p>

          {detail.shortDescriptionHtml && <div className="prose-s44 mt-6 text-[15.5px]" dangerouslySetInnerHTML={{ __html: detail.shortDescriptionHtml }} />}

          {/* Variation choices */}
          {choiceAttrs.map((a) => (
            <fieldset key={a.name} className="mt-8">
              <legend className="text-[13px] font-semibold">
                {a.name}
                {chosen[a.name] && <span className="ml-2 font-medium normal-case tracking-normal text-stone-500">— {chosen[a.name]}</span>}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.options.map((opt) => {
                  const on = chosen[a.name] === opt;
                  const ok = availableOption(a.name, opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setChosen((c) => ({ ...c, [a.name]: on ? '' : opt }))}
                      className={cn('chip', on ? 'chip-on' : 'chip-off', !ok && 'line-through opacity-45')}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {/* Quantity + add */}
          <div className="mt-8 flex gap-3">
            {!isPendant && (
              <div className="flex h-[52px] items-center rounded-[8px] border border-ink/25" role="group" aria-label="Quantity">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1 || !canAdd} aria-label="Decrease quantity" className="grid h-full w-12 place-items-center disabled:opacity-30">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-[15px] font-semibold tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty || !canAdd} aria-label="Increase quantity" className="grid h-full w-12 place-items-center disabled:opacity-30">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <button type="button" onClick={onAdd} disabled={!canAdd} className="btn-dark flex-1">
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to bag
                </>
              ) : !inStock ? (
                isPendant ? 'Sold' : 'Sold out'
              ) : variable && !allChosen ? (
                'Select options'
              ) : (
                <>Add to bag — {formatPrice(price * (isPendant ? 1 : qty))}</>
              )}
            </button>
          </div>

          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-[13.5px] text-stone-700">
            <li className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-sage-dark" strokeWidth={1.6} /> Secure checkout through the Synergy 44 store
            </li>
            {isPendant ? (
              <li className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-iris" strokeWidth={1.6} /> Handmade, kiln-fused dichroic glass by Cynthia Reedy
              </li>
            ) : (
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-sage-dark" strokeWidth={1.6} /> Chosen and recommended by our licensed stylists
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
