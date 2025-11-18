'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Module {
  id: string
  name: string
  description: string
  category: string
  status: 'live' | 'coming-soon' | 'planned'
  features: string[]
  image?: string
  icon: string
  color: string
}

const modules: Module[] = [
  {
    id: 'shop',
    name: 'Магазин',
    description: 'Полнофункциональный интернет-магазин с корзиной, оплатой и управлением товарами',
    category: 'ecommerce',
    status: 'live',
    features: ['Управление товарами', 'Корзина и оформление заказов', 'Интеграция с ЮKassa', 'Личные кабинеты покупателей', 'История заказов'],
    icon: '🛒',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'shop-advanced',
    name: 'Расширенный магазин',
    description: 'Продвинутый магазин с фильтрами, категориями, вариантами товаров и CRM',
    category: 'ecommerce',
    status: 'coming-soon',
    features: ['Фильтры и поиск', 'Категории товаров', 'Варианты товара (размер, цвет)', 'Система доставок', 'CRM из коробки'],
    icon: '🛍️',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'events',
    name: 'Мероприятия',
    description: 'Продажа билетов, управление событиями и автоматизация регистраций',
    category: 'events',
    status: 'coming-soon',
    features: ['Продажа билетов', 'QR-пропуска', 'Автоматические письма', 'Онлайн/оффлайн события', 'Расписание и спикеры'],
    icon: '🎫',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'portfolio',
    name: 'Портфолио',
    description: 'Демонстрация работ, кейсов и отзывов с красивыми галереями',
    category: 'content',
    status: 'coming-soon',
    features: ['Кейсы и проекты', 'Отзывы клиентов', 'Галереи изображений', 'Лэндинги на поддомене', 'SEO-оптимизация'],
    icon: '🎨',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'courses',
    name: 'Онлайн-курсы',
    description: 'Создание и продажа онлайн-курсов с уроками, заданиями и сертификатами',
    category: 'education',
    status: 'coming-soon',
    features: ['Уроки и модули', 'Доступ по подписке', 'Домашние задания', 'Проверка работ', 'Сертификаты'],
    icon: '🎓',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'blog',
    name: 'Блог',
    description: 'Публикация статей, новостей и контента с SEO-оптимизацией',
    category: 'content',
    status: 'planned',
    features: ['Редактор статей', 'Категории и теги', 'Комментарии', 'SEO-метатеги', 'RSS-лента'],
    icon: '📝',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Управление клиентами, сделками и продажами',
    category: 'business',
    status: 'planned',
    features: ['База клиентов', 'Воронка продаж', 'Задачи и напоминания', 'История взаимодействий', 'Отчеты'],
    icon: '📊',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'analytics',
    name: 'Аналитика',
    description: 'Глубокая аналитика продаж, трафика и конверсий',
    category: 'business',
    status: 'planned',
    features: ['Аналитика продаж', 'Тепловые карты', 'Конверсия по шагам', 'Источники трафика', 'PDF-отчеты'],
    icon: '📈',
    color: 'from-red-500 to-red-600'
  }
]

const categories = [
  { id: 'all', name: 'Все модули', icon: '🌟' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'events', name: 'События', icon: '🎫' },
  { id: 'content', name: 'Контент', icon: '📝' },
  { id: 'education', name: 'Образование', icon: '🎓' },
  { id: 'business', name: 'Бизнес-инструменты', icon: '📊' }
]

