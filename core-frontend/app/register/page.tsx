'use client'

import { useState } from 'react'
import { register, sendOTP, requestCode, confirmCode } from '@/lib/api/register'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Step = 'method' | 'identifier' | 'code' | 'registering'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('method')
  const [channel, setChannel] = useState<'telegram' | 'max' | null>(null)
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('') // Still used for old flow
  const [otpCode, setOtpCode] = useState('') // Still used for old flow
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Не удалось отправить код'
      setError(message)
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

      // Перенаправляем на страницу выбора модуля
      router.push(`/select-module?tenant=${result.tenant_id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Не удалось зарегистрироваться'
      setError(message)
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

      // Перенаправляем на страницу выбора модуля
      router.push(`/select-module?tenant=${result.tenant_id}`)
    } catch (err: unknown) {
      // Если регистрация не удалась, используем dev-login endpoint
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      console.warn('Dev login: Registration failed, trying dev-login endpoint:', errorMessage)
      
      try {
        // Используем dev-login endpoint для получения валидного JWT
        const devLoginResponse = await fetch('/api/auth/dev-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (devLoginResponse.ok) {
          const devResult = await devLoginResponse.json()
          localStorage.setItem('token', devResult.token)
          localStorage.setItem('tenant_id', devResult.tenant_id)
          router.push(`/select-module?tenant=${devResult.tenant_id}`)
        } else {
          throw new Error('Dev login failed')
        }
      } catch (devErr: unknown) {
        // Если и dev-login не сработал, показываем ошибку
        const devErrorMessage = devErr instanceof Error ? devErr.message : 'Unknown error'
        console.error('Dev login error:', devErrorMessage)
        setError('Не удалось выполнить dev-вход. Пожалуйста, попробуйте зарегистрироваться через Telegram или Max.')
        setStep('method')
      }
    } finally {
      setLoading(false)
    }
  }

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

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Image
              src="/images/stats/logo.svg"
              alt="Точка Роста"
              width={150}
              height={45}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          {/* Header - moved under logo */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-normal text-gray-900 mb-2">Регистрация</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {/* Step 1: Registration Methods */}
          {step === 'method' && (
            <div>
              <p className="text-gray-600 mb-6 text-center">Выберите способ регистрации</p>
              
              {/* Registration methods */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    if (!agreeTerms || !agreePrivacy) return
                    setChannel('telegram')
                    setStep('identifier')
                  }}
                  disabled={!agreeTerms || !agreePrivacy}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-xl transition-colors ${
                    agreeTerms && agreePrivacy
                      ? 'bg-[#0088cc] text-white hover:bg-[#0077b3]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.174 1.858-.926 6.655-1.305 8.84-.152.855-.45 1.14-.74 1.168-.63.057-1.11-.415-1.721-.815-.955-.64-1.496-1.038-2.423-1.662-1.07-.699-.376-1.084.233-1.712.16-.164 2.93-2.688 2.987-2.916.007-.03.014-.145-.055-.202-.069-.057-.17-.034-.243-.02-.104.02-1.755 1.12-4.953 3.285-.469.313-.893.465-1.275.458-.42-.008-1.227-.237-1.827-.432-.737-.24-1.322-.367-1.27-.775.026-.207.39-.42 1.074-.637 4.25-1.85 7.08-3.07 8.4-3.68 2.05-.95 2.47-1.115 2.75-1.12.06-.001.19.014.275.1.07.07.09.163.1.23.01.06.02.2.01.308z"/>
                  </svg>
                  <span>Войти через Telegram</span>
                </button>
                
                <button
                  onClick={() => {
                    if (!agreeTerms || !agreePrivacy) return
                    setChannel('max')
                    setStep('identifier')
                  }}
                  disabled={!agreeTerms || !agreePrivacy}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-xl transition-colors ${
                    agreeTerms && agreePrivacy
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>Войти через Max</span>
                </button>
              </div>

              {/* Dev-вход */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDevLogin}
                  disabled={loading || !agreeTerms || !agreePrivacy}
                  className={`w-full px-6 py-3 font-semibold rounded-xl transition-colors text-sm ${
                    agreeTerms && agreePrivacy && !loading
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Вход...' : '🔧 Dev-вход (имитация регистрации)'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Быстрый вход для разработки
                </p>
              </div>

              {/* Checkboxes for agreements - below buttons */}
              <div className="mt-6 space-y-3 flex flex-col items-center">
                <label className="flex items-center gap-3 cursor-pointer justify-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 text-center">
                    Я согласен с{' '}
                    <Link 
                      href="/legal/terms" 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Пользовательским соглашением
                    </Link>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer justify-center">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 text-center">
                    Я согласен с{' '}
                    <Link 
                      href="/legal/privacy" 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Политикой конфиденциальности
                    </Link>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Identifier Input */}
          {step === 'identifier' && (
            <div>
              <button
                onClick={() => {
                  setStep('method')
                  setChannel(null)
                  setIdentifier('')
                }}
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <span>←</span>
                <span>Назад</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Введите {channel === 'telegram' ? 'Telegram' : 'MAX'} идентификатор
              </h2>
              <p className="text-gray-600 mb-4">
                {channel === 'telegram' 
                  ? 'Введите ваш Telegram @username (например: @username)'
                  : 'Введите ваш MAX user_id'}
              </p>
              <input
                type="text"
                placeholder={channel === 'telegram' ? '@username' : 'max_user_id'}
                value={identifier}
                onChange={(e) => {
                  const value = e.target.value
                  console.log('[REGISTER] Input onChange', {
                    value,
                    valueLength: value.length,
                    channel,
                    previousIdentifier: identifier,
                  })
                  setIdentifier(value)
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  const value = target.value
                  console.log('[REGISTER] Input onInput', {
                    value,
                    valueLength: value.length,
                    channel,
                    previousIdentifier: identifier,
                  })
                  setIdentifier(value)
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg mb-4"
              />
              <button
                onClick={async () => {
                  console.log('[REGISTER] Button clicked - Start request code flow', {
                    identifier,
                    channel,
                    identifierLength: identifier?.length,
                    hasIdentifier: !!identifier,
                  })
                  
                  if (!identifier) {
                    console.warn('[REGISTER] No identifier provided')
                    setError('Пожалуйста, введите идентификатор')
                    return
                  }
                  
                  setLoading(true)
                  setError(null)
                  
                  const payload = {
                    channel: channel!,
                    identifier: identifier,
                  }
                  
                  console.log('[REGISTER] Calling requestCode API', {
                    payload,
                    url: '/api/auth/request-code',
                    timestamp: new Date().toISOString(),
                  })
                  
                  try {
                    const result = await requestCode(payload)
                    console.log('[REGISTER] requestCode success', {
                      result,
                      nextStep: 'code',
                      timestamp: new Date().toISOString(),
                    })
                    setStep('code')
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Не удалось отправить код'
                    console.error('[REGISTER] requestCode error', {
                      error: err,
                      message,
                      payload,
                      errorType: err instanceof Error ? err.constructor.name : typeof err,
                      stack: err instanceof Error ? err.stack : undefined,
                      timestamp: new Date().toISOString(),
                    })
                    setError(message)
                  } finally {
                    setLoading(false)
                    console.log('[REGISTER] Request code flow finished', {
                      loading: false,
                      timestamp: new Date().toISOString(),
                    })
                  }
                }}
                disabled={loading || !identifier}
                className={`w-full px-6 py-3 font-bold rounded-xl transition-colors ${
                  identifier && !loading
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Отправка...' : 'Отправить код'}
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">
                Код будет отправлен в консоль сервера (dev-режим)
              </p>
            </div>
          )}

          {/* Step 3: Code Verification */}
          {step === 'code' && (
            <div>
              <button
                onClick={() => {
                  setStep('identifier')
                  setCode('')
                }}
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <span>←</span>
                <span>Назад</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Введите код подтверждения</h2>
              <p className="text-gray-600 mb-4">
                Код отправлен для {channel === 'telegram' ? `Telegram ${identifier}` : `MAX ${identifier}`}
              </p>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Проверьте консоль сервера для получения кода
              </p>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center text-3xl tracking-widest font-mono mb-4"
              />
              <button
                onClick={async () => {
                  if (!code || code.length !== 6) {
                    setError('Пожалуйста, введите 6-значный код')
                    return
                  }
                  
                  setLoading(true)
                  setError(null)
                  setStep('registering')
                  
                  try {
                    const result = await confirmCode({
                      channel: channel!,
                      identifier: identifier,
                      code: code,
                    })
                    
                    // Save tenant_id to localStorage
                    localStorage.setItem('tenant_id', result.tenant_id)
                    
                    // In dev mode, also save to .env.local via API
                    if (process.env.NODE_ENV === 'development') {
                      try {
                        await fetch('/api/dev/save-tenant-id', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ tenant_id: result.tenant_id }),
                        })
                      } catch (err) {
                        console.warn('Failed to save tenant_id to .env.local:', err)
                        // Continue anyway
                      }
                    }
                    
                    // Redirect to module selection
                    router.push(`/select-module?tenant=${result.tenant_id}`)
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Не удалось подтвердить код'
                    setError(message)
                    setStep('code')
                    setLoading(false)
                  }
                }}
                disabled={loading || code.length !== 6}
                className={`w-full px-6 py-3 font-bold rounded-xl transition-colors ${
                  code.length === 6 && !loading
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Подтверждение...' : 'Подтвердить'}
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification (old flow - keep for compatibility) */}
          {step === 'verification' && (
            <div>
              <button
                onClick={() => {
                  setStep('method')
                  setOtpCode('')
                  setAgreeTerms(false)
                  setAgreePrivacy(false)
                }}
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <span>←</span>
                <span>Назад</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Введите код подтверждения</h2>
              <p className="text-gray-600 mb-4">Код отправлен на {phone}</p>
              <input
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center text-3xl tracking-widest font-mono"
              />
              
              <button
                onClick={handleRegister}
                disabled={loading || otpCode.length !== 6 || !agreeTerms || !agreePrivacy}
                className={`w-full mt-6 px-6 py-3 font-bold rounded-xl transition-colors ${
                  otpCode.length === 6 && agreeTerms && agreePrivacy
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>

              {/* Checkboxes for agreements - below button */}
              <div className="mt-6 space-y-3 flex flex-col items-center">
                <label className="flex items-center gap-3 cursor-pointer justify-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 text-center">
                    Я согласен с{' '}
                    <Link 
                      href="/legal/terms" 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Пользовательским соглашением
                    </Link>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer justify-center">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 text-center">
                    Я согласен с{' '}
                    <Link 
                      href="/legal/privacy" 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Политикой конфиденциальности
                    </Link>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Registering */}
          {step === 'registering' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-4">Регистрация...</h2>
              <p className="text-gray-600">Пожалуйста, подождите</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Уже есть аккаунт?{' '}
            <a href="/auth" className="text-blue-500 hover:text-blue-600 font-semibold">
              Войти
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
