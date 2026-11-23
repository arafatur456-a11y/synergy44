/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SYNERGY 44 — MOCK DATABASE
 * ─────────────────────────────────────────────────────────────────────────────
 *  The single source of content for the site while it runs without a live store.
 *  Every product name, price, brand and category lives here — nothing is hard-coded
 *  in components.
 *
 *  ⚠️  PLACEHOLDER VALUES: prices, sizes, pendant pieces, service prices and
 *      testimonial quotes are illustrative. Confirm with the client before launch.
 *
 *  HOW THE DATA IS READ
 *  • Listing pages (shop, brand pages, jewelry, home "edit") call the async getters in
 *    `lib/catalog.ts` — never this file directly. That indirection is what lets you
 *    switch to WooCommerce without touching components.
 *  • Editorial content (brands, services, testimonials, guarantee, timeline) is read
 *    straight from here; it rarely changes and isn’t part of the store catalogue.
 *
 *  SWITCHING TO LIVE WOOCOMMERCE DATA
 *  1. In WordPress → WooCommerce → Settings → Advanced → REST API, create a key with
 *     *Read* permission.
 *  2. Add to `.env.local` (and to your Vercel project settings):
 *        WC_STORE_URL=https://synergy44.com
 *        WC_CONSUMER_KEY=ck_xxx
 *        WC_CONSUMER_SECRET=cs_xxx
 *        WC_JEWELRY_CATEGORY=dichroic-glass-jewelry   # category slug for pendants
 *  3. Redeploy. `lib/catalog.ts` detects the variables and fetches
 *     `GET /wp-json/wc/v3/products` through `lib/woocommerce.ts`, mapping each product
 *     to the `Product` / `Pendant` types (see the mapping notes in that file).
 *     Pages revalidate hourly (ISR), so price changes in WordPress appear automatically.
 *
 *  USING REAL PRODUCT IMAGES (with or without WooCommerce)
 *  • Set `image` on any product or pendant below, e.g.
 *        image: '/images/products/loma-leave-in.jpg'   // file in /public
 *        image: 'https://synergy44.com/wp-content/uploads/2025/01/loma.jpg'
 *    The illustrated packshot (`shape` / `colors` / `cap`) is then ignored.
 *  • Remote hosts must be listed in `images.remotePatterns` (next.config.mjs). The
 *    WooCommerce host is added automatically from WC_STORE_URL.
 *  • Recommended photo format: 4:5 portrait, ≥ 1200×1500px, neutral backdrop.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Brand, Category, Milestone, Pendant, Pillar, Product, ServiceGroup, Testimonial } from './types';

export type { Brand, Category, Milestone, Pendant, PendantShape, Pillar, Product, ProductShape, Service, ServiceGroup, Testimonial } from './types';

// ── BRANDS ─────────────────────────────────────────────────────────────────────
// Drives navigation, brand pages and filters. With WooCommerce, products are matched to
// these by brand slug (WooCommerce Brands taxonomy, a "Brand" attribute, or a category slug).

export const brands: Brand[] = [
  {
    slug: 'loma',
    name: 'Loma',
    tagline: 'Botanical salon care',
    description: 'Plant-powered, salon-grade formulas that cleanse, nourish and protect — gentle enough for every day.',
    tint: '#EFE2C6',
  },
  {
    slug: 'mks-eco',
    name: 'MKS Eco',
    tagline: 'Clean, eco-conscious care',
    description: 'Thoughtfully made, eco-minded hair care and styling that respects your hair and the planet.',
    tint: '#DFE9E3',
  },
  {
    slug: 'olaplex',
    name: 'Olaplex',
    tagline: 'Bond-building repair',
    description: 'Patented bond-building technology that strengthens and repairs hair from the inside out.',
    tint: '#ECE6DC',
  },
  {
    slug: 'neuma',
    name: 'Neuma',
    tagline: 'Organic luxury textures',
    description: 'Luxurious textures infused with certified-organic botanicals for softness, shine and moisture.',
    tint: '#E6DEF0',
  },
  {
    slug: 'gama',
    name: 'Gama',
    tagline: 'Professional dryers & irons',
    description: 'Professional-grade dryers and styling irons trusted behind the salon chair.',
    tint: '#E4E0DA',
  },
  {
    slug: 'sutra',
    name: 'Sutra',
    tagline: 'Effortless heat styling',
    description: 'Sleek heat-styling tools designed for smooth blowouts, polished waves and everyday ease.',
    tint: '#F4DFE3',
  },
  {
    slug: 'goomee',
    name: 'Goomee',
    tagline: 'Reusable makeup removal',
    description: 'Soft, reusable makeup-removal pads that work with water — a gentle, low-waste ritual.',
    tint: '#F3EADB',
  },
];

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);

