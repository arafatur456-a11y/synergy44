/**
 * ⚠️ PLACEHOLDER CATALOGUE — names, sizes and prices must be synced with the
 * live WooCommerce store (or fetched from the WC Store API) before launch.
 */

export type ProductShape = 'pump' | 'spray' | 'dropper' | 'tube' | 'jar' | 'iron' | 'wand' | 'dryer' | 'pouch';
export type Category = 'Cleanse' | 'Condition' | 'Treat' | 'Style' | 'Tools' | 'Beauty';

export const categories: Category[] = ['Cleanse', 'Condition', 'Treat', 'Style', 'Tools', 'Beauty'];

export type Product = {
  id: string;
  brand: string; // brand slug
  name: string;
  category: Category;
  price: number;
  size: string;
  description: string;
  shape: ProductShape;
  colors: [string, string];
  cap: string;
  badge?: string;
  featured?: boolean;
};

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

export const featuredProducts = products.filter((p) => p.featured);
export const productsByBrand = (slug: string) => products.filter((p) => p.brand === slug);