export const ModulesShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">LIVE</span>
      case 'coming-soon':
        return <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">СКОРО</span>
      case 'planned':
        return <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">ПЛАНИРУЕТСЯ</span>
      default:
        return null
    }
  }

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Featured modules for carousel (first 4)
  const featuredModules = modules.slice(0, 4)

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredModules.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredModules.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredModules.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredModules.length) % featuredModules.length)
    setIsAutoPlaying(false)
  }

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section with Carousel */}
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center text-white">
              <p className="text-sm md:text-base text-white/80 mb-4 uppercase tracking-wider">
                Модульная платформа - Россия
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                МОДУЛИ ПЛАТФОРМЫ
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-8 max-w-xl leading-relaxed">
                Выберите модули для вашего бизнеса. Всё работает на одном поддомене, без сложных интеграций. 
                Создайте свой интернет-магазин, запустите онлайн-курсы или организуйте мероприятия — всё в одном месте.
              </p>
              <Link
                href="/register"
                className="group inline-flex items-center gap-4 w-fit"
              >
                <div className="w-14 h-14 bg-[#00C742] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div className="px-6 py-3 bg-white text-gray-900 font-bold rounded-r-full border-2 border-[#00C742] group-hover:bg-[#00C742] group-hover:text-white transition-colors">
                  НАЧАТЬ РАБОТУ
                </div>
              </Link>
            </div>

            {/* Right Side - Module Cards Carousel */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                {/* Carousel Container */}
                <div className="relative h-[500px] md:h-[600px]">
                  {featuredModules.map((module, index) => {
                    const isActive = index === currentSlide
                    const offset = index - currentSlide
                    const absOffset = Math.abs(offset)
                    
                    return (
                      <div
                        key={module.id}
                        className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                          isActive
                            ? 'opacity-100 scale-100 z-10 translate-x-0'
                            : offset > 0
                            ? `opacity-0 scale-95 z-0 translate-x-full`
                            : `opacity-30 scale-90 z-0 -translate-x-full`
                        }`}
                        style={{
                          transform: isActive 
                            ? 'translateX(0) scale(1)' 
                            : offset > 0
                            ? `translateX(100%) scale(0.95)`
                            : `translateX(-100%) scale(0.9)`,
                        }}
                      >
                        <div className={`bg-gradient-to-br ${module.color} rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col`}>
                          {/* Module Image Placeholder */}
                          <div className="relative h-64 bg-white/10 backdrop-blur-sm">
                            <div className="absolute top-4 right-4 z-10">
                              {getStatusBadge(module.status)}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-8xl">{module.icon}</span>
                            </div>
                          </div>
                          
                          {/* Module Content */}
                          <div className="flex-1 p-6 text-white">
                            <p className="text-sm text-white/80 mb-2 uppercase tracking-wider">
                              {module.category === 'ecommerce' ? 'E-commerce' :
                               module.category === 'events' ? 'События' :
                               module.category === 'content' ? 'Контент' :
                               module.category === 'education' ? 'Образование' :
                               'Бизнес'} - {module.status === 'live' ? 'Доступно' : 'Скоро'}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">{module.name}</h3>
                            <p className="text-white/90 text-sm mb-4 line-clamp-3">{module.description}</p>
                            <ul className="space-y-2">
                              {module.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                  <span className="text-white/60">•</span>
                                  <span className="text-white/90">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Carousel Navigation */}
                <div className="flex items-center justify-between mt-8">
                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevSlide}
                      className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      aria-label="Previous slide"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      aria-label="Next slide"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex-1 mx-6">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00C742] transition-all duration-500"
                        style={{ width: `${((currentSlide + 1) / featuredModules.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Slide Number */}
                  <div className="text-white text-4xl font-bold">
                    {String(currentSlide + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 sm:px-6 md:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#00C742] text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="px-4 sm:px-6 md:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                onClick={() => setSelectedModule(module)}
              >
                {/* Module Header */}
                <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{module.icon}</div>
                    {getStatusBadge(module.status)}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{module.name}</h3>
                  <p className="text-white/90 text-sm">{module.description}</p>
                </div>

                {/* Module Features */}
                <div className="p-6">
                  <ul className="space-y-2">
                    {module.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {module.features.length > 3 && (
                      <li className="text-gray-500 text-sm">
                        +{module.features.length - 3} еще...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Module Footer */}
                <div className="px-6 pb-6">
                  <button className="w-full px-4 py-2 bg-gray-100 hover:bg-[#00C742] hover:text-white rounded-lg font-semibold transition-colors">
                    {module.status === 'live' ? 'Подключить' : 'Узнать больше'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Detail Modal */}
      {selectedModule && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedModule(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedModule.color} p-8 text-white`}>
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl">{selectedModule.icon}</div>
                {getStatusBadge(selectedModule.status)}
              </div>
              <h2 className="text-3xl font-bold mb-3">{selectedModule.name}</h2>
              <p className="text-white/90">{selectedModule.description}</p>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Возможности модуля:</h3>
              <ul className="space-y-3 mb-8">
                {selectedModule.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Example Preview */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Пример оформления:</h3>
                <div className={`bg-gradient-to-br ${selectedModule.color} rounded-xl p-8 text-white`}>
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{selectedModule.icon}</span>
                      <div>
                        <h4 className="text-xl font-bold">{selectedModule.name}</h4>
                        <p className="text-white/80 text-sm">Пример интерфейса модуля</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedModule.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-3">
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {selectedModule.status === 'live' ? (
                  <Link
                    href="/register"
                    className="flex-1 px-6 py-3 bg-[#00C742] text-white font-bold rounded-full text-center hover:bg-[#00B36C] transition-colors"
                    onClick={() => setSelectedModule(null)}
                  >
                    Подключить модуль
                  </Link>
                ) : (
                  <button
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full cursor-not-allowed"
                    disabled
                  >
                    {selectedModule.status === 'coming-soon' ? 'Скоро доступен' : 'В разработке'}
                  </button>
                )}
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="px-4 sm:px-6 md:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="rounded-2xl p-8 md:p-12 text-white"
            style={{
              background: 'linear-gradient(-45deg, #00C742, #00B36C, #0082D6, #007DE3, #00C742)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Готовы начать?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Выберите модули и создайте свой бизнес на платформе Точка Роста
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-white text-[#00C742] font-bold rounded-full text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
            >
              Начать бесплатно
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

