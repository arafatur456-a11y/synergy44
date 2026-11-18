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
};

export type Product = {
  id: string;
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
};

export type Service = { name: string; detail: string; price: string; duration?: string };
export type ServiceGroup = { id: string; title: string; note?: string; services: Service[] };
export type Testimonial = { name: string; context: string; quote: string };
export type Pillar = { title: string; body: string; icon: 'leaf' | 'shield' | 'sparkle' | 'heart' };
export type Milestone = { phase: string; title: string; body: string };
