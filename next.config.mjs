// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Temporarily ignore build errors for deployment
    ignoreBuildErrors: true,
  },
  // Performance Optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      'recharts', 
      'date-fns', 
      'lodash'
    ],
    // React Compiler - Experimental, boosts runtime perf
    // reactCompiler: true, // Uncomment if you want to try experimental React Compiler
  },
  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compression & Caching
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

