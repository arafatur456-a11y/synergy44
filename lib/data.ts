/**
 * Content for the landing page.
 *
 * ⚠️ Prices, sizes and pendant details below are PLACEHOLDERS. Sync them with
 * the live WooCommerce catalogue (or fetch them from the WC Store API) before launch.
 * Testimonial quotes are also placeholders — replace them with the clients'
 * verbatim reviews (with permission).
 */

export type BottleShape = 'pump' | 'spray' | 'dropper' | 'tube';
export type HairCategory = 'Repair' | 'Hydrate' | 'Style';

export type HairProduct = {
  id: string;
  brand: string;
  name: string;
  category: HairCategory;
  price: number;
  size: string;
  blurb: string;
  shape: BottleShape;
  colors: [string, string];
  cap: string;
  tag?: string;
};

export const hairProducts: HairProduct[] = [
  {
    id: 'mks-bounce',
    brand: 'MKS eco',
    name: 'Bounce Spray',
    category: 'Style',
    price: 32,
    size: '8 oz',
    blurb: 'Weightless curl-defining mist that revives bounce and tames frizz without crunch.',
    shape: 'spray',
    colors: ['#7ee0c6', '#0e6b5b'],
    cap: '#d6d3d1',
    tag: 'Bestseller',
  },
  {
    id: 'loma-leave-in',
    brand: 'Loma',
    name: 'Leave-In Conditioner',
    category: 'Hydrate',
    price: 24,
    size: '8.5 oz',
    blurb: 'Botanical detangler that softens, protects and adds slip from root to tip.',
    shape: 'pump',
    colors: ['#f3e3c3', '#a3804c'],
    cap: '#e7e5e4',
    tag: 'Organic',
  },
  {
    id: 'olaplex-7',
    brand: 'Olaplex',
    name: 'No.7 Bonding Oil',
    category: 'Repair',
    price: 30,
    size: '1 oz',
    blurb: 'Concentrated, bond-building styling oil for shine, softness and heat protection.',
    shape: 'dropper',
    colors: ['#f5f5f4', '#78716c'],
    cap: '#1c1917',
    tag: 'Bond Repair',
  },
  {
    id: 'neuma-moisture',
    brand: 'Neuma',
    name: 'neuMoisture Conditioner',
    category: 'Hydrate',
    price: 28,
    size: '8.5 oz',
    blurb: 'Silky, deeply hydrating formula infused with certified-organic botanicals.',
    shape: 'pump',
    colors: ['#cdbdfd', '#5b34c9'],
    cap: '#f5f5f4',
  },
  {
    id: 'olaplex-3',
    brand: 'Olaplex',
    name: 'No.3 Hair Perfector',
    category: 'Repair',
    price: 30,
    size: '3.3 oz',
    blurb: 'At-home pre-shampoo treatment that strengthens and repairs broken bonds.',
    shape: 'tube',
    colors: ['#fafaf9', '#a8a29e'],
    cap: '#292524',
  },
  {
    id: 'loma-oil',
    brand: 'Loma',
    name: 'Nourishing Oil Treatment',
    category: 'Repair',
    price: 26,
    size: '3.4 oz',
    blurb: 'Lightweight treatment oil that smooths, adds radiance and seals in moisture.',
    shape: 'dropper',
    colors: ['#fde7a0', '#b2620f'],
    cap: '#e7e5e4',
  },
];

export type PendantShape = 'oval' | 'teardrop' | 'square' | 'cabochon';

export type Pendant = {
  id: string;
  name: string;
  collection: string;
  colors: [string, string, string, string];
  shape: PendantShape;
  size: string;
  price: number;
  description: string;
};

