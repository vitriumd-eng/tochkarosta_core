/**
 * Super Admin Dashboard - Main Page
 * Dashboard for founder to manage platform, users, and tariffs
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  phone: string
  role: string | null
  phone_verified: boolean
  created_at: string | null
}

interface Tariff {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular: boolean
  active: boolean
}

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'tariffs'>('users')
  const [editingTariff, setEditingTariff] = useState<string | null>(null)
  const [tariffForm, setTariffForm] = useState<Partial<Tariff>>({})

  useEffect(() => {
    const init = async () => {
      const authOk = await checkAuth()
      if (authOk) {
        if (activeTab === 'users') {
          loadUsers()
        } else {
          loadTariffs()
        }
      }
    }
    init()
  }, [activeTab])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/super-admin/users', {
        credentials: 'include',
      })
      if (response.status === 401 || response.status === 403) {
        router.push('/super-admin/login')
        return false
      }
      return true
    } catch (err) {
      console.error('Auth check error:', err)
      router.push('/super-admin/login')
      return false
    }
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/super-admin/users', {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/super-admin/login')
          return
        }
        throw new Error('Failed to load users')
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (err: any) {
      console.error('Load users error:', err)
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const loadTariffs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/super-admin/tariffs', {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/super-admin/login')
          return
        }
        throw new Error('Failed to load tariffs')
      }

      const data = await response.json()
      setTariffs(data.tariffs || [])
    } catch (err: any) {
      console.error('Load tariffs error:', err)
      setError(err.message || 'Failed to load tariffs')
    } finally {
      setLoading(false)
    }
  }

  const handleActivateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/super-admin/users/${userId}/activate`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to activate user')
      }

      await loadUsers()
    } catch (err: any) {
      setError(err.message || 'Failed to activate user')
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/super-admin/users/${userId}/deactivate`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to deactivate user')
      }

      await loadUsers()
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate user')
    }
  }

  const handleEditTariff = (tariff: Tariff) => {
    setEditingTariff(tariff.id)
    setTariffForm(tariff)
  }

  const handleSaveTariff = async (tariffId: string) => {
    try {
      const response = await fetch(`/api/super-admin/tariffs/${tariffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(tariffForm),
      })

      if (!response.ok) {
        throw new Error('Failed to update tariff')
      }

      setEditingTariff(null)
      setTariffForm({})
      await loadTariffs()
    } catch (err: any) {
      setError(err.message || 'Failed to update tariff')
    }
  }

  const handleCancelEdit = () => {
    setEditingTariff(null)
    setTariffForm({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                👑
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Super Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Управление платформой и ядром
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                fetch('/api/super-admin/logout', { method: 'POST', credentials: 'include' })
                router.push('/super-admin/login')
              }}
              className="px-6 py-3 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 text-base font-semibold rounded-t-xl transition ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            👥 Пользователи
          </button>
          <button
            onClick={() => setActiveTab('tariffs')}
            className={`px-6 py-3 text-base font-semibold rounded-t-xl transition ${
              activeTab === 'tariffs'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            💳 Тарифы
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="text-sm font-semibold text-red-900">{error}</div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden">
            <div className="p-6 border-b-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Управление пользователями
              </h2>
              <p className="text-gray-600 mt-1">
                Всего пользователей: {users.length}
              </p>
            </div>
            {loading ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <div className="text-gray-600">Загрузка...</div>
              </div>
            ) : (
              <div className="divide-y-2 divide-gray-200">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-6 hover:bg-gray-50 transition flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          {user.phone[0] || '?'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {user.phone}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-600">
                              Роль: <span className="font-semibold">{user.role || 'user'}</span>
                            </span>
                            {user.phone_verified && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                                ✓ Verified
                              </span>
                            )}
                            {user.created_at && (
                              <span className="text-xs text-gray-500">
                                Создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleActivateUser(user.id)}
                        className="px-4 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition"
                      >
                        ✓ Активировать
                      </button>
                      <button
                        onClick={() => handleDeactivateUser(user.id)}
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"
                      >
                        ✗ Деактивировать
                      </button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    Пользователи не найдены
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tariffs Tab */}
        {activeTab === 'tariffs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full p-12 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <div className="text-gray-600">Загрузка...</div>
              </div>
            ) : (
              tariffs.map((tariff) => (
                <div
                  key={tariff.id}
                  className={`bg-white rounded-2xl shadow-md border-2 overflow-hidden ${
                    tariff.popular
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-gray-200'
                  }`}
                >
                  {tariff.popular && (
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2 text-sm font-bold">
                      ⭐ Популярный
                    </div>
                  )}
                  <div className="p-6">
                    {editingTariff === tariff.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          value={tariffForm.name || ''}
                          onChange={(e) =>
                            setTariffForm({ ...tariffForm, name: e.target.value })
                          }
                          placeholder="Название"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={tariffForm.price || ''}
                            onChange={(e) =>
                              setTariffForm({ ...tariffForm, price: e.target.value })
                            }
                            placeholder="Цена"
                          />
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={tariffForm.period || ''}
                            onChange={(e) =>
                              setTariffForm({ ...tariffForm, period: e.target.value })
                            }
                            placeholder="Период"
                          />
                        </div>
                        <textarea
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          value={tariffForm.description || ''}
                          onChange={(e) =>
                            setTariffForm({ ...tariffForm, description: e.target.value })
                          }
                          placeholder="Описание"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveTariff(tariff.id)}
                            className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                          >
                            Сохранить
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {tariff.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-gray-900">
                            {tariff.price}
                          </span>
                          <span className="text-gray-600 ml-2">₽/{tariff.period}</span>
                        </div>
                        <p className="text-gray-600 mb-6">{tariff.description}</p>
                        <ul className="space-y-2 mb-6">
                          {tariff.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={tariff.active}
                              readOnly
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Активен</span>
                          </label>
                          <button
                            onClick={() => handleEditTariff(tariff)}
                            className="px-4 py-2 text-sm font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
                          >
                            Редактировать
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            {tariffs.length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-500">
                Тарифы не найдены
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

