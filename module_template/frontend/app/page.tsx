'use client'
/**
 * Шаблон Frontend для модуля
 * 
 * ЗАМЕНИТЕ:
 * - MODULE_NAME на название вашего модуля
 * - MODULE_PORT на порт frontend (5001, 5002, и т.д.)
 */

import { useEffect, useState } from 'react'

const MODULE_NAME = "MODULE_NAME"
const MODULE_PORT = 5001  // ИЗМЕНИТЕ на уникальный порт

export default function ModulePage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // В продакшене используйте относительные пути через Gateway
      // const res = await fetch('/api/data')
      const res = await fetch(`http://localhost:${MODULE_PORT + 3000}/api/data`, {
        headers: {
          // TODO: Получить токен из Core (через Gateway)
          // 'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await res.json()
      setData(result.data || [])
    } catch (e: any) {
      setError(e.message)
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Ошибка: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold">{MODULE_NAME}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Данные модуля</h2>
          
          {data.length === 0 ? (
            <p className="text-gray-500">Нет данных</p>
          ) : (
            <ul className="space-y-2">
              {data.map((item, index) => (
                <li key={index} className="p-3 border rounded">
                  {JSON.stringify(item)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}



