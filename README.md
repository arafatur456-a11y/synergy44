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
   - **Jewelry:** every product in the **Jewelry** category (slug `jewelry`, including sub-categories such as Jewelry › Pendants) **or** with an SKU starting `J-` (e.g. `J-10060`). These appear in the glass gallery and never in hair care. Optional “Collection”, “Size” and “Shape” attributes refine the cards; otherwise the sub-category name is used as the collection. Override with `WC_JEWELRY_CATEGORY` / `WC_JEWELRY_SKU_PREFIX`.
   - **Pagination:** every listing requests `per_page=100` and follows `X-WP-TotalPages`, up to 5,000 items.
   - **Photos:** the first gallery image, ideally 4:5 portrait.
4. (Recommended) Add webhooks for **Product created / updated / deleted** that point to `https://<site>/api/revalidate`, with the secret set to `WC_WEBHOOK_SECRET`. Price and stock edits then appear immediately. Without webhooks, pages refresh every 5 minutes.

### Product pages & collection heroes
- **`/product/[slug]`** (WooCommerce slug) renders the full product. It shows the gallery, brand or collection, SKU, price (with sale and stock state), the sanitized WooCommerce description, details, a quantity stepper, Add to Bag and related items. It also includes Product JSON-LD for search engines. Every product and pendant card links here, and Quick add / Quick view remain as shortcuts.
- **Variable products** are bought on the product page. Shoppers pick options (unavailable combinations are struck through), and the chosen variation's price, stock and image are used. Checkout sends `variation_id` to WooCommerce.
- Pages render on first request and are cached with the catalog: 5-minute ISR, refreshed immediately by the product webhook.
- **Collection heroes** on brand pages, `/products/hair-care` and `/jewelry` are mosaics of that collection's real WooCommerce photos (in-stock and featured first). The illustrated scene is only a fallback when no product has a photo. For the best result, give each product a high-resolution, preferably 4:5, first image.

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

## Concierge, booking & newsletter

**AI Beauty & Jewelry Concierge.** A floating *Concierge* button (in `app/layout.tsx`) opens a drawer with two tabs. The drawer's code loads only on first open.

- **Ask** chats about hair routines across the store's brands, dichroic glass picks and gift or styling ideas, and Cynthia's story.
  - `POST /api/concierge` streams the reply from Claude, grounded in the live catalog and the editorial facts in `lib/data.ts`. The catalog section of the prompt is prompt-cached.
  - Replies reference items with `[[product:slug]]` markers, which render as cards linking to `/product/[slug]`. `[[book]]` opens booking and `[[newsletter]]` opens the sign-up.
  - Without `ANTHROPIC_API_KEY`, or if the API errors, a rule-based guide in `lib/concierge-server.ts` answers instead, so the widget never breaks.
  - The endpoint is rate-limited per IP, and the history and message length are capped.
- **Book a cut** is a three-step haircut package request: package, preferred day and time window (plus studio), then contact details and notes. It ends with a confirmation and reference number.
  - Packages are built from `serviceGroups` in `lib/booking.ts`, so prices match `/hair-styling`.
  - `POST /api/booking` validates the request (with a honeypot and rate limit). It then sends it to `BOOKING_WEBHOOK_URL` and/or emails the studio through Resend, and logs it when neither is configured.
- Open the concierge from anywhere with `openConcierge({ tab: 'book' })` from `lib/concierge.ts`. `BookPackageButton` on `/hair-styling` does this.

**Newsletter popup** (`components/newsletter/NewsletterPopup.tsx`).

- Opens automatically once per session, after 25 seconds, at 45% scroll depth, or on exit intent on desktop. Nothing triggers it in the first 4 seconds, on `/checkout`, or while another overlay is open.
- Dismissing it is remembered for the session, and subscribing is remembered on the device. `openNewsletter()` from `lib/newsletter.ts` opens it any time.
- The popup and the footer form both post to `POST /api/newsletter`, which adds the contact to a Resend audience (`RESEND_AUDIENCE_ID`) and/or forwards it to `NEWSLETTER_WEBHOOK_URL`.

**Instagram.** `components/ui/InstagramLink.tsx` links to `site.instagram` (`@synergy44llc`), always with `target="_blank"` and `rel="noopener noreferrer"`. It appears on Home (glass studio), About (Meet Cynthia), `/jewelry` (commissions) and in the footer.

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

