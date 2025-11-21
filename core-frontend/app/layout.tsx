import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tochka Rosta',
  description: 'Платформа для цифрового бизнеса',
  icons: {
    icon: '/icon.svg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#00C742',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
  // Cross-browser compatibility
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:7000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}