// ── HAIR CARE CATALOGUE ────────────────────────────────────────────────────────
// `shape` / `colors` / `cap` drive the illustrated packshot; add `image` to use a photo.

export const categories: Category[] = ['Cleanse', 'Condition', 'Treat', 'Style', 'Tools', 'Beauty'];

export const products: Product[] = [
  // Loma
  { id: 'loma-daily-shampoo', brand: 'loma', name: 'Daily Shampoo', category: 'Cleanse', price: 22, size: '12 oz', description: 'A gentle botanical cleanse that leaves hair soft and balanced.', shape: 'pump', colors: ['#F3E7CF', '#C9A979'], cap: '#F7F3EC' },
  { id: 'loma-leave-in', brand: 'loma', name: 'Leave-In Conditioner', category: 'Condition', price: 24, size: '8.5 oz', description: 'Lightweight detangler that softens, protects and adds slip.', shape: 'spray', colors: ['#F1E4CA', '#B99766'], cap: '#F7F3EC', badge: 'Bestseller', featured: true },
  { id: 'loma-oil', brand: 'loma', name: 'Nourishing Oil Treatment', category: 'Treat', price: 26, size: '3.4 oz', description: 'Smooths, adds radiance and seals in moisture.', shape: 'dropper', colors: ['#F5DFA8', '#B98436'], cap: '#F7F3EC' },
  { id: 'loma-masque', brand: 'loma', name: 'Fortifying Masque', category: 'Treat', price: 28, size: '8 oz', description: 'A rich weekly masque to restore strength and softness.', shape: 'jar', colors: ['#F2E6D0', '#CDB28A'], cap: '#E7DCC8' },

  // MKS Eco
  { id: 'mks-bounce', brand: 'mks-eco', name: 'Bounce Spray', category: 'Style', price: 32, size: '8 oz', description: 'Weightless curl-defining mist that revives bounce without crunch.', shape: 'spray', colors: ['#C9DCCF', '#6F9480'], cap: '#F4F1EB', badge: 'Stylist pick', featured: true },
  { id: 'mks-moisture-conditioner', brand: 'mks-eco', name: 'Moisture Conditioner', category: 'Condition', price: 28, size: '10 oz', description: 'Hydrates and detangles while protecting color.', shape: 'pump', colors: ['#D6E3D9', '#7FA08D'], cap: '#F4F1EB' },
  { id: 'mks-texture-cream', brand: 'mks-eco', name: 'Texture Cream', category: 'Style', price: 26, size: '3 oz', description: 'Flexible hold and soft definition for natural texture.', shape: 'jar', colors: ['#D9E4DC', '#90AE9B'], cap: '#4A6B5D' },

  // Olaplex
  { id: 'olaplex-3', brand: 'olaplex', name: 'No.3 Hair Perfector', category: 'Treat', price: 30, size: '3.3 oz', description: 'At-home pre-shampoo treatment that strengthens broken bonds.', shape: 'tube', colors: ['#FBFAF8', '#D9D3CA'], cap: '#2B2926', badge: 'Bond repair', featured: true },
  { id: 'olaplex-4', brand: 'olaplex', name: 'No.4 Bond Maintenance Shampoo', category: 'Cleanse', price: 30, size: '8.5 oz', description: 'Reparative shampoo for strength, shine and smoothness.', shape: 'pump', colors: ['#FBFAF8', '#DCD6CD'], cap: '#2B2926' },
  { id: 'olaplex-5', brand: 'olaplex', name: 'No.5 Bond Maintenance Conditioner', category: 'Condition', price: 30, size: '8.5 oz', description: 'Highly moisturizing conditioner that protects and repairs.', shape: 'pump', colors: ['#FBFAF8', '#D6CFC5'], cap: '#2B2926' },
  { id: 'olaplex-7', brand: 'olaplex', name: 'No.7 Bonding Oil', category: 'Treat', price: 30, size: '1 oz', description: 'Concentrated styling oil for shine and heat protection.', shape: 'dropper', colors: ['#FBFAF8', '#CFC8BE'], cap: '#2B2926' },

  // Neuma
  { id: 'neuma-moisture-shampoo', brand: 'neuma', name: 'neuMoisture Shampoo', category: 'Cleanse', price: 26, size: '8.5 oz', description: 'Silky, hydrating cleanse with organic botanicals.', shape: 'pump', colors: ['#E9E1F1', '#A595C2'], cap: '#F6F3F8' },
  { id: 'neuma-moisture-conditioner', brand: 'neuma', name: 'neuMoisture Conditioner', category: 'Condition', price: 28, size: '8.5 oz', description: 'Deeply hydrating conditioner for soft, manageable hair.', shape: 'pump', colors: ['#E6DCEF', '#9584B7'], cap: '#F6F3F8', featured: true },
  { id: 'neuma-styling-creme', brand: 'neuma', name: 'Styling Crème', category: 'Style', price: 25, size: '3.4 oz', description: 'Smooths and defines with a soft, touchable finish.', shape: 'tube', colors: ['#EDE6F3', '#B3A5CB'], cap: '#F6F3F8' },

  // Gama
  { id: 'gama-dryer', brand: 'gama', name: 'Professional Ionic Dryer', category: 'Tools', price: 189, size: 'Ionic · 3 heat settings', description: 'Fast, quiet drying with ionic technology for a smooth finish.', shape: 'dryer', colors: ['#3A3733', '#1E1D1B'], cap: '#B8975E', featured: true },
  { id: 'gama-flat-iron', brand: 'gama', name: 'Ceramic Flat Iron', category: 'Tools', price: 129, size: '1" plates', description: 'Even ceramic heat for sleek, glossy results.', shape: 'iron', colors: ['#4A4743', '#1E1D1B'], cap: '#B8975E' },

  // Sutra
  { id: 'sutra-wand', brand: 'sutra', name: 'Interchangeable Curling Wand', category: 'Tools', price: 149, size: '1" & 1.25" barrels', description: 'Effortless waves with interchangeable, quick-heating barrels.', shape: 'wand', colors: ['#E8D3D8', '#B88E98'], cap: '#D9C29A' },
  { id: 'sutra-iron', brand: 'sutra', name: 'Infrared Styling Iron', category: 'Tools', price: 139, size: '1" plates', description: 'Straighten or curl with smooth, even infrared heat.', shape: 'iron', colors: ['#E3CDD3', '#A9808B'], cap: '#D9C29A' },

  // Goomee
  { id: 'goomee-markers', brand: 'goomee', name: 'The Markers — Removal Pads', category: 'Beauty', price: 24, size: '4 reusable pads', description: 'Remove makeup with just water — soft, reusable and gentle.', shape: 'pouch', colors: ['#F5E3D7', '#D9A98C'], cap: '#F7F3EC', badge: 'Low waste' },
  { id: 'goomee-travel', brand: 'goomee', name: 'Travel Pouch Set', category: 'Beauty', price: 32, size: '6 pads + pouch', description: 'A travel-ready set of reusable pads in a breathable pouch.', shape: 'pouch', colors: ['#E8EFE9', '#9DB8A8'], cap: '#F7F3EC' },
];


