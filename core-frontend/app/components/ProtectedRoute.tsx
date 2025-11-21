'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireSuperuser?: boolean
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireSuperuser = false
}: ProtectedRouteProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    
    if (!token && requireAuth) {
      router.push('/')
      return
    }

    if (token && requireSuperuser) {
      try {
        // TODO: Проверить, является ли пользователь суперпользователем
        // const res = await fetch('/api/auth/me')
        // const user = await res.json()
        // if (!user.is_superuser) {
        //   router.push('/dashboard-platform')
        //   return
        // }
      } catch (e) {
        console.error('Auth check failed:', e)
        router.push('/')
        return
      }
    }

    setAuthorized(true)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Проверка доступа...</div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}



