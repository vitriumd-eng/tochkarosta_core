/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use distDir from environment variable, default to .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Compiler options for better cross-browser compatibility
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Add polyfills for better cross-browser support
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
  // Headers for better cross-browser compatibility
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig

