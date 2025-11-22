/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // В продакшене настройте проксирование к backend модуля
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:8001/api/:path*`, // ИЗМЕНИТЕ на порт backend модуля
      },
    ]
  },
}

module.exports = nextConfig







