'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VKCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam) {
      setStatus('error')
      setError(errorDescription || errorParam || 'Ошибка авторизации VK')
      return
    }

    if (!code) {
      setStatus('error')
      setError('Код авторизации не получен')
      return
    }

    // Call backend to exchange code for tokens
    const handleVKCallback = async () => {
      try {
        const response = await fetch('/api/auth/oauth/vk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.error || 'Ошибка авторизации')
        }

        const data = await response.json()

        // Save tokens
        if (data.access_token) {
          localStorage.setItem('token', data.access_token)
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        }
        if (data.tenant_id) {
          localStorage.setItem('tenant_id', data.tenant_id)
        }
        if (data.user_id) {
          localStorage.setItem('user_id', data.user_id)
        }

        setStatus('success')

        // Redirect to module selection
        setTimeout(() => {
          router.push(`/select-module?tenant=${data.tenant_id}`)
        }, 1500)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
        setError(message)
        setStatus('error')
      }
    }

    handleVKCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #00C742 0%, #00B36C 29%, #0082D6 93%, #007DE3 100%)'
    }}>
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-4">Авторизация VK...</h2>
              <p className="text-gray-600">Пожалуйста, подождите</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-green-600">Успешная авторизация!</h2>
              <p className="text-gray-600 mb-6">Перенаправление...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-600">Ошибка авторизации</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/register')}
                  className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Вернуться к регистрации
                </button>
                <Link
                  href="/register"
                  className="block w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors text-center"
                >
                  Попробовать снова
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

