import ProtectedRoute from '../components/ProtectedRoute'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAuth requireSuperuser>
      {children}
    </ProtectedRoute>
  )
}







