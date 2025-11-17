'use client'

import { useState, useEffect } from 'react'
import { register, checkSubdomain, sendOTP } from '@/lib/api/register'

type Tariff = 'start' | 'growth' | 'premium'
type Step = 'tariff' | 'module' | 'phone' | 'subdomain' | 'verification' | 'creating'

interface Module {
  id: string
  name: string
  description: string
  version: string
  themes?: string[]
}

const TARIFFS = [
  { 
    id: 'start' as Tariff, 
    name: 'Старт', 
    price: '0', 
    period: 'месяц',
    description: 'Идеально для начинающих',
    features: [
      'До 50 товаров',
      'Базовые шаблоны',
      'Email поддержка',
      'Базовая аналитика',
      'Мобильная версия'
    ],
    popular: false
  },
  { 
    id: 'growth' as Tariff, 
    name: 'Профессионал', 
    price: '2990', 
    period: 'месяц',
    description: 'Для растущего бизнеса',
    features: [
      'Неограниченное количество товаров',
      'Все шаблоны',
      'Приоритетная поддержка',
      'Расширенная аналитика',
      'Интеграции с платежами',
      'Скидочные программы',
      'Email маркетинг'
    ],
    popular: true
  },
  { 
    id: 'premium' as Tariff, 
    name: 'Бизнес', 
    price: '7990', 
    period: 'месяц',
    description: 'Для крупных компаний',
    features: [
      'Все из Профессионал',
      'Персональный менеджер',
      'Кастомные интеграции',
      'API доступ',
      'Мультивалютность',
      'Белый лейбл',
      'Обучение команды'
    ],
    popular: false
  },
]

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  initialTariff?: Tariff | null
}

export const RegistrationModal = ({ isOpen, onClose, initialTariff = null }: RegistrationModalProps) => {
  const [step, setStep] = useState<Step>('tariff')
  const [tariff, setTariff] = useState<Tariff>('start')
  const [module, setModule] = useState<string>('')
  const [modules, setModules] = useState<Module[]>([])
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [subdomain, setSubdomain] = useState('')
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Устанавливаем начальный тариф и шаг при открытии
  useEffect(() => {
    if (!isOpen) return
    
    if (initialTariff) {
      setTariff(initialTariff)
      setStep('module') // Пропускаем шаг выбора тарифа, сразу к выбору модуля
    } else {
      setStep('tariff')
      setTariff('start')
    }
    
    async function loadModules() {
      try {
        const res = await fetch('/api/modules/list', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setModules(data)
          if (data.length > 0 && !module) {
            setModule(data[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load modules:', err)
      }
    }
    loadModules()
  }, [isOpen, initialTariff])

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

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Пожалуйста, введите корректный номер телефона')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await sendOTP(phone)
      setOtpSent(true)
      setStep('verification')
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить код')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSite = async () => {
    if (!module || !phone || !otpCode || !subdomain) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    if (subdomainAvailable === false) {
      setError('Поддомен недоступен')
      return
    }

    setLoading(true)
    setError(null)
    setStep('creating')

    try {
      const result = await register({
        phone,
        code: otpCode,
        tariff,
        module_id: module,
        subdomain,
      })

      localStorage.setItem('token', result.token)
      localStorage.setItem('tenant_id', result.tenant_id)

      window.location.href = `/dashboard?tenant=${result.tenant_id}`
    } catch (err: any) {
      setError(err.message || 'Не удалось создать сайт')
      setStep('subdomain')
      setLoading(false)
    }
  }

  const selectedModuleData = modules.find(m => m.id === module)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {step === 'tariff' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Выберите тариф</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {TARIFFS.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setTariff(t.id)
                      setStep('module')
                    }}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
                      tariff === t.id
                        ? 'border-primary scale-105 bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    } ${t.popular ? 'ring-2 ring-primary' : ''}`}
                  >
                    {t.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary text-white text-sm font-bold rounded-full">
                        Популярный
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2">{t.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{t.description}</p>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-extrabold">{t.price}</span>
                      <span className="ml-2 text-gray-600">₽ / {t.period}</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {t.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'module' && (
            <div>
              <button
                onClick={() => setStep('tariff')}
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
              >
                ← Назад
              </button>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Выберите модуль</h2>
              {modules.length === 0 ? (
                <p>Загрузка модулей...</p>
              ) : (
                <div className="space-y-4">
                  {modules.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setModule(m.id)
                        setStep('phone')
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                        module === m.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <h3 className="font-bold text-lg">{m.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{m.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'phone' && (
            <div>
              <button
                onClick={() => setStep('module')}
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
              >
                ← Назад
              </button>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Введите номер телефона</h2>
              <input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-lg"
              />
              <button
                onClick={handleSendOTP}
                disabled={loading || !phone}
                className="w-full mt-4 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Отправка...' : 'Отправить код'}
              </button>
            </div>
          )}

          {step === 'verification' && (
            <div>
              <button
                onClick={() => {
                  setStep('phone')
                  setOtpSent(false)
                  setOtpCode('')
                }}
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
              >
                ← Назад
              </button>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Введите код</h2>
              <p className="text-gray-600 mb-4">Код отправлен на {phone}</p>
              <input
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-center text-2xl tracking-widest"
              />
              <button
                onClick={() => setStep('subdomain')}
                disabled={otpCode.length !== 6}
                className={`w-full mt-4 px-6 py-3 font-bold rounded-lg transition-colors ${
                  otpCode.length === 6
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Продолжить
              </button>
            </div>
          )}

          {step === 'subdomain' && (
            <div>
              <button
                onClick={() => setStep('verification')}
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
              >
                ← Назад
              </button>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Выберите поддомен</h2>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="your-site"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                  <span className="text-gray-600">.platform.com</span>
                </div>
                {subdomainAvailable === true && (
                  <p className="text-green-600 text-sm mt-2">✓ Доступен</p>
                )}
                {subdomainAvailable === false && (
                  <p className="text-red-600 text-sm mt-2">✗ Недоступен</p>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold mb-2">Сводка:</p>
                <ul className="text-sm space-y-1">
                  <li>Тариф: {TARIFFS.find(t => t.id === tariff)?.name}</li>
                  <li>Модуль: {selectedModuleData?.name || module}</li>
                  <li>Телефон: {phone}</li>
                  <li>Поддомен: {subdomain || 'не указан'}.platform.com</li>
                </ul>
              </div>
              <button
                onClick={handleCreateSite}
                disabled={loading || !subdomain || subdomain.length < 3 || subdomainAvailable === false}
                className={`w-full px-6 py-3 font-bold rounded-lg transition-colors ${
                  subdomain && subdomain.length >= 3 && subdomainAvailable !== false
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Создание сайта...' : 'Создать сайт'}
              </button>
            </div>
          )}

          {step === 'creating' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Создание вашего сайта...</h2>
              <p className="text-gray-600">Пожалуйста, подождите</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

