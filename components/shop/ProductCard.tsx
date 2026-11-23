'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Ban, Check, Plus } from 'lucide-react';
import ProductVisual from './ProductVisual';
import { CardAction, CardMeta, MediaFrame } from './CardParts';
import { getBrand } from '@/lib/data';
import { productHref } from '@/lib/catalog-utils';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';

export default function ProductCard({ product }: { product: Product }) {
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
      href: productHref(product),
      name: product.name,
      subtitle: [brandName, product.size].filter(Boolean).join(', '),
      price: product.price,
      wcId: product.wcId,
      maxQty: product.stockQuantity,
      visual: product.image
        ? { type: 'image', src: product.image, alt: product.name }
        : { type: 'product', shape: product.shape, colors: product.colors, cap: product.cap, label: brandName },
    });
    setAdded(true);
  };

  const href = productHref(product);

  return (
    <article className="group relative">
      <MediaFrame
        href={href}
        selectLabel={`View ${brandName} ${product.name}`}
        badge={product.badge}
        background={product.image ? undefined : `radial-gradient(75% 60% at 50% 42%, ${brand?.tint ?? '#94A3B8'}40 0%, #1B2332 62%, #141A24 100%)`}
        action={
          product.inStock === false ? (
            <CardAction disabled ariaLabel={`${product.name} is sold out`} label="Sold out" icon={<Ban className="h-3.5 w-3.5" />} />
          ) : product.type === 'variable' ? (
            <CardAction href={href} ariaLabel={`Choose options for ${product.name}`} label="Options" icon={<ArrowUpRight className="h-3.5 w-3.5" />} price={product.price} />
          ) : (
          <CardAction
            onClick={onAdd}
            ariaLabel={`Quick add ${brandName} ${product.name}`}
            label={
              added ? (
                'Added'
              ) : (
                'Add'
              )
            }
            icon={added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            price={product.price}
          />
          )
        }
      >
        {product.image ? (
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
        ) : (
          <>
            <div className="absolute inset-x-[18%] bottom-[14%] h-[10%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.45),transparent)]" />
            <div className="absolute inset-0 flex items-center justify-center pb-[6%]">
              <ProductVisual shape={product.shape} colors={product.colors} cap={product.cap} label={brandName} className="h-[70%]" />
            </div>
          </>
        )}
      </MediaFrame>
      <CardMeta
        href={href}
        eyebrow={brandName}
        title={product.name}
        price={product.price}
        compareAt={product.regularPrice}
        detail={
          <>
            {product.size}
          </>
        }
      />
    </article>
  );
}
