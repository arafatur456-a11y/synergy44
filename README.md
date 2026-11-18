# Synergy 44 — Warm Editorial Redesign

A multi-page Next.js (App Router) storefront for Synergy 44: organic hair care, salon services and handmade dichroic glass jewelry by Cynthia Reedy.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Lenis · lucide-react · self-hosted Cormorant Garamond + Manrope (Fontsource)

![Home](preview/home.jpg)

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Copy `.env.example` to `.env.local` to enable email delivery for the contact form and a direct checkout link (both optional).

## Routes

| Route | What it is |
| --- | --- |
| `/` | Editorial hero with floating frosted cards (mouse parallax + tilt), brand strip, two-crafts split, featured products, glass teaser, salon teaser, testimonials, Guarantee |
| `/products/hair-care` | Full catalogue — brand chips, ritual tabs, search, sort; filters sync to `?brand=` / `?category=` |
| `/products/hair-care/[brand]` | Statically generated pages for Loma, MKS Eco, Olaplex, Neuma, Gama, Sutra, Goomee |
| `/jewelry` | Dichroic glass gallery with collection filters, shimmering cards, quick-view modal, process + commissions |
| `/about` | Cynthia’s story, timeline, the Synergy 44 Guarantee, sustainability |
| `/hair-styling` | Tabbed salon menu (Women / Men / Hi-Lights & Color / Treatments), approach, testimonials |
| `/contact` | Validated inquiry & booking form (`?topic=salon|consultation|product|jewelry|other` pre-selects) |
| `POST /api/contact` | Server validation, honeypot, per-IP throttle, email via Resend |

## Structure

```
app/                     routes, layout (fonts, providers), template.tsx (page transitions), api/contact
components/
  layout/                Navbar (mega menu + mobile sheet), Footer, SmoothScroll (Lenis)
  ui/                    Reveal, Parallax, TiltCard, BotanicalSprig, PageHeader, SectionHeading
  shop/                  ProductCard, ProductGrid (filters), ProductVisual (SVG packshots), CartDrawer
  jewelry/               PendantVisual (CSS dichroic glass), JewelryGallery, QuickViewModal
  home/                  Hero, BrandStrip, CraftsSplit, FeaturedProducts, JewelryTeaser, ServicesTeaser
  services/, contact/    PricingMenu, ContactForm
lib/
  data/                  brands, products, jewelry, content (services, testimonials, guarantee, timeline)
  cart.tsx               cart context (localStorage-persisted)
  contact.ts             shared validation for form + API
  lenis.ts, site.ts, utils.ts
```

## Design system

Tokens live in `tailwind.config.ts`: `cream #FAF8F5`, `espresso #1E1D1B`, `sage #4A6B5D`, `champagne #B8975E`, plus an `.iridescent` wash and `.text-iridescent` for the dichroic accent. Reusable classes (`.btn-dark`, `.btn-outline`, `.card`, `.frost`, `.chip`, `.input`, `.eyebrow`, `.h-section`, `.display-xl`) are in `app/globals.css`.

Motion is deliberately calm: tilt ≤ 6°, long silk easing, scroll parallax ≤ 70px. Everything respects `prefers-reduced-motion` (Lenis, parallax, tilt and reveals switch off).

## Before launch — content to confirm

All of these are placeholders and are flagged in the data files:

- **Products** (`lib/data/products.ts`) — names, sizes, prices. Sync with WooCommerce, or fetch from the WC Store API.
- **Jewelry** (`lib/data/jewelry.ts`) — piece names, sizes, prices.
- **Services** (`lib/data/content.ts`) — prices and durations.
- **Testimonials** — quotes are illustrative. Replace with clients’ verbatim reviews (with permission).
- **Guarantee and biography wording** — confirm with Cynthia.
- **Imagery** — product packshots, pendants and portraits are drawn in code. Swap in real photography with `next/image`.
- **Checkout** — the bag works locally. Set `NEXT_PUBLIC_CHECKOUT_URL` or wire `lib/cart.tsx` to the WooCommerce Store API / Stripe. Until then the bag offers “Request this order”, which sends the bag contents through the contact form.
- **Newsletter** — footer form is UI only. Connect it to Mailchimp, Klaviyo or similar.
- **Contact email** — `site.contactEmail` in `lib/site.ts` is shown on `/contact` only once set.

## Deploying

Works on Vercel with zero config. Add the environment variables from `.env.example` in the project settings.