## Design system: "thin film"

The visual identity comes from the subject. Dichroic glass shows one color by reflection and another by transmission, so its color changes with the viewing angle. That effect is the site's single bold device. Everything else stays quiet.

- **Signature:** `.film` is a conic interference gradient whose hue rotates with `--film-angle`. On the home hero it rims Cynthia's portrait, cut as a `.cabochon` (the oval pendants are shaped to), and turns as the page scrolls (`.film-scroll`, a CSS scroll timeline with no JS). Use it only on glass-related elements: the hero rim, the wordmark's "44", the concierge button and the newsletter panel. Don't spread it to general UI.
- **Palette** (`tailwind.config.ts`):
  - `mineral #EFF0EB` page base (cool, not cream)
  - `ink #1E2D27` rosemary text and dark surfaces
  - `paper #FAFAF7`, `line #D5D9D2`
  - `sage-dark #3A5A4B` for labels
  - `iris #5B4BC4`, the one accent (links, focus, active nav)
  - `kiln #141418`, the dark ground the glass is shown on
  - `forest #16201C` for the footer
- **Type:**
  - Familjen Grotesk for headlines and interface, set tight (`-0.03em`) in sentence case.
  - Newsreader (optical sizes) for reading text: intros (`.lead`), descriptions (`.body-serif`, `.prose-s44`), quotes.
  - The scale is 1.25 from 16px.
  - Labels (`.label`) are 13px sentence case: no tracked all-caps, no eyebrow rules, no single-word italic accents.
- **Shape:** controls are pills (`.btn-*`, `.chip`, inputs at 10px), media frames are `rounded-media` (10px), and glass sits in `.cabochon` ovals. Radius follows what a thing is.
- **Structure:**
  - Section headers are a headline plus an optional serif intro (`SectionHeader`). There are no section numbers.
  - Numbers appear only where the content is a real sequence: how a pendant is made, what happens at a visit.
  - Meta text uses commas, not "A · B" strings. Buttons and links carry no arrows.
- **Motion:**
  - Sections don't fade in as you scroll (`Reveal` is now a plain wrapper).
  - The only automatic motion is the hero's opening sequence (`.intro`, `.intro-film`) and the film turning on scroll.
  - Interaction motion (drawers, dialogs, button presses) stays.
  - Everything is compositor-only and respects `prefers-reduced-motion`.
- **Imagery:** real photography first: Cynthia's portrait, plus WooCommerce product photos via `CollectionHero` and the product cards. `StudioScene` draws a plain product stand-in only when no photo exists. Pass `src` to use a photo:

  ```tsx
  <StudioScene src="/images/loma-leave-in.jpg" alt="Loma Leave-In Conditioner" className="aspect-[4/5]" />
  ```

## Before launch — content to confirm

All of these are placeholders and are flagged in the data files:

- **Products & jewelry** come from WooCommerce once connected. The demo catalog in `lib/data.ts` is only for development.
- **Services** (`lib/data.ts` → `serviceGroups`) — prices and durations.
- **Testimonials** — the site shows the first two entries in `testimonials` (Lisa Mary, Ru Knoedler). Confirm the wording with each client before launch.
- **Guarantee and biography wording** — confirm with Cynthia.
- **Imagery** — scenes, packshots and pendants are drawn in code. Pass real photos to `StudioScene` via `src` (see above), and replace `ProductVisual` / `PendantVisual` with `next/image` once product photography exists.
- **Checkout** — test a full order on a staging store or with a 100%-off coupon before launch. Confirm the shipping line and the payment gateways on the Pay for order page.
- **Newsletter** — set `RESEND_AUDIENCE_ID` or `NEWSLETTER_WEBHOOK_URL` so sign-ups reach your list (they are only logged until then).
- **Booking** — set `BOOKING_WEBHOOK_URL` and/or the Resend variables so booking requests reach the studio. Confirm the package names and prices in `lib/booking.ts`.
- **Concierge** — add `ANTHROPIC_API_KEY` in Vercel to switch from guided suggestions to AI answers.
- **Contact email** — `site.contactEmail` in `lib/site.ts` is shown on `/contact` only once set.

## Deploying

Works on Vercel with zero config. Add the variables from `.env.local.example` under Project → Settings → Environment Variables (Production and Preview), then redeploy.