/** Editorial helper for decorative scenes. Listings must use getProductsByBrand() in lib/catalog.ts. */
export const productsByBrand = (slug: string) => products.filter((p) => p.brand === slug);

// Listing helpers for pages (featured, by brand, pendants) live in lib/catalog.ts.

// ── DICHROIC GLASS JEWELRY ─────────────────────────────────────────────────────

export const pendants: Pendant[] = [
  { id: 'aurora', name: 'Aurora Veil', collection: 'Northern Light', colors: ['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6'], shape: 'oval', size: '1.4" × 1"', price: 68, description: 'Layers of green and violet dichroic glass that shift like the northern lights as you move.' },
  { id: 'ember', name: 'Copper Ember', collection: 'Fire & Earth', colors: ['#E3955A', '#E8C468', '#B85A6A', '#EBA977'], shape: 'teardrop', size: '1.5" × 0.9"', price: 72, description: 'Warm sunset tones fused over dark glass for a glowing, molten depth.' },
  { id: 'tide', name: 'Emerald Tide', collection: 'Ocean Prism', colors: ['#4FAE8C', '#5BA3CF', '#58B4A7', '#7C83D1'], shape: 'square', size: '1.1" × 1.1"', price: 64, description: 'Ocean-inspired striations that flash teal, blue and green in daylight.' },
  { id: 'nebula', name: 'Violet Nebula', collection: 'Cosmos', colors: ['#9C82D8', '#D88AB5', '#6E8FD8', '#B99BDE'], shape: 'cabochon', size: '1.3" × 1.1"', price: 76, description: 'Deep violets with rose and cobalt reflections — a galaxy captured in glass.' },
  { id: 'rose', name: 'Rose Quartz Bloom', collection: 'Botanica', colors: ['#EDB3C8', '#E9CF8A', '#E39AB8', '#B6DCE0'], shape: 'oval', size: '1.2" × 0.9"', price: 62, description: 'Soft blush and iris layers with a delicate iridescent bloom.' },
  { id: 'midnight', name: 'Midnight Opal', collection: 'Cosmos', colors: ['#4C6CC4', '#5FBF9A', '#8A6CC9', '#4FA6B8'], shape: 'teardrop', size: '1.6" × 1"', price: 82, description: 'Opal-like flashes over a midnight base — a true statement piece.' },
  { id: 'fern', name: 'Fern Hollow', collection: 'Botanica', colors: ['#8DB59A', '#D8C27A', '#6E9C86', '#C7D9A6'], shape: 'cabochon', size: '1.2" × 1"', price: 66, description: 'Mossy greens and golden flecks inspired by a forest floor in morning light.' },
  { id: 'lagoon', name: 'Lagoon Glass', collection: 'Ocean Prism', colors: ['#6CC3C8', '#89A8E0', '#7DD0B4', '#B2C7EC'], shape: 'oval', size: '1.3" × 1"', price: 64, description: 'Clear lagoon blues layered over shimmering aqua dichroic.' },
  { id: 'sunstone', name: 'Sunstone', collection: 'Fire & Earth', colors: ['#E8B65C', '#DE8C5E', '#F0D49A', '#C98A6A'], shape: 'square', size: '1" × 1"', price: 58, description: 'Golden amber glass with a soft copper glow — warm and grounding.' },
];


