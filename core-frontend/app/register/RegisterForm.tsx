'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Step = 'phone' | 'login' | 'register'

const inspiringPhrases = [
  "Каждый успешный бизнес начинается с первого шага. Сделайте его сегодня!",
  "Ваша идея заслуживает профессиональной реализации. Мы поможем вам начать.",
  "Интернет-магазин за 15 минут? Это реально! Попробуйте бесплатно.",
  "Начните продавать онлайн уже сегодня. Без технических знаний.",
  "Тысячи предпринимателей уже доверяют нам свой бизнес. Присоединяйтесь!",
  "Превратите свою идею в успешный онлайн-бизнес. Мы поможем на каждом этапе.",
  "Создайте свой интернет-магазин без программистов. Просто и быстро.",
  "Ваш путь к успеху начинается здесь. Сделайте первый шаг прямо сейчас.",
  "Не ждите идеального момента. Начните свой бизнес сегодня!",
  "Мы верим в ваш успех. Давайте создадим что-то великое вместе."
]

export default function RegisterForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [phone, setPhone] = useState('89200206767')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [employmentType, setEmploymentType] = useState('individual')
  const [agreePrivacy, setAgreePrivacy] = useState(true)
  const [agreeSecurity, setAgreeSecurity] = useState(true)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [fadeKey, setFadeKey] = useState(0)

  // Случайная смена вдохновляющих фраз
  useEffect(() => {
    if (step !== 'register') return

    const interval = setInterval(() => {
      setFadeKey(prev => prev + 1)
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * inspiringPhrases.length)
        setCurrentPhrase(randomIndex)
      }, 300) // Задержка для плавной анимации
    }, 4000) // Меняем фразу каждые 4 секунды

    return () => clearInterval(interval)
  }, [step])

  const normalizePhone = (phone: string): string => {
    // Удаляем все пробелы и дефисы
    let normalized = phone.replace(/[\s\-]/g, '')
    
    // Убираем +7, 7, 8 в начале
    if (normalized.startsWith('+7')) {
      normalized = normalized.substring(2)
    } else if (normalized.startsWith('7')) {
      normalized = normalized.substring(1)
    } else if (normalized.startsWith('8')) {
      normalized = normalized.substring(1)
    }
    
    // Проверяем, что осталось 10 цифр
    if (normalized.length === 10 && /^\d+$/.test(normalized)) {
      return `+7${normalized}`
    }
    
    // Если не удалось нормализовать, возвращаем как есть
    return phone
  }

  const handleCheckPhone = async () => {
    if (!phone) return setError('Введите номер')
    if (!agreePrivacy || !agreeSecurity) {
      return setError('Пожалуйста, согласитесь с политиками')
    }
    setLoading(true)
    setError(null)
    try {
      // Нормализуем номер телефона
      const normalizedPhone = normalizePhone(phone)
      
      const res = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone }),
        credentials: 'include'
      })
      
      if (res.status === 404) {
          setStep('register')
          return
      }

      const data = await res.json()
      if (data.exists) {
        setStep('login')
      } else {
        setStep('register')
      }
    } catch (e) {
      console.error(e)
      setStep('register') 
    } finally {
      setLoading(false)
    }
  }


  const normalizePhone = (phone: string): string => {
    // Удаляем все пробелы и дефисы
    let normalized = phone.replace(/[\s\-]/g, '')
    
    // Убираем +7, 7, 8 в начале
    if (normalized.startsWith('+7')) {
      normalized = normalized.substring(2)
    } else if (normalized.startsWith('7')) {
      normalized = normalized.substring(1)
    } else if (normalized.startsWith('8')) {
      normalized = normalized.substring(1)
    }
    
    // Проверяем, что осталось 10 цифр
    if (normalized.length === 10 && /^\d+$/.test(normalized)) {
      return `+7${normalized}`
    }
    
    // Если не удалось нормализовать, возвращаем как есть
    return phone
  }

  const handleLogin = async () => {
    if (!password) {
      setError('Введите пароль')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
        // Нормализуем номер телефона
        const normalizedPhone = normalizePhone(phone)
        
        const res = await fetch('/api/auth/login-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: normalizedPhone, password }),
            credentials: 'include'
        })
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ detail: 'Ошибка входа' }))
          throw new Error(errorData.detail || errorData.error || 'Неверный телефон или пароль')
        }
        
        const data = await res.json()
        localStorage.setItem('token', data.access_token)
        window.location.href = '/dashboard-platform'
    } catch (e: any) {
        setError(e.message || 'Произошла ошибка при входе')
    } finally {
        setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
        const res = await fetch('/api/auth/register-full', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone, password,
                first_name: firstName, last_name: lastName,
                employment_type: employmentType
            }),
            credentials: 'include'
        })
        if (!res.ok) throw new Error('Ошибка регистрации')
        
        const data = await res.json()
        localStorage.setItem('token', data.access_token)
        window.location.href = '/select-module'
    } catch (e: any) {
        setError(e.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #00C742 0%, #00B36C 29%, #0082D6 93%, #007DE3 100%)'
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ backgroundColor: '#00C742' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" style={{ backgroundColor: '#0082D6' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" style={{ backgroundColor: '#00B36C' }}></div>
      </div>

      <div className={`${step === 'register' ? 'w-[90%] min-w-[1000px] max-w-[1400px]' : 'w-[35%] min-w-[350px] max-w-[500px]'} relative z-10 my-8`}>
        {/* Window frame */}
        <div className="bg-[#FFFEF7] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col noise-texture">
          {/* Window controls */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#2F2F2F] border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - только для регистрации */}
            {step === 'register' && (
              <div className="w-96 bg-[#FFFEF7] border-r border-gray-200 flex flex-col">
                {/* Sidebar content */}
                <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-end">
                  {/* Логотип */}
                  <div className="mb-6 flex justify-center">
                    <div className="bg-[#FFFEF7] rounded-xl p-4">
                      <Image 
                        src="/images/stats/logo.svg" 
                        alt="Точка Роста" 
                        width={180} 
                        height={55} 
                        priority
                        style={{ width: 'auto', height: 'auto' }} 
                      />
                    </div>
                  </div>

                  {/* Надпись Регистрация */}
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Регистрация</h2>

                  {/* Вдохновляющие советы и фразы */}
                  <div className="mb-6">
                    <div 
                      key={fadeKey}
                      className={`bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-[#00C742] rounded-r-xl p-4 transition-opacity duration-300 ${
                        fadeKey % 2 === 0 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        animation: fadeKey % 2 === 0 ? 'fadeIn 0.3s ease-in' : 'fadeOut 0.3s ease-out'
                      }}
                    >
                      <p className="text-sm text-gray-700 italic">
                        "{inspiringPhrases[currentPhrase]}"
                      </p>
                    </div>
                  </div>

                  {/* Информация о триале и тарифах */}
                  <div className="mb-6">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Триал версия</strong> — попробуйте все возможности платформы бесплатно!
                      </p>
                      <div className="text-xs text-gray-600 space-y-2">
                        <p>
                          <strong>Тарифы Старт и Рост:</strong> доступен только поддомен
                        </p>
                        <p>
                          <strong>Тариф Премиум:</strong> доступен собственный домен
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ссылка Назад */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('phone')
                        setFirstName('')
                        setLastName('')
                        setPassword('')
                        setConfirmPassword('')
                      }}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      ← Назад
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header - для выбора типа и ввода телефона */}
              {(step === 'phone') && (
                <div className="p-8 text-center bg-[#FFFEF7]">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-900 text-xl font-semibold mb-4">Добро пожаловать</p>
                    <div className="bg-[#FFFEF7] rounded-2xl p-4">
                      <Image 
                        src="/images/stats/logo.svg" 
                        alt="Точка Роста" 
                        width={200} 
                        height={60} 
                        priority
                        style={{ width: 'auto', height: 'auto' }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className={`p-8 ${step === 'register' ? 'overflow-y-auto flex-1' : ''}`}>
                {/* Step 1: Phone Input */}
                {step === 'phone' && (
                  <form onSubmit={(e) => { e.preventDefault(); handleCheckPhone(); }} className="space-y-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mt-2">
                    Номер будет использован как ваш уникальный ID (логин)
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Номер телефона или ID
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setError('')
                    }}
                    placeholder="89000000001"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none transition text-black"
                    style={{
                      backgroundColor: '#FFFEF7',
                      borderColor: 'rgba(0, 130, 214, 0.3)',
                      color: '#000000'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0082D6'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 130, 214, 0.3)'
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Введите номер телефона для регистрации
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !agreePrivacy || !agreeSecurity}
                  className="w-full text-white font-bold py-4 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  style={{
                    background: 'linear-gradient(to right, #0082D6 0%, #007DE3 100%)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #0066B3 0%, #0066CC 100%)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #0082D6 0%, #007DE3 100%)'
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Проверка...
                    </span>
                  ) : (
                    'Продолжить'
                  )}
                </button>

                <div className="space-y-2 mt-4 flex flex-col items-center">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>Я соглашаюсь с Политикой конфиденциальности</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeSecurity}
                      onChange={(e) => setAgreeSecurity(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>Я соглашаюсь с политикой безопасности</span>
                  </label>
                </div>
                  </form>
                )}

            {/* Step 2: Registration Form */}
            {step === 'register' && (
              <div className="w-full">
                  <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4">
                    <div className="rounded-xl p-4 border-2" style={{
                      backgroundColor: '#FFFEF7',
                      borderColor: '#B3D9FF'
                    }}>
                      <p className="text-sm text-gray-700">
                        <strong>Телефон:</strong> {phone}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Имя <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-gray-900"
                        style={{
                          backgroundColor: '#FFFEF7',
                          borderColor: 'rgba(0, 130, 214, 0.3)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#0082D6'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 130, 214, 0.3)'
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Фамилия <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-gray-900"
                        style={{
                          backgroundColor: '#FFFEF7',
                          borderColor: 'rgba(0, 130, 214, 0.3)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#0082D6'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 130, 214, 0.3)'
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="employmentType" className="block text-sm font-semibold text-gray-700 mb-2">
                        Тип Бизнеса <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="employmentType"
                        name="employmentType"
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-gray-900"
                        style={{
                          backgroundColor: '#FFFEF7',
                          borderColor: 'rgba(0, 130, 214, 0.3)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#0082D6'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 130, 214, 0.3)'
                        }}
                      >
                        <option value="individual">Физ. лицо</option>
                        <option value="self_employed">Самозанятый</option>
                        <option value="ip">ИП</option>
                        <option value="ooo">ООО</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Придумайте пароль <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError('')
                        }}
                        required
                        minLength={6}
                        placeholder="Введите пароль"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-black"
                        style={{
                          backgroundColor: '#FFFEF7',
                          borderColor: 'rgba(0, 130, 214, 0.3)',
                          color: '#000000'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#0082D6'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 130, 214, 0.3)'
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Минимум 6 символов
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Подтвердите пароль <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setError('')
                        }}
                        required
                        minLength={6}
                        placeholder="Повторите пароль"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-black"
                        style={{
                          backgroundColor: '#FFFEF7',
                          borderColor: password && confirmPassword && password !== confirmPassword ? '#ef4444' : 'rgba(0, 130, 214, 0.3)',
                          color: '#000000'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#0082D6'
                        }}
                        onBlur={(e) => {
                          if (password && confirmPassword && password !== confirmPassword) {
                            e.currentTarget.style.borderColor = '#ef4444'
                          } else {
                            e.currentTarget.style.borderColor = 'rgba(0, 130, 214, 0.3)'
                          }
                        }}
                      />
                      {password && confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          Пароли не совпадают
                        </p>
                      )}
                    </div>

                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <p className="text-red-700 font-medium">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-white font-bold py-4 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                      style={{
                        background: 'linear-gradient(to right, #0082D6 0%, #007DE3 100%)'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.background = 'linear-gradient(to right, #0066B3 0%, #0066CC 100%)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #0082D6 0%, #007DE3 100%)'
                      }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Регистрация...
                        </span>
                      ) : (
                        '✅ Зарегистрироваться'
                      )}
                    </button>
                  </form>
              </div>
            )}

            {/* Step 3: Login Form */}
            {step === 'login' && (
              <div>
                <button
                  onClick={() => setStep('phone')}
                  className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <span>←</span>
                  <span>Назад</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Вход</h2>
                <p className="text-gray-600 mb-4">
                  Войдите, используя ваш ID: {phone}
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                  <div>
                    <label htmlFor="loginPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Пароль
                    </label>
                    <input
                      type="password"
                      id="loginPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Пароль"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-black"
                      style={{
                        backgroundColor: '#FFFEF7',
                        borderColor: 'rgba(0, 130, 214, 0.3)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#0082D6'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 130, 214, 0.3)'
                      }}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white font-bold py-4 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    style={{
                      background: 'linear-gradient(to right, #0082D6 0%, #007DE3 100%)'
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = 'linear-gradient(to right, #0066B3 0%, #0066CC 100%)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #0082D6 0%, #007DE3 100%)'
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Вход...
                      </span>
                    ) : (
                      'Войти'
                    )}
                  </button>
                </form>
              </div>
            )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#FFFEF7] px-8 py-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              © 2025 Точка Роста. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
