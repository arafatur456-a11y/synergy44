export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Soft accent used for brand hero washes */
  tint: string;
};

// Brand copy is intentionally general — refine with the client's preferred wording.
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
