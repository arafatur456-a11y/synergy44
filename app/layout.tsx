import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/shop/CartDrawer';
import { site } from '@/lib/site';

// Self-hosted variable fonts (Fontsource): Playfair Display (high-contrast serif) + Inter Tight (grotesque).
const display = localFont({
  src: [
    { path: '../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2', weight: '400 900', style: 'normal' },
    { path: '../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

const sans = localFont({
  src: [
    { path: '../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-italic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Synergy 44 — Organic Hair Care & Dichroic Glass Art',
    template: '%s · Synergy 44',
  },
  description:
    'Organic, vegan hair care from Loma, MKS Eco, Olaplex and Neuma, professional salon services in Michigan & California, and handmade dichroic glass jewelry by Cynthia Reedy.',
  openGraph: {
    siteName: 'Synergy 44',
    type: 'website',
    url: site.url,
  },
};

export const viewport: Viewport = {
  themeColor: '#F5F1EA',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Adds `js` before first paint so scroll-reveal styles apply only when JS can reveal them */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-espresso focus:px-5 focus:py-3 focus:text-cream">
          Skip to content
        </a>
        <CartProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
