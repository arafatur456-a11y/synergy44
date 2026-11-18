/**
 * Remote image hosts for next/image. The WooCommerce host (WC_STORE_URL) is added
 * automatically so product photos from the store render without extra config.
 * Add other CDNs (e.g. Cloudinary) to EXTRA_IMAGE_HOSTS below.
 */
const EXTRA_IMAGE_HOSTS = ['synergy44.com', 'www.synergy44.com'];

const hosts = new Set(EXTRA_IMAGE_HOSTS);
if (process.env.WC_STORE_URL) {
  try {
    hosts.add(new URL(process.env.WC_STORE_URL).hostname);
  } catch {
    console.warn('WC_STORE_URL is not a valid URL');
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
    remotePatterns: [...hosts].map((hostname) => ({ protocol: 'https', hostname, pathname: '/**' })),
  },
};

export default nextConfig;