// ── EDITORIAL CONTENT ──────────────────────────────────────────────────────────

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'women',
    title: 'Women’s Haircuts',
    services: [
      { name: 'Women’s Haircut', detail: 'Consultation, wash, precision cut & finish', price: '$65', duration: '60 min' },
      { name: 'Haircut & Blowout', detail: 'Cut with a smoothing, volumizing blowout', price: '$85', duration: '75 min' },
      { name: 'Fringe / Bang Trim', detail: 'Between-visit refresh', price: '$15', duration: '15 min' },
    ],
  },
  {
    id: 'men',
    title: 'Men’s Haircuts',
    services: [
      { name: 'Men’s Haircut', detail: 'Consultation, wash, cut & style', price: '$40', duration: '45 min' },
      { name: 'Clipper Cut', detail: 'Clean, single-guard or tapered cut', price: '$30', duration: '30 min' },
      { name: 'Beard Shape-Up', detail: 'Line-up and trim', price: '$20', duration: '20 min' },
    ],
  },
  {
    id: 'color',
    title: 'Hi-Lights & Color',
    note: 'Color services include a strand-health consultation.',
    services: [
      { name: 'Partial Hi-Lights', detail: 'Face-framing & crown placement', price: 'from $95', duration: '90 min' },
      { name: 'Full Hi-Lights', detail: 'Dimensional, all-over lightening', price: 'from $140', duration: '2 hr' },
      { name: 'Glaze', detail: 'Tone, shine & color refresh', price: 'from $45', duration: '30 min' },
      { name: 'Roots', detail: 'Root touch-up, up to 1.5"', price: 'from $70', duration: '75 min' },
    ],
  },
  {
    id: 'treat',
    title: 'Treatments',
    services: [
      { name: 'Olaplex Bond Treatment', detail: 'Add-on to any service', price: '$35', duration: '20 min' },
      { name: 'Botanical Deep Condition', detail: 'Hydrating masque & scalp massage', price: '$30', duration: '20 min' },
    ],
  },
];

