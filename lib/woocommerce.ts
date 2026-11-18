/**
 * WooCommerce REST API client — SERVER ONLY.
 *
 * Talks to `{NEXT_PUBLIC_WC_STORE_URL}/wp-json/wc/v3/*` with native fetch + HTTP Basic Auth
 * (consumer key/secret). Native fetch is used instead of `@woocommerce/woocommerce-rest-api`
 * so responses participate in Next.js caching (ISR + `revalidateTag('catalog')`).
 *
 * ⚠️  Never import this file from a client component: it reads WC_CONSUMER_SECRET.
 *     Basic Auth requires HTTPS (WooCommerce rejects it over plain HTTP); http:// is only
 *     accepted for localhost during development.
 *
 * Environment (see .env.local.example):
 *   NEXT_PUBLIC_WC_STORE_URL   https://synergy44.com   (public: also used for image hosts)
 *   WC_CONSUMER_KEY            ck_…   Read/Write key (write is needed to create orders)
 *   WC_CONSUMER_SECRET         cs_…
 *   WC_JEWELRY_CATEGORY        product category slug for pendants (default: dichroic-glass-jewelry)
 *
 * Field mapping — adjust the tables below to match how the store is organized:
 *   brand     ← Brands taxonomy (`brands`, WooCommerce 9.6+) → "Brand" attribute → category slug
 *   ritual    ← category slug via CATEGORY_MAP → "Ritual" attribute → 'Treat'
 *   size      ← "Size" attribute · collection ← "Collection" attribute · shape ← "Shape" attribute
 *   image     ← first gallery image · badge ← on_sale → "Sale", featured → "Featured"
 */
import { brands } from './data';
import type { Category, Pendant, PendantShape, Product, ProductShape } from './types';

/** Catalog pages are cached for this long unless a webhook revalidates them sooner. */
export const REVALIDATE_SECONDS = 300;
export const CATALOG_TAG = 'catalog';

// ─── Config ──────────────────────────────────────────────────────────────────

type WooConfig = { url: string; key: string; secret: string };

function readConfig(): WooConfig | null {
  // WC_STORE_URL is accepted for backwards compatibility with earlier setups.
  const url = (process.env.NEXT_PUBLIC_WC_STORE_URL || process.env.WC_STORE_URL || '').replace(/\/+$/, '');
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!url || !key || !secret) return null;

  const parsed = new URL(url);
  const local = ['localhost', '127.0.0.1'].includes(parsed.hostname);
  if (parsed.protocol !== 'https:' && !local) {
    throw new Error('NEXT_PUBLIC_WC_STORE_URL must use https:// — WooCommerce only accepts Basic Auth over HTTPS.');
  }
  return { url, key, secret };
}

export const isWooConfigured = () => readConfig() !== null;

export class WooError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'WooError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  /** `false` = never cache (cart / checkout). Default: ISR-cached + tagged 'catalog'. */
  cache?: false;
};

