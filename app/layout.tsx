import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { CartProvider } from '@/lib/cart';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  style: ['normal', 'italic'],
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Synergy 44 — Organic Hair Care & Dichroic Glass Art',
  description:
    'Premium organic, vegan hair care from Loma, MKS eco, Olaplex and Neuma, handmade dichroic glass jewelry by Cynthia Reedy, and professional salon services in Michigan & California.',
  openGraph: {
    title: 'Synergy 44',
    description: 'Healthy hair. Living light. Organic hair care & handmade dichroic glass art.',
    url: 'https://synergy44.com',
    siteName: 'Synergy 44',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#060807',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain">
        <CartProvider>
          <SmoothScroll />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
