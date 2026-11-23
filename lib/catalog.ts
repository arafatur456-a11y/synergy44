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
import { getBrand, pendants as mockPendants, products as mockProducts } from './data';
import { fetchWooPendants, fetchWooProductDetail, fetchWooProducts, isWooConfigured } from './woocommerce';
import type { Pendant, Product, ProductDetail } from './types';

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

/** Featured products first; topped up with other in-stock products so a row is always full. */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured && p.inStock !== false);
  return [...featured, ...rest].slice(0, limit);
}

/**
 * The hero's "Cynthia's pick": Loma Calming Crème when the store carries it
 * (override with HERO_PICK_MATCH, a case-insensitive name pattern), otherwise the first featured product.
 */
export async function getSpotlightProduct(): Promise<Product | undefined> {
  const all = await getProducts();
  let pattern = /calming\s*cr[eè]me/i;
  try {
    if (process.env.HERO_PICK_MATCH) pattern = new RegExp(process.env.HERO_PICK_MATCH, 'i');
  } catch {
    /* invalid pattern: keep the default */
  }
  const matches = all.filter((p) => pattern.test(p.name));
  return matches.find((p) => p.brand === 'loma') ?? matches[0] ?? (await getFeaturedProducts(1))[0];
}

export const getPendants = (): Promise<Pendant[]> => fromSource(fetchWooPendants, mockPendants);

export { collectionsOf } from './catalog-utils';

// ─── Single product ──────────────────────────────────────────────────────────

/** Demo-mode detail built from lib/data.ts (no photos → the page shows the illustration). */
function mockDetail(slug: string): ProductDetail | null {
  const product = mockProducts.find((p) => (p.slug ?? p.id) === slug);
  if (product) {
    const brand = getBrand(product.brand);
    return {
      kind: 'product', item: product, slug, sku: product.sku, label: brand?.name ?? 'Hair care',
      labelHref: brand ? `/products/hair-care/${brand.slug}` : '/products/hair-care', images: [],
      shortDescriptionHtml: `<p>${product.description}</p>`, descriptionHtml: '',
      attributes: product.size ? [{ name: 'Size', options: [product.size], variation: false }] : [], variations: [],
    };
  }
  const pendant = mockPendants.find((p) => (p.slug ?? p.id) === slug);
  if (pendant) {
    return {
      kind: 'pendant', item: pendant, slug, sku: pendant.sku, label: pendant.collection, labelHref: '/jewelry', images: [],
      shortDescriptionHtml: `<p>${pendant.description}</p>`, descriptionHtml: '',
      attributes: pendant.size ? [{ name: 'Size', options: [pendant.size], variation: false }] : [], variations: [],
    };
  }
  return null;
}

export const getProductDetail = (slug: string): Promise<ProductDetail | null> => fromSource(() => fetchWooProductDetail(slug), mockDetail(slug));

/** Same brand first (hair care) or same collection (jewelry), then fill from the rest of the range. */
export async function getRelatedProducts(detail: ProductDetail, limit = 4): Promise<(Product | Pendant)[]> {
  if (detail.kind === 'pendant') {
    const all = (await getPendants()).filter((p) => p.id !== detail.item.id);
    const col = (detail.item as Pendant).collection;
    return [...all.filter((p) => p.collection === col), ...all.filter((p) => p.collection !== col)].slice(0, limit);
  }
  const item = detail.item as Product;
  const all = (await getProducts()).filter((p) => p.id !== item.id && p.inStock !== false);
  const ranked = [
    ...all.filter((p) => p.brand === item.brand && p.category === item.category),
    ...all.filter((p) => p.brand === item.brand && p.category !== item.category),
    ...all.filter((p) => p.brand !== item.brand && p.category === item.category),
  ];
  return Array.from(new Map(ranked.map((p) => [p.id, p])).values()).slice(0, limit);
}

