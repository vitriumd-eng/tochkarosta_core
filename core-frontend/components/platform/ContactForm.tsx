'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email адрес'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Сообщение обязательно для заполнения'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Сообщение должно содержать минимум 10 символов'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      // Здесь будет логика отправки формы на сервер
      // const response = await fetch('/api/contact', { ... })
      
      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      
      // Сброс статуса через 5 секунд
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      setSubmitStatus('error')
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка отправки формы:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="about" className="py-20 bg-[#FAFAFA] overflow-hidden">
      <div className="px-[25px] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mb-4">
              Обратная связь
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Свяжитесь с нами, и мы ответим на все ваши вопросы
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Форма обратной связи */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition ${
                      errors.name
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1F1D2B] focus:border-transparent'
                    }`}
                    placeholder="Ваше имя"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition ${
                      errors.email
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1F1D2B] focus:border-transparent'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition resize-none ${
                      errors.message
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1F1D2B] focus:border-transparent'
                    }`}
                    placeholder="Ваше сообщение..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1F1D2B] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2A2838] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Отправить сообщение
                    </>
                  )}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.
                  </div>
                )}
              </form>
            </div>

            {/* Контакты и карта */}
            <div className="space-y-8">
              {/* Контактная информация */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl">
                <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-6">
                  Контакты
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1F1D2B] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a href="mailto:info@tochkarosta.ru" className="text-[#1D1D1F] font-medium hover:text-[#1F1D2B] transition">
                        info@tochkarosta.ru
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1F1D2B] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Телефон</p>
                      <a href="tel:+79999999999" className="text-[#1D1D1F] font-medium hover:text-[#1F1D2B] transition">
                        +7 (999) 999-99-99
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1F1D2B] rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Адрес</p>
                      <p className="text-[#1D1D1F] font-medium">
                        Москва, Россия
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Карта */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.3717891234567!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzIwLjkiTiAzN8KwMzcnMDIuMyJF!5e0!3m2!1sru!2sru!4v1234567890123!5m2!1sru!2sru"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

