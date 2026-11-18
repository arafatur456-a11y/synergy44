/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tree-shake icon + animation libraries for smaller client bundles
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    // Add your WordPress / WooCommerce media host when wiring real product photos
    remotePatterns: [{ protocol: 'https', hostname: 'synergy44.com' }],
  },
};

export default nextConfig;
