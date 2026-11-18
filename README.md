# Synergy 44 — Boutique Storefront

A multi-page Next.js (App Router) storefront for Synergy 44: organic hair care, salon services and handmade dichroic glass jewelry by Cynthia Reedy.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Lenis · lucide-react · self-hosted Playfair Display + Inter Tight (Fontsource)

![Home](preview/home.jpg)

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Copy `.env.local.example` to `.env.local` and fill in the WooCommerce keys (see *Headless WooCommerce*).

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

## Headless WooCommerce

The storefront runs on the live WooCommerce store at synergy44.com. Products, prices, stock and orders come from the WooCommerce REST API (`/wp-json/wc/v3`). WordPress remains the back office.

```
lib/woocommerce.ts     Server-only REST client (native fetch + Basic Auth, ISR cache tag 'catalog'), field mapping, order creation
lib/catalog.ts         getProducts · getProductsByBrand · getFeaturedProducts · getPendants  ← pages call these
lib/checkout.ts        Shared checkout contract + validation (client-safe)
lib/checkout-server.ts Live re-pricing / stock checks + order placement
app/api/checkout/quote POST → live prices, stock, shipping for the bag
app/api/checkout       POST → creates a pending WooCommerce order, returns its payment URL
app/api/revalidate     WooCommerce webhook → purges the cached catalog instantly
app/checkout           Checkout page (contact + shipping → secure payment)
lib/data.ts            Editorial content (brands, salon menu, testimonials) + a demo catalog used only when no store is configured
```

### Setup
1. In WordPress, go to **WooCommerce → Settings → Advanced → REST API → Add key**. Set **Permissions: Read/Write**.
2. Copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_WC_STORE_URL`, `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET`. Add the same values in Vercel → Settings → Environment Variables.
3. Organize products so they map onto the site (adjust the tables in `lib/woocommerce.ts` if needed):
   - **Brand:** WooCommerce Brands (9.6+), a “Brand” attribute, or a category whose slug matches a brand in `lib/data.ts` (`loma`, `mks-eco`, `olaplex`, `neuma`, `gama`, `sutra`, `goomee`).
   - **Ritual:** category slugs in `CATEGORY_MAP` (shampoo, conditioner, treatments, styling, tools…).
   - **Pendants:** the `WC_JEWELRY_CATEGORY` category, with optional “Collection”, “Size” and “Shape” attributes.
   - **Photos:** the first gallery image, ideally 4:5 portrait.
4. (Recommended) Add webhooks for **Product created / updated / deleted** that point to `https://<site>/api/revalidate`, with the secret set to `WC_WEBHOOK_SECRET`. Price and stock edits then appear immediately. Without webhooks, pages refresh every 5 minutes.

### How checkout works
1. The bag (client-side, persisted) stores WooCommerce product IDs.
2. `/checkout` asks `/api/checkout/quote` for **live** prices and stock. Changed prices sync into the bag, and sold-out or low-stock lines can be fixed in place.
3. On submit, `/api/checkout` re-validates everything server-side and creates a **pending** order via `POST /wc/v3/orders`. Only product IDs and quantities are sent, so WooCommerce prices every line and applies its tax settings.
4. The customer is redirected to the order’s `payment_url`, WooCommerce’s own **Pay for order** page. There the store’s configured gateways (Stripe, PayPal, …) take payment, and WooCommerce sends its usual emails and handles stock.

Card data never touches this app, and the consumer secret never reaches the browser.

**Things to know**
- **Shipping:** the REST API doesn’t run shipping-zone rules on order creation. Configure one shipping line with `WC_SHIPPING_*` (optional free-shipping threshold), or leave it unset for pickup/manual shipping.
- **Variable products** (sizes/colours) show *Choose options* and link to the product page on the store. Quick add is limited to simple products.
- **Guest payment:** recent WooCommerce versions may ask a guest to confirm their email on the Pay for order page. This is expected.
- **Unpaid orders** stay *Pending payment*. WooCommerce cancels them after the *Hold stock* window (Settings → Products → Inventory).
- **Without credentials** (local dev, previews), the site serves the demo catalog from `lib/data.ts` and checkout shows *Request this order*. The build log warns when this happens.