export const testimonials: Testimonial[] = [
  { name: 'Lisa Mary', context: 'Salon client', quote: 'My hair has never felt healthier. Cynthia truly listens, and the organic products she recommended changed my whole routine.' },
  { name: 'Ru Knoedler', context: 'Salon & jewelry client', quote: 'An artist in every sense — with color, with cuts, and with glass. My pendant catches the light everywhere I go.' },
  { name: 'Salon Guest', context: 'Hi-lights & glaze', quote: 'Warm, knowledgeable and genuinely invested in the health of my hair. I leave every appointment feeling renewed.' },
  { name: 'Jewelry Collector', context: 'Dichroic glass', quote: 'Each piece is completely unique. The colors shift with the light — beautiful craftsmanship.' },
];

export const guarantee: Pillar[] = [
  { icon: 'shield', title: 'Satisfaction, guaranteed', body: 'If a product or service isn’t right for you, talk to us — we’ll make it right.' },
  { icon: 'leaf', title: 'Clean, considered formulas', body: 'We curate organic, vegan-forward lines and avoid harsh, unnecessary ingredients.' },
  { icon: 'sparkle', title: 'Truly handmade', body: 'Every glass pendant is cut, layered and kiln-fired by hand — no two are alike.' },
  { icon: 'heart', title: 'Professional care', body: 'Guidance from a licensed cosmetologist who puts the health of your hair first.' },
];

export const milestones: Milestone[] = [
  { phase: 'Foundation', title: 'Eastern Michigan University', body: 'Cynthia’s studies at Eastern Michigan University grounded her in art, color and form — the same eye that guides every cut, color and kiln firing.' },
  { phase: 'Craft', title: 'Licensed cosmetologist', body: 'Professional training and years behind the chair, recorded in her professional cosmetology journals — a practice built on technique, listening and care.' },
  { phase: 'Philosophy', title: 'The Hair Healers', body: 'A commitment to healthier hair through clean chemistry — curating organic, vegan lines alongside proven bond-repair science.' },
  { phase: 'Artistry', title: 'The glass studio', body: 'Layer by layer, dichroic glass is cut, stacked and kiln-fused into wearable art — each pendant one of a kind.' },
];
