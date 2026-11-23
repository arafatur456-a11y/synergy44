/**
 * Domain types shared by the mock database (`lib/data.ts`), the WooCommerce adapter
 * (`lib/woocommerce.ts`) and the UI. Keep these stable — UI components depend only on them.
 */

export type ProductShape = 'pump' | 'spray' | 'dropper' | 'tube' | 'jar' | 'iron' | 'wand' | 'dryer' | 'pouch';
export type Category = 'Cleanse' | 'Condition' | 'Treat' | 'Style' | 'Tools' | 'Beauty';
export type PendantShape = 'oval' | 'teardrop' | 'square' | 'cabochon';

export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Soft accent used behind product imagery */
  tint: string;
  /** Other names/slugs the store may use for this brand (WooCommerce brand, category or attribute) */
  aliases?: string[];
  /** Brand-line artwork for the home showcase (image in /public; square works best) */
  image?: string;
  /**
   * How non-square artwork fills the square card: 'contain' shows the whole image on
   * `imageBg` (no cropping). Defaults to 'cover'.
   */
  imageFit?: 'cover' | 'contain';
  imageBg?: string;
};

export type Product = {
  id: string;
  /** URL slug for /product/[slug] (WooCommerce slug; demo items fall back to `id`) */
  slug?: string;
  sku?: string;
  /** Brand slug — must match a `Brand.slug` */
  brand: string;
  name: string;
  category: Category;
  /** Price in USD */
  price: number;
  size: string;
  description: string;
  /**
   * Real product photo (absolute URL or /public path). When set it replaces the
   * illustrated packshot everywhere (cards, cart). Remote hosts must be allowed in next.config.mjs.
   */
  image?: string;
  /** Illustrated packshot used when no `image` is available */
  shape: ProductShape;
  colors: [string, string];
  cap: string;
  badge?: string;
  featured?: boolean;
  /** WooCommerce product URL / permalink, if sourced from the store */
  permalink?: string;
  // ── Commerce fields (set when the product comes from WooCommerce) ──
  /** Numeric WooCommerce product ID — required for checkout */
  wcId?: number;
  /** WooCommerce product type. Variable products need option selection on the product page. */
  type?: 'simple' | 'variable' | 'grouped' | 'external';
  /** Regular price when the product is on sale */
  regularPrice?: number;
  inStock?: boolean;
  /** Remaining stock when WooCommerce manages stock for the product */
  stockQuantity?: number | null;
};

export type Pendant = {
  id: string;
  slug?: string;
  sku?: string;
  name: string;
  collection: string;
  /** Real photo — replaces the illustrated pendant when set */
  image?: string;
  colors: [string, string, string, string];
  shape: PendantShape;
  size: string;
  price: number;
  description: string;
  permalink?: string;
  wcId?: number;
  inStock?: boolean;
  stockQuantity?: number | null;
};

// ── Single product page ──────────────────────────────────────────────────────

export type ProductImage = { src: string; alt: string };

/** A product attribute shown on the page; `variation` = used to choose a variant */
export type ProductAttribute = { name: string; options: string[]; variation: boolean };

export type ProductVariation = {
  id: number;
  price: number;
  regularPrice?: number;
  inStock: boolean;
  stockQuantity: number | null;
  sku?: string;
  image?: string;
  /** attribute name → option; '' means "any" */
  attributes: Record<string, string>;
};

export type ProductDetail = {
  kind: 'product' | 'pendant';
  /** Listing shape (used for cart, cards, related items) */
  item: Product | Pendant;
  slug: string;
  sku?: string;
  /** Brand name (hair care) or collection (jewelry) */
  label: string;
  /** Link for the label (brand page or /jewelry) */
  labelHref: string;
  images: ProductImage[];
  /** Sanitized HTML from WooCommerce */
  shortDescriptionHtml: string;
  descriptionHtml: string;
  attributes: ProductAttribute[];
  variations: ProductVariation[];
};

export type Service = { name: string; detail: string; price: string; duration?: string };
export type ServiceGroup = { id: string; title: string; note?: string; services: Service[] };
export type Testimonial = { name: string; context: string; quote: string };
export type Pillar = { title: string; body: string; icon: 'leaf' | 'shield' | 'sparkle' | 'heart' };
export type Milestone = { phase: string; title: string; body: string };
