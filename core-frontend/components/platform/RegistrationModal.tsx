'use client'

import { useState, useEffect } from 'react'
import { register, sendOTP } from '@/lib/api/register'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Step = 'phone' | 'verification' | 'registering'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  initialTariff?: string | null
}

export const RegistrationModal = ({ isOpen, onClose, initialTariff = null }: RegistrationModalProps) => {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isOpen) {
      setStep('phone')
      setPhone('')
      setOtpCode('')
      setError(null)
    }
  }, [isOpen])

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Пожалуйста, введите корректный номер телефона')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await sendOTP(phone)
      setStep('verification')
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить код')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!phone || !otpCode || otpCode.length !== 6) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    setLoading(true)
    setError(null)
    setStep('registering')

    try {
      const result = await register({
        phone,
        code: otpCode,
      })

      localStorage.setItem('token', result.token)
      localStorage.setItem('tenant_id', result.tenant_id)

      // Закрываем модальное окно и перенаправляем на выбор модуля
      onClose()
      router.push(`/select-module?tenant=${result.tenant_id}`)
    } catch (err: any) {
      setError(err.message || 'Не удалось зарегистрироваться')
      setStep('verification')
      setLoading(false)
    }
  }

  const handleDevLogin = async () => {
    // Dev-вход: имитация всех шагов регистрации
    setLoading(true)
    setError(null)
    setStep('registering')

    try {
      // Используем тестовый номер телефона для dev-входа
      const devPhone = '+79991234567'
      const devCode = '123456' // Тестовый код

      // Имитируем регистрацию
      const result = await register({
        phone: devPhone,
        code: devCode,
      })

      localStorage.setItem('token', result.token)
      localStorage.setItem('tenant_id', result.tenant_id)

      // Закрываем модальное окно и перенаправляем на выбор модуля
      onClose()
      router.push(`/select-module?tenant=${result.tenant_id}`)
    } catch (err: any) {
      // Если регистрация не удалась, пробуем использовать существующий аккаунт
      // или создаем фиктивный токен для разработки
      console.warn('Dev login: Registration failed, using fallback:', err)
      
      // Fallback: создаем временный токен и tenant_id для разработки
      const devToken = 'dev-token-' + Date.now()
      const devTenantId = 'dev-tenant-' + Date.now()
      
      localStorage.setItem('token', devToken)
      localStorage.setItem('tenant_id', devTenantId)

      onClose()
      router.push(`/select-module?tenant=${devTenantId}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative">
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/stats/logo.svg"
              alt="Точка Роста"
              width={200}
              height={60}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {step === 'phone' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Регистрация</h2>
              <p className="text-gray-600 mb-4">Введите номер телефона для регистрации</p>
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
              
              {/* Dev-вход (только в режиме разработки) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleDevLogin}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? 'Вход...' : '🔧 Dev-вход (имитация регистрации)'}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Быстрый вход для разработки
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 'verification' && (
            <div>
              <button
                onClick={() => {
                  setStep('phone')
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
                onClick={handleRegister}
                disabled={otpCode.length !== 6 || loading}
                className={`w-full mt-4 px-6 py-3 font-bold rounded-lg transition-colors ${
                  otpCode.length === 6
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </div>
          )}

          {step === 'registering' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Регистрация...</h2>
              <p className="text-gray-600">Пожалуйста, подождите</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
