'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { checkSubdomain, activateModule, activateModuleNew } from '@/lib/api/register'

interface Module {
  id: string
  name: string
  description: string
  version: string
  themes?: string[]
}

export default function SelectModulePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Use tenant_id from localStorage if available, otherwise from URL
  const tenantId = typeof window !== 'undefined' 
    ? (localStorage.getItem('tenant_id') || searchParams.get('tenant'))
    : searchParams.get('tenant')

  const [module, setModule] = useState<string>('')
  const [modules, setModules] = useState<Module[]>([])
  const [subdomain, setSubdomain] = useState('')
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загружаем модули при монтировании
  useEffect(() => {
    async function loadModules() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Токен не найден. Пожалуйста, войдите снова.')
          return
        }

        const res = await fetch('/api/modules/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          // Backend returns {modules: [...]}, extract the array
          const modulesList = data.modules || data || []
          setModules(modulesList)
          if (modulesList.length > 0 && !module) {
            setModule(modulesList[0].id)
          }
        } else {
          const errorData = await res.json().catch(() => ({}))
          setError(errorData.error || 'Не удалось загрузить список модулей')
        }
      } catch (err) {
        console.error('Failed to load modules:', err)
        setError('Не удалось загрузить список модулей')
      }
    }
    loadModules()
  }, [])

  // Проверка доступности поддомена
  useEffect(() => {
    if (subdomain && subdomain.length >= 3) {
      const timer = setTimeout(async () => {
        try {
          const result = await checkSubdomain(subdomain)
          setSubdomainAvailable(result.available)
        } catch (err) {
          setSubdomainAvailable(false)
        }
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setSubdomainAvailable(null)
    }
  }, [subdomain])

  const handleActivateModule = async () => {
    if (!module || !subdomain) {
      setError('Пожалуйста, выберите модуль и введите поддомен')
      return
    }

    if (subdomainAvailable === false) {
      setError('Поддомен недоступен')
      return
    }

    if (!tenantId) {
      setError('Не указан tenant_id')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Use new activation flow with internal registration
      const result = await activateModuleNew({
        tenant_id: tenantId!,
        module: module,
        plan: 'basic',
        subdomain: subdomain,
      })

      // Перенаправляем на дашборд
      router.push(`/dashboard?tenant=${tenantId}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Не удалось активировать модуль'
      setError(message)
      setLoading(false)
    }
  }

  const selectedModuleData = modules.find(m => m.id === module)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #00C742 0%, #00B36C 29%, #0082D6 93%, #007DE3 100%)'
    }}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ backgroundColor: '#00C742' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" style={{ backgroundColor: '#0082D6' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" style={{ backgroundColor: '#00B36C' }}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 my-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Выберите модуль</h1>
          <p className="text-gray-600">Выберите модуль для вашего сайта и укажите поддомен</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {/* Module Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Выберите модуль</h2>
            {modules.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Загрузка модулей...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((m, index) => (
                  <div
                    key={m.id}
                    onClick={() => setModule(m.id)}
                    className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
                      module === m.id
                        ? 'border-blue-500 bg-blue-50 shadow-2xl ring-4 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-xl'
                    }`}
                    style={{
                      opacity: 0,
                      transform: 'translateY(30px) scale(0.95)',
                      animation: `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`
                    }}
                  >
                    {/* Card Content */}
                    <div className="p-8 relative z-10">
                      {/* Checkmark indicator */}
                      <div className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        module === m.id
                          ? 'bg-blue-500 scale-100 opacity-100 shadow-lg'
                          : 'bg-gray-200 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                      }`}>
                        {module === m.id && (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* Module Icon/Image placeholder */}
                      <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-4xl font-bold transition-all duration-300 shadow-lg ${
                        module === m.id
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white transform scale-110'
                          : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 group-hover:scale-105'
                      }`}>
                        {m.name[0]?.toUpperCase() || 'M'}
                      </div>

                      <h3 className="font-bold text-2xl mb-3 text-gray-900">{m.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{m.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        {m.version && (
                          <span className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                            module === m.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            v{m.version}
                          </span>
                        )}
                        <div className={`flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
                          module === m.id
                            ? 'text-blue-600'
                            : 'text-gray-400 group-hover:text-blue-600'
                        }`}>
                          <span>{module === m.id ? 'Выбрано' : 'Выбрать'}</span>
                          <svg className={`w-5 h-5 transition-transform duration-300 ${
                            module === m.id ? 'rotate-0' : 'group-hover:translate-x-1'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator bar */}
                    <div className={`absolute bottom-0 left-0 right-0 h-2 transition-all duration-300 ${
                      module === m.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        : 'bg-transparent'
                    }`}></div>

                    {/* Hover effect overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 transition-all duration-300 pointer-events-none ${
                      module === m.id
                        ? 'from-blue-500/5 to-indigo-500/5'
                        : 'group-hover:from-blue-500/5 group-hover:to-indigo-500/5'
                    }`}></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subdomain Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Выберите поддомен</h2>
            <p className="text-gray-600 mb-6">Это будет адрес вашего сайта</p>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="your-shop"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                />
                <span className="text-gray-600 text-lg">.platform.com</span>
              </div>
              {subdomainAvailable === true && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-2">
                  <span>✓</span>
                  <span>Поддомен доступен</span>
                </p>
              )}
              {subdomainAvailable === false && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <span>✗</span>
                  <span>Поддомен уже занят</span>
                </p>
              )}
              {subdomain && subdomain.length < 3 && (
                <p className="text-gray-500 text-sm mt-2">Минимум 3 символа</p>
              )}
            </div>
          </div>

          {/* Summary */}
          {module && (
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <p className="text-sm font-semibold mb-4 text-gray-900">Сводка:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Модуль:</span>
                  <span className="font-semibold">{selectedModuleData?.name || module}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Адрес:</span>
                  <span className="font-semibold">{subdomain || 'не указан'}.platform.com</span>
                </li>
              </ul>
            </div>
          )}

          {/* Activate Button */}
          <button
            onClick={handleActivateModule}
            disabled={loading || !module || !subdomain || subdomain.length < 3 || subdomainAvailable === false}
            className={`w-full px-6 py-4 font-bold rounded-xl transition-colors text-lg ${
              module && subdomain && subdomain.length >= 3 && subdomainAvailable !== false
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Активация модуля...' : 'Активировать модуль'}
          </button>
        </div>
      </div>
    </div>
  )
}

