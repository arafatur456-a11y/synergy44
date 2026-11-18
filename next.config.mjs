/**
 * Remote image hosts for next/image. The WooCommerce host (NEXT_PUBLIC_WC_STORE_URL) is added
 * automatically so product photos from the store render without extra config.
 * Add other CDNs (e.g. Cloudinary, Jetpack's i0.wp.com) to EXTRA_IMAGE_HOSTS.
 */
const EXTRA_IMAGE_HOSTS = ['synergy44.com', 'www.synergy44.com', 'i0.wp.com'];

const patterns = new Map(EXTRA_IMAGE_HOSTS.map((h) => [h, { protocol: 'https', hostname: h, pathname: '/**' }]));
const storeUrl = process.env.NEXT_PUBLIC_WC_STORE_URL || process.env.WC_STORE_URL;
if (storeUrl) {
  try {
    const u = new URL(storeUrl);
    patterns.set(u.hostname, { protocol: u.protocol.replace(':', ''), hostname: u.hostname, port: u.port, pathname: '/**' });
  } catch {
    console.warn('NEXT_PUBLIC_WC_STORE_URL is not a valid URL');
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [...patterns.values()],
  },
};

export default nextConfig;
