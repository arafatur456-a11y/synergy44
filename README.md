# Synergy 44 — Immersive Landing Page

Next.js 15 (App Router) · React 19 · Tailwind CSS 3 · Framer Motion · GSAP + ScrollTrigger · React Three Fiber · Lenis

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

### Starting from a fresh Next.js app instead

```bash
npx create-next-app@latest synergy44 --typescript --tailwind --app --eslint
cd synergy44
npm install framer-motion gsap @gsap/react lenis three @react-three/fiber lucide-react
npm install -D @types/three
```
Then copy `app/`, `components/`, `lib/` and `tailwind.config.ts` into the project.
(If create-next-app scaffolds Tailwind v4, either pin `tailwindcss@3` or port the config's theme tokens to `@theme` in CSS.)

## Structure

```
app/
  layout.tsx            fonts (Fraunces + Manrope), CartProvider, Lenis smooth scroll
  page.tsx              section composition
  globals.css           glass / gradient / dichroic-sheen utilities, grain overlay
components/
  Hero.tsx              split-word headline, scroll-depth parallax, mouse-reactive glass cards
  ParticleField.tsx     R3F particle cosmos + wireframe gem (lazy-loaded, paused off-screen)
  ProductShowcase.tsx   "Hair Care Elite" — animated filter tabs + 3D tilt cards
  TiltCard.tsx          reusable spring-based 3D tilt with cursor glare
  ProductVisual.tsx     SVG bottle illustrations (placeholder for product photos)
  GlassGallery.tsx      GSAP pinned horizontal scroll, cards swing in from depth
  PendantVisual.tsx     CSS dichroic pendant with pointer-tracked shimmer
  QuickViewModal.tsx    portal modal (Esc / backdrop close, scroll lock)
  Story.tsx             "The Hair Healers" alternating timeline with scroll-filled spine
  Testimonials.tsx      swipeable auto-advancing carousel with glowing stars
  BrandMarquee.tsx, Navbar.tsx, Footer.tsx
lib/
  data.ts               ALL content (products, pendants, milestones, reviews)
  cart.tsx              minimal cart context + toast
```

## Performance & accessibility notes
- WebGL is loaded with `next/dynamic({ ssr:false })`, never blocks LCP, and its render loop stops when the hero leaves the viewport.
- `prefers-reduced-motion` disables the particle field, Lenis, GSAP pinning (gallery falls back to native swipe) and tilt.
- On < 768px the gallery uses native CSS scroll-snap instead of pinning.
- Keyboard focus rings, aria labels on icon buttons, `role="dialog"` modal, `aria-live` carousel/toast.

## Before launch
- **Content in `lib/data.ts` is placeholder**: prices, sizes, pendant names, and testimonial quotes. Replace with real WooCommerce data and clients' verbatim reviews.
- Verify the timeline copy (Eastern Michigan University, cosmetology journals) with Cynthia.
- Swap `ProductVisual` / `PendantVisual` / Story gradient blocks for `next/image` photos.
- Wire `useCart().add` to the WooCommerce Store API (or headless Shopify) and the newsletter form to your ESP.
