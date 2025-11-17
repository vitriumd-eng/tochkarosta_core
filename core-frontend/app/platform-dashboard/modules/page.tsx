/**
 * Platform Dashboard - Modules Management Page
 * Manage available modules for the platform
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformDashboardSidebar from '@/components/PlatformDashboardSidebar'

interface Module {
  id: string
  name: string
  description: string
  version: string
  enabled: boolean
  installed: boolean
}

export default function ModulesPage() {
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/modules/list', {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/platform-dashboard/login')
          return
        }
        throw new Error('Failed to load modules')
      }

      const data = await response.json()
      setModules(data.modules || [])
    } catch (err: any) {
      console.error('Load modules error:', err)
      setError(err.message || 'Failed to load modules')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleModule = async (moduleId: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/modules/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          module_id: moduleId,
          enabled: !enabled,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle module')
      }

      await loadModules()
    } catch (err: any) {
      setError(err.message || 'Failed to toggle module')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PlatformDashboardSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Управление модулями
            </h1>
            <p className="text-gray-600">
              Подключайте и отключайте модули платформы
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="text-sm font-semibold text-red-900">{error}</div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-12 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <div className="text-gray-600">Загрузка модулей...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`bg-white rounded-2xl shadow-md border-2 overflow-hidden transition ${
                    module.enabled
                      ? 'border-green-500 ring-2 ring-green-200'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {module.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Версия: {module.version}</span>
                          {module.installed && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                              Установлен
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={module.enabled}
                          onChange={() => handleToggleModule(module.id, module.enabled)}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          {module.enabled ? 'Включен' : 'Выключен'}
                        </span>
                      </label>
                      {module.enabled && (
                        <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                          ✓ Активен
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {modules.length === 0 && (
                <div className="col-span-full p-12 text-center text-gray-500">
                  Модули не найдены
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}




