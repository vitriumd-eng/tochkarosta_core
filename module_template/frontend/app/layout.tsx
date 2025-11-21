import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MODULE_NAME - Tochka Rosta',
  description: 'MODULE_DESCRIPTION',
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



