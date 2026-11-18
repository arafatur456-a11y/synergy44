/**
 * WooCommerce REST API adapter (server-only).
 *
 * Reads products from `GET {WC_STORE_URL}/wp-json/wc/v3/products` with a read-only
 * REST key and maps them onto the site's `Product` / `Pendant` types.
 * Never import this from a client component — it uses secret credentials.
 *
 * Environment variables:
 *   WC_STORE_URL          e.g. https://synergy44.com
 *   WC_CONSUMER_KEY       ck_…  (WooCommerce → Settings → Advanced → REST API, Read access)
 *   WC_CONSUMER_SECRET    cs_…
 *   WC_JEWELRY_CATEGORY   category slug that holds pendants (default: dichroic-glass-jewelry)
 *
 * Mapping (adjust the tables below to match how the store is organized):
 *   brand     ← WooCommerce Brands taxonomy (`brands`, WC 9.6+) → a "Brand" attribute
 *               → any product category whose slug matches a brand in lib/data.ts
 *   category  ← product category slug via CATEGORY_MAP → a "Ritual" attribute → 'Treat'
 *   size      ← "Size" attribute (first option)
 *   image     ← first product image
 *   badge     ← "featured" flag → "Featured", on_sale → "Sale"
 *   pendant collection ← "Collection" attribute; shape ← "Shape" attribute
 */
import { brands } from './data';
import type { Category, Pendant, PendantShape, Product, ProductShape } from './types';

export const REVALIDATE_SECONDS = 3600;

type WCTerm = { id: number; name: string; slug: string };
type WCAttribute = { name: string; options: string[] };
type WCProduct = {
  id: number;
  slug: string;
  name: string;
  permalink: string;
  price: string;
  short_description: string;
  description: string;
  featured: boolean;
  on_sale: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  images: { src: string; alt: string }[];
  categories: WCTerm[];
  attributes: WCAttribute[];
  brands?: WCTerm[];
};

/** WooCommerce category slug → site ritual. Extend to match the store's categories. */
const CATEGORY_MAP: Record<string, Category> = {
  shampoo: 'Cleanse',
  cleanse: 'Cleanse',
  conditioner: 'Condition',
  'leave-in': 'Condition',
  treatment: 'Treat',
  treatments: 'Treat',
  oil: 'Treat',
  mask: 'Treat',
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

export function isWooConfigured() {
  return Boolean(process.env.WC_STORE_URL && process.env.WC_CONSUMER_KEY && process.env.WC_CONSUMER_SECRET);
}

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, '’')
    .replace(/\s+/g, ' ')
    .trim();

const attr = (p: WCProduct, name: string) => p.attributes.find((a) => a.name.toLowerCase() === name.toLowerCase())?.options[0];

async function wcFetchAll(params: Record<string, string> = {}): Promise<WCProduct[]> {
  const base = process.env.WC_STORE_URL!.replace(/\/$/, '');
  const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
  const all: WCProduct[] = [];

  for (let page = 1; page <= 10; page++) {
    const url = new URL(`${base}/wp-json/wc/v3/products`);
    Object.entries({ status: 'publish', per_page: '100', page: String(page), ...params }).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
      next: { revalidate: REVALIDATE_SECONDS, tags: ['catalog'] },
    });
    if (!res.ok) throw new Error(`WooCommerce responded ${res.status} for ${url.pathname}`);

    const batch = (await res.json()) as WCProduct[];
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

async function categoryId(slug: string): Promise<number | undefined> {
  const base = process.env.WC_STORE_URL!.replace(/\/$/, '');
  const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
  const url = new URL(`${base}/wp-json/wc/v3/products/categories`);
  url.searchParams.set('slug', slug);
  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` }, next: { revalidate: REVALIDATE_SECONDS, tags: ['catalog'] } });
  if (!res.ok) throw new Error(`WooCommerce responded ${res.status} for categories`);
  const terms = (await res.json()) as WCTerm[];
  return terms[0]?.id;
}

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
  const ritual = attr(p, 'Ritual') as Category | undefined;
  return ritual ?? 'Treat';
}

export async function fetchWooProducts(): Promise<Product[]> {
  const jewelrySlug = process.env.WC_JEWELRY_CATEGORY ?? 'dichroic-glass-jewelry';
  const items = await wcFetchAll();

  return items
    .filter((p) => !p.categories.some((c) => c.slug === jewelrySlug))
    .map((p): Product | null => {
      const brand = mapBrand(p);
      if (!brand) return null; // skip products that don't belong to a listed brand
      const category = mapCategory(p);
      const tint = brands.find((b) => b.slug === brand)?.tint ?? '#EEE8DE';
      return {
        id: `wc-${p.id}`,
        brand,
        name: p.name,
        category,
        price: Number(p.price) || 0,
        size: attr(p, 'Size') ?? '',
        description: stripHtml(p.short_description || p.description).slice(0, 160),
        image: p.images[0]?.src,
        shape: SHAPE_BY_CATEGORY[category],
        colors: ['#FFFFFF', tint],
        cap: '#F4F1EB',
        badge: p.on_sale ? 'Sale' : p.featured ? 'Featured' : undefined,
        featured: p.featured,
        permalink: p.permalink,
      };
    })
    .filter((p): p is Product => p !== null);
}

export async function fetchWooPendants(): Promise<Pendant[]> {
  const jewelrySlug = process.env.WC_JEWELRY_CATEGORY ?? 'dichroic-glass-jewelry';
  const id = await categoryId(jewelrySlug);
  if (!id) return [];
  const items = await wcFetchAll({ category: String(id) });
  const shapes: PendantShape[] = ['oval', 'teardrop', 'square', 'cabochon'];

  return items
    .filter((p) => p.stock_status !== 'outofstock')
    .map((p, i) => {
      const shape = (attr(p, 'Shape')?.toLowerCase() as PendantShape) ?? shapes[i % shapes.length];
      return {
        id: `wc-${p.id}`,
        name: p.name,
        collection: attr(p, 'Collection') ?? 'Dichroic glass',
        image: p.images[0]?.src,
        colors: PENDANT_PALETTES[i % PENDANT_PALETTES.length],
        shape: shapes.includes(shape) ? shape : 'oval',
        size: attr(p, 'Size') ?? '',
        price: Number(p.price) || 0,
        description: stripHtml(p.short_description || p.description).slice(0, 220),
        permalink: p.permalink,
      };
    });
}
