/**
 * Catalog access layer — the ONLY place pages get listing data from.
 *
 *   mock (default)  → lib/data.ts
 *   live            → WooCommerce REST API via lib/woocommerce.ts
 *                     (enabled when NEXT_PUBLIC_WC_STORE_URL + WC_CONSUMER_KEY/SECRET are set)
 *   demo            → lib/data.ts, used only when WooCommerce isn't configured
 *                     (local development, previews without keys)
 *
 * Components receive plain `Product` / `Pendant` arrays as props, so swapping the
 * source never requires UI changes.
 *
 * Failure policy: in development a WooCommerce error falls back to mock data so you can
 * keep working. In production it throws — Next.js then keeps serving the last good
 * (ISR-cached) page instead of ever showing placeholder prices to customers.
 */
import { pendants as mockPendants, products as mockProducts } from './data';
import { fetchWooPendants, fetchWooProducts, isWooConfigured } from './woocommerce';
import type { Pendant, Product } from './types';

export const catalogSource = () => (isWooConfigured() ? 'woocommerce' : 'mock');

let warned = false;

async function fromSource<T>(live: () => Promise<T>, mock: T): Promise<T> {
  if (!isWooConfigured()) {
    if (process.env.NODE_ENV === 'production' && !warned) {
      warned = true;
      console.warn('[catalog] WooCommerce is not configured — serving the DEMO catalog from lib/data.ts. Set NEXT_PUBLIC_WC_STORE_URL, WC_CONSUMER_KEY and WC_CONSUMER_SECRET.');
    }
    return mock;
  }
  try {
    return await live();
  } catch (err) {
    if (process.env.NODE_ENV === 'production') throw err;
    console.warn('[catalog] WooCommerce unavailable — using mock data:', err);
    return mock;
  }
}

export const getProducts = (): Promise<Product[]> => fromSource(fetchWooProducts, mockProducts);

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.brand === brandSlug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export const getPendants = (): Promise<Pendant[]> => fromSource(fetchWooPendants, mockPendants);

export { collectionsOf } from './catalog-utils';
