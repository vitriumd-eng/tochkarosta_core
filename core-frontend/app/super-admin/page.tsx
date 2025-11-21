'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Tariff {
  id: string
  name: string
  price_monthly: number
  subdomain_limit: number
  is_active: boolean
}

export default function SuperAdminPage() {
  const router = useRouter()
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    fetchTariffs(token)
  }, [router])

  const fetchTariffs = async (token: string) => {
    try {
      const res = await fetch('/api/billing/tariffs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push('/')
          return
        }
        throw new Error('Failed to fetch tariffs')
      }

      const data = await res.json()
      setTariffs(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Тарифы</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена/мес</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Лимит поддоменов</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tariffs.map((tariff) => (
                  <tr key={tariff.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tariff.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{tariff.price_monthly} ₽</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{tariff.subdomain_limit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${tariff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tariff.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Управление платформой</h2>
          <div className="space-y-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Управление пользователями
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-4">
              Управление модераторами
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ml-4">
              Настройки платформы
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



