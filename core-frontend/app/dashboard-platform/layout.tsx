'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardPlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    
    // Если нет токена и мы не на странице логина, перенаправляем на логин
    if (!token && pathname !== '/dashboard-platform/login') {
      router.push('/dashboard-platform/login')
      return
    }
    
    // Если есть токен, проверяем роль
    if (token) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (res.ok) {
          const userInfo = await res.json()
          
          // Проверяем роль master или superuser
          if (userInfo.role !== 'master' && !userInfo.is_superuser) {
            // Если не модератор, перенаправляем на логин
            if (pathname !== '/dashboard-platform/login') {
              localStorage.removeItem('token')
              router.push('/dashboard-platform/login')
            }
            setChecking(false)
            return
          }
          
          // Если модератор и на странице логина, перенаправляем на дашборд
          if (pathname === '/dashboard-platform/login') {
            router.push('/dashboard-platform')
            return
          }
        } else {
          // Токен невалиден
          if (pathname !== '/dashboard-platform/login') {
            localStorage.removeItem('token')
            router.push('/dashboard-platform/login')
          }
        }
      } catch (e) {
        console.error('Auth check failed:', e)
        if (pathname !== '/dashboard-platform/login') {
          localStorage.removeItem('token')
          router.push('/dashboard-platform/login')
        }
      }
    }
    
    setChecking(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl text-gray-600">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {children}
    </div>
  )
}

