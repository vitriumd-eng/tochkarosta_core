'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function PlatformDashboardLogin() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const normalizePhone = (phone: string): string => {
    let normalized = phone.replace(/[\s\-]/g, '')
    
    if (normalized.startsWith('+7')) {
      normalized = normalized.substring(2)
    } else if (normalized.startsWith('7')) {
      normalized = normalized.substring(1)
    } else if (normalized.startsWith('8')) {
      normalized = normalized.substring(1)
    }
    
    if (normalized.length === 10 && /^\d+$/.test(normalized)) {
      return `+7${normalized}`
    }
    
    return phone
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const normalizedPhone = normalizePhone(login)
      
      const response = await fetch('/api/auth/login-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: normalizedPhone, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid login or password')
      }
      
      // Проверяем роль пользователя
      const userInfoRes = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (userInfoRes.ok) {
        const userInfo = await userInfoRes.json()
        
        // Проверяем, что пользователь имеет роль master
        if (userInfo.role !== 'master' && !userInfo.is_superuser) {
          throw new Error('Доступ запрещен. Требуется роль модератора.')
        }
        
        localStorage.setItem('token', data.access_token)
        router.push('/dashboard-platform')
      } else {
        localStorage.setItem('token', data.access_token)
        router.push('/dashboard-platform')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-xl">
              🏢
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Platform Dashboard
          </h2>
          <p className="text-gray-600">
            Управление платформеной страницей
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="text-sm font-semibold text-red-900">{error}</div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="login" className="block text-sm font-semibold text-gray-700 mb-2">
                  Логин (номер телефона)
                </label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  placeholder="+7 (999) 123-45-67"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="text-xl">⏳</span>
                  <span>Вход...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>🚪</span>
                  <span>Войти</span>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
