'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformDashboardSidebar from '@/components/dashboard/PlatformDashboardSidebar'

interface User {
  id: string
  phone: string
  first_name: string
  last_name: string
  role: string
  is_superuser: boolean
}

export default function DashboardPlatformPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/dashboard-platform/login')
      return
    }

    fetchUserData(token)
  }, [router])

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token')
          router.push('/dashboard-platform/login')
          return
        }
        throw new Error('Failed to fetch user data')
      }

      const userData = await res.json()
      
      // Проверяем роль
      if (userData.role !== 'master' && !userData.is_superuser) {
        localStorage.removeItem('token')
        router.push('/dashboard-platform/login')
        return
      }
      
      setUser(userData)
    } catch (e: any) {
      console.error('Error fetching user data:', e)
      setError(e.message || 'Произошла ошибка при загрузке данных')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl text-gray-600">Загрузка...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-300 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              const token = localStorage.getItem('token')
              if (token) {
                fetchUserData(token)
              } else {
                router.push('/dashboard-platform/login')
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition shadow-lg"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <PlatformDashboardSidebar 
        user={{
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Platform Master'
        }}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Управление платформеной страницей</h1>
            <p className="text-gray-600">
              Управляйте всем контентом платформенной страницы
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* SEO Settings */}
            <Link
              href="/dashboard-platform/seo"
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">🔍</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">SEO</div>
              </div>
              <div className="text-2xl font-bold mb-2">SEO Настройки</div>
              <div className="text-blue-100 text-sm">Управление мета-тегами и ключевыми словами</div>
            </Link>

            {/* News Management */}
            <Link
              href="/dashboard-platform/news"
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">📰</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Новости</div>
              </div>
              <div className="text-2xl font-bold mb-2">Новости</div>
              <div className="text-green-100 text-sm">Публикация и редактирование новостей</div>
            </Link>

            {/* Content Management */}
            <Link
              href="/dashboard-platform/content"
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">📝</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Контент</div>
              </div>
              <div className="text-2xl font-bold mb-2">Контент</div>
              <div className="text-purple-100 text-sm">Управление статическим контентом</div>
            </Link>

            {/* Analytics */}
            <Link
              href="/dashboard-platform/analytics"
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">📊</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Аналитика</div>
              </div>
              <div className="text-2xl font-bold mb-2">Аналитика</div>
              <div className="text-orange-100 text-sm">Просмотр общей статистики платформы</div>
            </Link>

            {/* Settings */}
            <Link
              href="/dashboard-platform/settings"
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">⚙️</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Настройки</div>
              </div>
              <div className="text-2xl font-bold mb-2">Настройки</div>
              <div className="text-indigo-100 text-sm">Общие настройки платформы</div>
            </Link>

            {/* View Platform */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">👁️</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Просмотр</div>
              </div>
              <div className="text-2xl font-bold mb-2">Просмотр платформы</div>
              <div className="text-teal-100 text-sm">Открыть публичную страницу платформы</div>
            </a>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard-platform/modules"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition group"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                🧩
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Модули</h3>
              <p className="text-gray-600 text-sm">Управление модулями платформы</p>
            </Link>

            <Link
              href="/dashboard-platform/settings"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition group"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                ⚙️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Настройки</h3>
              <p className="text-gray-600 text-sm">Общие настройки платформы</p>
            </Link>

            <Link
              href="/dashboard-platform/analytics"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition group"
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Аналитика</h3>
              <p className="text-gray-600 text-sm">Статистика и метрики</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