## Structure

```
app/                     routes, layout (fonts, providers), template.tsx (page transitions), api/contact
components/
  layout/                Navbar (mega menu + mobile sheet), Footer, SmoothScroll (Lenis)
  ui/                    StudioScene, SectionHeader, PageHeader, Reveal, Parallax, TiltCard, BotanicalSprig
  shop/                  CardParts (shared card anatomy), ProductCard, ProductGrid, ProductVisual, CartDrawer
  jewelry/               PendantCard, PendantVisual, JewelryGallery, QuickViewModal
  home/                  Hero, BrandMarquee, FeaturedEdit, CraftsSplit, GlassStudio, ServicesTeaser
  services/, contact/    PricingMenu (luxury menu card), ContactForm
lib/                     data, types, catalog, woocommerce, cart, contact, lenis, site, utils
```

**Card system:** every product and pendant tile is built from `components/shop/CardParts.tsx`. They all share a 4:5 media frame, 4px radius, hairline ring, the same shadow depth and hover zoom, the same badge, a slide-up action bar and a matching meta row. They also share the grid spacing (`CARD_GRID`).

## Design system

- **Type:** Playfair Display (600, high-contrast serif) for display, Inter Tight for UI and body. Headings are set in `#111` ink; italic champagne-gold accents (`.accent`).
- **Palette** (`tailwind.config.ts`): `ink #111`, `cream #F5F1EA`, `paper #FBF9F5`, `line #E3DCD1`, `forest #131C18`, `sage #4A6B5D`, `champagne #A27D42`.
- **Geometry:** sharp 2–6px radii, hairline rules, numbered editorial section headers (`SectionHeader`), asymmetric 12-column grids.
- **Buttons:** rectangular, tracked caps, fill-wipe hover + arrow nudge (`.btn-dark`, `.btn-outline`, `.btn-light`, `.btn-ghost-light`).
- **Glass:** `.glass` (milk glass, deep layered shadows) and `.glass-dark` for cards floating over imagery. The header is a frosted sticky bar (`backdrop-blur-md`).
- **Imagery:** `components/ui/StudioScene.tsx` renders art-directed “studio photographs” in code — spotlight, arched niche, stone plinth, botanical shadow, grain, pointer-following light — in `forest`, `stone`, `velvet` and `espresso` tones. **Pass `src` to swap in real photography** with no layout changes:

  ```tsx
  <StudioScene src="/images/loma-leave-in.jpg" alt="Loma Leave-In Conditioner on stone" className="aspect-[4/5]" />
  ```

- **Motion:** calm and fluid — Lenis inertial scroll, slow image zoom on hover (1.4s), 5–6° tilt on glass cards, scroll parallax, clip-path reveals. Everything respects `prefers-reduced-motion`.

## Before launch — content to confirm

All of these are placeholders and are flagged in the data files:

- **Products & jewelry** come from WooCommerce once connected. The demo catalog in `lib/data.ts` is only for development.
- **Services** (`lib/data.ts` → `serviceGroups`) — prices and durations.
- **Testimonials** — quotes are illustrative. Replace with clients’ verbatim reviews (with permission).
- **Guarantee and biography wording** — confirm with Cynthia.
- **Imagery** — scenes, packshots and pendants are drawn in code. Pass real photos to `StudioScene` via `src` (see above), and replace `ProductVisual` / `PendantVisual` with `next/image` once product photography exists.
- **Checkout** — test a full order on a staging store or with a 100%-off coupon before launch. Confirm the shipping line and the payment gateways on the Pay for order page.
- **Newsletter** — footer form is UI only. Connect it to Mailchimp, Klaviyo or similar.
- **Contact email** — `site.contactEmail` in `lib/site.ts` is shown on `/contact` only once set.

## Deploying

Works on Vercel with zero config. Add the environment variables from `.env.example` in the project settings.
