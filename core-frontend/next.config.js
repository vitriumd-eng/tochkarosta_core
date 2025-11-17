const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Port configuration handled by package.json scripts
  // Port 7000: public platform
  // Port 7001: auth + dashboard
  // Port 7002: super-admin
  
  // Use different dist directories for different ports to avoid conflicts
  distDir: process.env.NEXT_DIST_DIR || '.next',
  
  // TypeScript: modules are separate projects, loaded dynamically
  // Module type checking errors should not block core build
  // Modules are excluded from tsconfig.json and webpack resolves them at runtime only
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  
  // Configure webpack to resolve modules from project root
  webpack: (config, { isServer }) => {
    // Add modules directory to webpack resolve for runtime dynamic imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@modules': path.resolve(__dirname, '../modules'),
    }
    
    // Add project root to modules resolution
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '..'),
    ]
    
    return config
  },
}

module.exports = nextConfig