async function wcRequest<T>(path: string, { method = 'GET', query, body, cache }: RequestOptions = {}): Promise<{ data: T; totalPages: number }> {
  const cfg = readConfig();
  if (!cfg) throw new WooError('WooCommerce is not configured', 500, 'not_configured');

  const url = new URL(`${cfg.url}/wp-json/wc/v3/${path.replace(/^\//, '')}`);
  Object.entries(query ?? {}).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, String(v)));

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${cfg.key}:${cfg.secret}`).toString('base64')}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
    ...(cache === false || method !== 'GET' ? { cache: 'no-store' as const } : { next: { revalidate: REVALIDATE_SECONDS, tags: [CATALOG_TAG] } }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    // WooCommerce errors look like { code, message, data: { status } }
    const err = json as { code?: string; message?: string } | null;
    throw new WooError(err?.message ?? `WooCommerce request failed (${res.status})`, res.status, err?.code);
  }
  return { data: json as T, totalPages: Number(res.headers.get('x-wp-totalpages') ?? 1) };
}

/** Follows WooCommerce pagination (100 per page, capped at 20 pages = 2,000 products). */
async function wcGetAll<T>(path: string, query: RequestOptions['query'] = {}, cache?: false): Promise<T[]> {
  const first = await wcRequest<T[]>(path, { query: { per_page: 100, page: 1, ...query }, cache });
  const pages = Math.min(first.totalPages, 20);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => wcRequest<T[]>(path, { query: { per_page: 100, page: i + 2, ...query }, cache })),
  );
  return [first.data, ...rest.map((r) => r.data)].flat();
}

// ─── WooCommerce shapes (subset we use) ──────────────────────────────────────

type WCTerm = { id: number; name: string; slug: string };
type WCAttribute = { name: string; options: string[] };
export type WCProduct = {
  id: number;
  slug: string;
  name: string;
  type: Product['type'];
  status: string;
  permalink: string;
  price: string;
  regular_price: string;
  on_sale: boolean;
  purchasable: boolean;
  featured: boolean;
  short_description: string;
  description: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  images: { src: string; alt: string }[];
  categories: WCTerm[];
  attributes: WCAttribute[];
  brands?: WCTerm[];
};

/** Only request the fields we map — keeps responses small and fast. */
const PRODUCT_FIELDS =
  'id,slug,name,type,status,permalink,price,regular_price,on_sale,purchasable,featured,short_description,description,stock_status,stock_quantity,images,categories,attributes,brands';

// ─── Mapping ─────────────────────────────────────────────────────────────────

/** WooCommerce category slug → site ritual. Extend to match the store's categories. */
const CATEGORY_MAP: Record<string, Category> = {
  shampoo: 'Cleanse',
  shampoos: 'Cleanse',
  cleanse: 'Cleanse',
  conditioner: 'Condition',
  conditioners: 'Condition',
  'leave-in': 'Condition',
  treatment: 'Treat',
  treatments: 'Treat',
  oil: 'Treat',
  oils: 'Treat',
  mask: 'Treat',
  masks: 'Treat',
  styling: 'Style',
  style: 'Style',
  tools: 'Tools',
  'hair-tools': 'Tools',
  beauty: 'Beauty',
  'makeup-removal': 'Beauty',
};

/** Fallback packshot per ritual, used only when a product has no photo. */
const SHAPE_BY_CATEGORY: Record<Category, ProductShape> = {
  Cleanse: 'pump',
  Condition: 'pump',
  Treat: 'dropper',
  Style: 'spray',
  Tools: 'iron',
  Beauty: 'pouch',
};

const PENDANT_PALETTES: Pendant['colors'][] = [
  ['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6'],
  ['#E3955A', '#E8C468', '#B85A6A', '#EBA977'],
  ['#9C82D8', '#D88AB5', '#6E8FD8', '#B99BDE'],
  ['#4FAE8C', '#5BA3CF', '#58B4A7', '#7C83D1'],
];

const jewelryCategory = () => process.env.WC_JEWELRY_CATEGORY || 'dichroic-glass-jewelry';

export const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'");

const stripHtml = (html: string) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const attr = (p: WCProduct, name: string) => p.attributes.find((a) => a.name.toLowerCase() === name.toLowerCase())?.options[0];
const money = (v: string) => (v === '' ? 0 : Number(v));

function mapBrand(p: WCProduct): string | undefined {
  const known = new Set(brands.map((b) => b.slug));
  const fromTaxonomy = p.brands?.find((b) => known.has(b.slug))?.slug;
  if (fromTaxonomy) return fromTaxonomy;
  const fromAttr = attr(p, 'Brand');
  if (fromAttr) return brands.find((b) => b.name.toLowerCase() === fromAttr.toLowerCase())?.slug;
  return p.categories.find((c) => known.has(c.slug))?.slug;
}

function mapCategory(p: WCProduct): Category {
  for (const c of p.categories) if (CATEGORY_MAP[c.slug]) return CATEGORY_MAP[c.slug];
  return (attr(p, 'Ritual') as Category | undefined) ?? 'Treat';
}

const isJewelry = (p: WCProduct) => p.categories.some((c) => c.slug === jewelryCategory());

export function mapProduct(p: WCProduct): Product | null {
  const brand = mapBrand(p);
  if (!brand || isJewelry(p)) return null; // only list products that belong to a site brand
  const category = mapCategory(p);
  const tint = brands.find((b) => b.slug === brand)?.tint ?? '#EEE8DE';
  const price = money(p.price);
  const regular = money(p.regular_price);
  return {
    id: `wc-${p.id}`,
    wcId: p.id,
    type: p.type,
    brand,
    name: decode(p.name),
    category,
    price,
    regularPrice: p.on_sale && regular > price ? regular : undefined,
    size: attr(p, 'Size') ?? '',
    description: truncate(stripHtml(p.short_description || p.description), 160),
    image: p.images[0]?.src,
    shape: SHAPE_BY_CATEGORY[category],
    colors: ['#FFFFFF', tint],
    cap: '#F4F1EB',
    badge: p.stock_status === 'outofstock' ? 'Sold out' : p.on_sale ? 'Sale' : p.featured ? 'Featured' : undefined,
    featured: p.featured,
    permalink: p.permalink,
    inStock: p.stock_status !== 'outofstock' && p.purchasable,
    stockQuantity: p.stock_quantity,
  };
}

export function mapPendant(p: WCProduct, index: number): Pendant {
  const shapes: PendantShape[] = ['oval', 'teardrop', 'square', 'cabochon'];
  const shapeAttr = attr(p, 'Shape')?.toLowerCase() as PendantShape | undefined;
  return {
    id: `wc-${p.id}`,
    wcId: p.id,
    name: decode(p.name),
    collection: attr(p, 'Collection') ?? 'Dichroic glass',
    image: p.images[0]?.src,
    colors: PENDANT_PALETTES[index % PENDANT_PALETTES.length],
    shape: shapeAttr && shapes.includes(shapeAttr) ? shapeAttr : shapes[index % shapes.length],
    size: attr(p, 'Size') ?? '',
    price: money(p.price),
    description: truncate(stripHtml(p.short_description || p.description), 220),
    permalink: p.permalink,
    inStock: p.stock_status !== 'outofstock' && p.purchasable,
  };
}

// ─── Catalog reads (cached, tagged 'catalog') ────────────────────────────────

export async function fetchWooProducts(): Promise<Product[]> {
  const items = await wcGetAll<WCProduct>('products', { status: 'publish', _fields: PRODUCT_FIELDS });
  return items.map(mapProduct).filter((p): p is Product => p !== null);
}

export async function fetchWooPendants(): Promise<Pendant[]> {
  const { data: terms } = await wcRequest<WCTerm[]>('products/categories', { query: { slug: jewelryCategory(), _fields: 'id,slug' } });
  if (!terms[0]) return [];
  const items = await wcGetAll<WCProduct>('products', { status: 'publish', category: terms[0].id, _fields: PRODUCT_FIELDS });
  // Sold pieces are one-of-a-kind and won't come back — hide them from the gallery.
  return items.filter((p) => p.stock_status !== 'outofstock').map(mapPendant);
}

// ─── Checkout (never cached) ─────────────────────────────────────────────────

/** Fresh product data for checkout validation — bypasses every cache. */
export async function fetchWooProductsByIds(ids: number[]): Promise<WCProduct[]> {
  if (ids.length === 0) return [];
  return wcGetAll<WCProduct>('products', { include: ids.join(','), _fields: PRODUCT_FIELDS }, false);
}

export type WooAddress = {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

export type WooOrderInput = {
  billing: WooAddress & { email: string };
  shipping: WooAddress;
  line_items: { product_id: number; quantity: number }[];
  shipping_lines?: { method_id: string; method_title: string; total: string }[];
  customer_note?: string;
};

export type WooOrder = {
  id: number;
  number: string;
  order_key: string;
  status: string;
  currency: string;
  total: string;
  payment_url: string;
};

/**
 * Creates a *pending* (unpaid) order. WooCommerce prices every line itself from the
 * product IDs — client-side prices are never sent — and returns `payment_url`, the store's
 * own "Pay for order" page where its configured gateways (Stripe, PayPal, …) take payment.
 */
export async function createWooOrder(input: WooOrderInput): Promise<WooOrder> {
  const { data } = await wcRequest<WooOrder>('orders', {
    method: 'POST',
    body: {
      status: 'pending',
      set_paid: false,
      created_via: 'synergy44-headless',
      meta_data: [{ key: '_synergy44_source', value: 'headless-storefront' }],
      ...input,
    },
  });
  return data;
}
