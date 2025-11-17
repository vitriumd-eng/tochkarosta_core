/**
 * Platform Dashboard Layout
 * Dashboard for managing platform landing page content
 */
import { ReactNode } from 'react'

export default function PlatformDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {children}
    </div>
  )
}

