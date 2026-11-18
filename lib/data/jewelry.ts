/** ⚠️ PLACEHOLDER pieces — replace with Cynthia's real inventory, photos, sizes and prices. */

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
  { id: 'aurora', name: 'Aurora Veil', collection: 'Northern Light', colors: ['#5FBF9A', '#6E8FD8', '#A88BD6', '#7CC9D6'], shape: 'oval', size: '1.4" × 1"', price: 68, description: 'Layers of green and violet dichroic glass that shift like the northern lights as you move.' },
  { id: 'ember', name: 'Copper Ember', collection: 'Fire & Earth', colors: ['#E3955A', '#E8C468', '#B85A6A', '#EBA977'], shape: 'teardrop', size: '1.5" × 0.9"', price: 72, description: 'Warm sunset tones fused over dark glass for a glowing, molten depth.' },
  { id: 'tide', name: 'Emerald Tide', collection: 'Ocean Prism', colors: ['#4FAE8C', '#5BA3CF', '#58B4A7', '#7C83D1'], shape: 'square', size: '1.1" × 1.1"', price: 64, description: 'Ocean-inspired striations that flash teal, blue and green in daylight.' },
  { id: 'nebula', name: 'Violet Nebula', collection: 'Cosmos', colors: ['#9C82D8', '#D88AB5', '#6E8FD8', '#B99BDE'], shape: 'cabochon', size: '1.3" × 1.1"', price: 76, description: 'Deep violets with rose and cobalt reflections — a galaxy captured in glass.' },
  { id: 'rose', name: 'Rose Quartz Bloom', collection: 'Botanica', colors: ['#EDB3C8', '#E9CF8A', '#E39AB8', '#B6DCE0'], shape: 'oval', size: '1.2" × 0.9"', price: 62, description: 'Soft blush and champagne layers with a delicate iridescent bloom.' },
  { id: 'midnight', name: 'Midnight Opal', collection: 'Cosmos', colors: ['#4C6CC4', '#5FBF9A', '#8A6CC9', '#4FA6B8'], shape: 'teardrop', size: '1.6" × 1"', price: 82, description: 'Opal-like flashes over a midnight base — a true statement piece.' },
  { id: 'fern', name: 'Fern Hollow', collection: 'Botanica', colors: ['#8DB59A', '#D8C27A', '#6E9C86', '#C7D9A6'], shape: 'cabochon', size: '1.2" × 1"', price: 66, description: 'Mossy greens and golden flecks inspired by a forest floor in morning light.' },
  { id: 'lagoon', name: 'Lagoon Glass', collection: 'Ocean Prism', colors: ['#6CC3C8', '#89A8E0', '#7DD0B4', '#B2C7EC'], shape: 'oval', size: '1.3" × 1"', price: 64, description: 'Clear lagoon blues layered over shimmering aqua dichroic.' },
  { id: 'sunstone', name: 'Sunstone', collection: 'Fire & Earth', colors: ['#E8B65C', '#DE8C5E', '#F0D49A', '#C98A6A'], shape: 'square', size: '1" × 1"', price: 58, description: 'Golden amber glass with a soft copper glow — warm and grounding.' },
];

export const collections = Array.from(new Set(pendants.map((p) => p.collection)));
