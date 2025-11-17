import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Дашборд - Магазин',
  description: 'Административная панель магазина',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}