export const pendants: Pendant[] = [
  {
    id: 'aurora',
    name: 'Aurora Veil',
    collection: 'Northern Light',
    colors: ['#34f5a4', '#3b82f6', '#a855f7', '#22d3ee'],
    shape: 'oval',
    size: '1.4" × 1"',
    price: 68,
    description: 'Layers of emerald and violet dichroic glass that shift like the northern lights as you move.',
  },
  {
    id: 'ember',
    name: 'Copper Ember',
    collection: 'Fire & Earth',
    colors: ['#f97316', '#facc15', '#be123c', '#fb923c'],
    shape: 'teardrop',
    size: '1.5" × 0.9"',
    price: 72,
    description: 'Warm sunset tones fused over black glass for a glowing, molten depth.',
  },
  {
    id: 'tide',
    name: 'Emerald Tide',
    collection: 'Ocean Prism',
    colors: ['#10b981', '#0ea5e9', '#14b8a6', '#6366f1'],
    shape: 'square',
    size: '1.1" × 1.1"',
    price: 64,
    description: 'Ocean-inspired striations that flash teal, blue and green in daylight.',
  },
  {
    id: 'nebula',
    name: 'Violet Nebula',
    collection: 'Cosmos',
    colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#c084fc'],
    shape: 'cabochon',
    size: '1.3" × 1.1"',
    price: 76,
    description: 'A galaxy captured in glass — deep violets with pink and cobalt reflections.',
  },
  {
    id: 'rose',
    name: 'Rose Quartz Bloom',
    collection: 'Botanica',
    colors: ['#f9a8d4', '#fcd34d', '#f472b6', '#a5f3fc'],
    shape: 'oval',
    size: '1.2" × 0.9"',
    price: 62,
    description: 'Soft blush and champagne layers with a delicate iridescent bloom.',
  },
  {
    id: 'midnight',
    name: 'Midnight Opal',
    collection: 'Cosmos',
    colors: ['#1d4ed8', '#34f5a4', '#7c3aed', '#0891b2'],
    shape: 'teardrop',
    size: '1.6" × 1"',
    price: 82,
    description: 'Opal-like flashes over a midnight base — a true one-of-one statement piece.',
  },
];

export type Testimonial = {
  name: string;
  context: string;
  rating: number;
  quote: string;
};

// PLACEHOLDER QUOTES — replace with each client's verbatim review before launch.
export const testimonials: Testimonial[] = [
  {
    name: 'Lisa Mary',
    context: 'Salon client',
    rating: 5,
    quote:
      'My hair has never felt healthier. Cynthia truly listens, and the organic products she recommended changed my whole routine.',
  },
  {
    name: 'Ru Knoedler',
    context: 'Salon & jewelry client',
    rating: 5,
    quote:
      'An artist in every sense — with color, with cuts, and with glass. My pendant catches the light everywhere I go.',
  },
  {
    name: 'Salon Guest',
    context: 'Color & treatment',
    rating: 5,
    quote:
      'Warm, knowledgeable and genuinely invested in the health of your hair. I leave every appointment feeling renewed.',
  },
  {
    name: 'Jewelry Collector',
    context: 'Dichroic glass',
    rating: 5,
    quote:
      'Each piece is completely unique. The colors shift from emerald to violet depending on the light — stunning craftsmanship.',
  },
];

export type Milestone = {
  phase: string;
  title: string;
  body: string;
  accent: [string, string];
};

// Verify wording/dates with Cynthia before publishing.
export const milestones: Milestone[] = [
  {
    phase: 'Foundation',
    title: 'Eastern Michigan University',
    body: 'Cynthia’s studies at Eastern Michigan University grounded her in art, color theory and form — the same eye that guides every cut, color and kiln firing today.',
    accent: ['#34f5a4', '#0ea5e9'],
  },
  {
    phase: 'Craft',
    title: 'Professional Cosmetology',
    body: 'Licensed training and years behind the chair, documented in her professional cosmetology journals — a practice built on technique, listening and care.',
    accent: ['#c4b5fd', '#ec4899'],
  },
  {
    phase: 'Healing',
    title: 'The Hair Healers',
    body: 'A commitment to clean chemistry: curating organic, vegan lines like Loma, MKS eco and Neuma alongside bond-repair science from Olaplex.',
    accent: ['#8ff7cb', '#10b981'],
  },
  {
    phase: 'Artistry',
    title: 'Dichroic Glass Studio',
    body: 'Layer by layer, metal-oxide-coated glass is cut, stacked and kiln-fused into wearable art — every pendant handmade and one of a kind.',
    accent: ['#f9c6dd', '#a855f7'],
  },
  {
    phase: 'Today',
    title: 'Synergy 44',
    body: 'A salon, an apothecary and an art studio in one — serving clients across Michigan and California, and shipping nationwide.',
    accent: ['#f3e3c3', '#34f5a4'],
  },
];

export const brands = ['Loma', 'MKS eco', 'Olaplex', 'Neuma', 'Dichroic Glass', 'Organic', 'Vegan', 'Handmade'];
