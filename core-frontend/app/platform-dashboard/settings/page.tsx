/**
 * Platform Dashboard - Settings Page
 * Manage platform settings like Telegram Bot ID
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformDashboardSidebar from '@/components/PlatformDashboardSidebar'

export default function SettingsPage() {
  const router = useRouter()
  const [telegramBotId, setTelegramBotId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/platform/content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/platform-dashboard/login')
          return
        }
        throw new Error('Failed to load settings')
      }

      const data = await response.json()
      const telegramSettings = data.telegram_settings?.content
      
      if (telegramSettings?.bot_id) {
        setTelegramBotId(telegramSettings.bot_id)
      }
    } catch (err: any) {
      console.error('Load settings error:', err)
      setError(err.message || 'Не удалось загрузить настройки')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!telegramBotId.trim()) {
      setError('Введите Telegram Bot ID')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/platform/content/telegram_settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: {
            bot_id: telegramBotId.trim()
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Не удалось сохранить настройки')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Save settings error:', err)
      setError(err.message || 'Не удалось сохранить настройки')
    } finally {
      setSaving(false)
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <PlatformDashboardSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Настройки платформы</h1>
            <p className="text-gray-600">
              Управление настройками платформы
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <p className="font-semibold text-red-900">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <p className="font-semibold text-green-900">Настройки успешно сохранены!</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Telegram настройки</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="telegramBotId" className="block text-sm font-semibold text-gray-700 mb-2">
                  Telegram Bot ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="telegramBotId"
                  value={telegramBotId}
                  onChange={(e) => setTelegramBotId(e.target.value)}
                  placeholder="7957859728"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Bot ID - это числовая часть до двоеточия в токене бота (например, из токена <code className="bg-gray-100 px-1 rounded">7957859728:AAG_...</code> bot_id = <code className="bg-gray-100 px-1 rounded">7957859728</code>)
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !telegramBotId.trim()}
                className={`w-full px-6 py-3 font-bold rounded-xl transition-colors ${
                  telegramBotId.trim() && !saving
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {saving ? 'Сохранение...' : 'Сохранить настройки'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


