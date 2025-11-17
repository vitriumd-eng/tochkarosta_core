import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Modular SaaS Platform',
  description: 'Создайте свой интернет-магазин за считанные минуты',
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
