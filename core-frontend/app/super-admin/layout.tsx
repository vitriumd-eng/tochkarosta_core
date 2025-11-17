/**
 * Super Admin Dashboard Layout
 * Dashboard for platform and core administration (Founder)
 */
import { ReactNode } from 'react'

export default function SuperAdminLayout({
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




