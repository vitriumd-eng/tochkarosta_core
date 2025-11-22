'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Home, Mic, BookOpen, Camera, Check, ArrowRight } from 'lucide-react'

interface Module {
  id: string
  title: string
  whatIs: string
  forWhom: string
  image: string
  category: string
  icon: React.ReactNode
  features: string[]
  bgColor: string
  textColor: string
  borderColor: string
}

const modules: Module[] = [
  {
    id: 'shop',
    title: 'Интернет-Магазин',
    whatIs: 'Готовый интернет-магазин с каталогом товаров, корзиной и приёмом платежей.',
    forWhom: 'Предпринимателям, которые хотят продавать товары онлайн без разработки сайта.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    category: 'sales',
    icon: <ShoppingCart size={32} />,
    features: [
      'Каталог товаров с фотографиями',
      'Корзина и оформление заказов',
      'Приём платежей онлайн',
      'Управление заказами',
      'Аналитика продаж',
      'AI-генератор описаний'
    ],
    bgColor: 'bg-white',
    textColor: 'text-[#1D1D1F]',
    borderColor: 'border-gray-200'
  },
  {
    id: 'construction',
    title: 'Строительный бизнес',
    whatIs: 'Система для управления строительными проектами, расчёта смет и работы с клиентами.',
    forWhom: 'Строительным компаниям, подрядчикам и архитекторам для автоматизации работы.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop',
    category: 'other',
    icon: <Home size={32} />,
    features: [
      'Управление проектами',
      'Расчёт смет и калькуляция',
      'База клиентов и подрядчиков',
      'Документооборот',
      'Отслеживание этапов',
      'Финансовый учёт'
    ],
    bgColor: 'bg-[#1F1D2B]',
    textColor: 'text-white',
    borderColor: 'border-transparent'
  },
  {
    id: 'events',
    title: 'Мероприятия',
    whatIs: 'Платформа для организации событий с продажей билетов и управлением участниками.',
    forWhom: 'Организаторам конференций, вебинаров, мастер-классов и других мероприятий.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop',
    category: 'other',
    icon: <Mic size={32} />,
    features: [
      'Продажа билетов онлайн',
      'Управление участниками',
      'Рассылка уведомлений',
      'Онлайн-трансляции',
      'Запись мероприятий',
      'Статистика посещаемости'
    ],
    bgColor: 'bg-[#1F1D2B]',
    textColor: 'text-white',
    borderColor: 'border-transparent'
  },
  {
    id: 'courses',
    title: 'Курсы/Обучение',
    whatIs: 'Платформа для продажи онлайн-курсов с отслеживанием прогресса и выдачей сертификатов.',
    forWhom: 'Преподавателям, экспертам и образовательным платформам для продажи знаний.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop',
    category: 'education',
    icon: <BookOpen size={32} />,
    features: [
      'Создание курсов и уроков',
      'Видео и материалы',
      'Отслеживание прогресса',
      'Выдача сертификатов',
      'Интерактивные задания',
      'Обратная связь от кураторов'
    ],
    bgColor: 'bg-white',
    textColor: 'text-[#1D1D1F]',
    borderColor: 'border-gray-200'
  },
  {
    id: 'portfolio',
    title: 'Портфолио',
    whatIs: 'Сайт-портфолио для демонстрации работ с приёмом заказов и контактами.',
    forWhom: 'Фотографам, дизайнерам, художникам и другим творческим профессионалам.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    category: 'services',
    icon: <Camera size={32} />,
    features: [
      'Галерея работ',
      'Приём заказов онлайн',
      'Контактная форма',
      'Блог и новости',
      'Отзывы клиентов',
      'Интеграция с соцсетями'
    ],
    bgColor: 'bg-white',
    textColor: 'text-[#1D1D1F]',
    borderColor: 'border-gray-200'
  }
]

const categories = [
  { id: 'all', label: 'Все модули' },
  { id: 'sales', label: 'Продажи' },
  { id: 'services', label: 'Услуги' },
  { id: 'education', label: 'Образование' },
  { id: 'other', label: 'Другие' }
]

export const ModulesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredModules = activeCategory === 'all'
    ? modules
    : modules.filter(module => module.category === activeCategory)

  return (
    <section className="py-20 bg-[#FAFAFA] overflow-hidden min-h-screen">
      <div className="px-[25px] w-full">
        <div className="max-w-7xl mx-auto">
          {/* Табы для фильтрации */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-[#1F1D2B] text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Сетка модулей */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                className={`${module.bgColor} rounded-[2.5rem] overflow-hidden shadow-xl ${module.borderColor} border-2 hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
              >
                {/* Изображение */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={module.image}
                    alt={module.title}
                    fill
                    className={`object-cover group-hover:scale-110 transition-transform duration-300 ${module.bgColor === 'bg-white' ? 'opacity-20' : 'opacity-30'}`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${module.bgColor === 'bg-white' ? 'from-white via-white/50 to-transparent' : 'from-[#1F1D2B] via-[#1F1D2B]/50 to-transparent'}`}></div>
                  
                  {/* Иконка */}
                  <div className={`absolute top-6 right-6 w-16 h-16 ${module.bgColor === 'bg-white' ? 'bg-[#1F1D2B]' : 'bg-white/20 backdrop-blur-sm'} rounded-2xl flex items-center justify-center ${module.textColor}`}>
                    {module.icon}
                  </div>
                </div>

                {/* Контент */}
                <div className={`p-8 ${module.textColor}`}>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                    {module.title}
                  </h3>
                  
                  <div className="mb-6 space-y-3">
                    <p className={`text-sm ${module.bgColor === 'bg-white' ? 'text-gray-600' : 'text-gray-300'}`}>
                      <strong>Что это:</strong> {module.whatIs}
                    </p>
                    <p className={`text-sm ${module.bgColor === 'bg-white' ? 'text-gray-600' : 'text-gray-300'}`}>
                      <strong>Кому нужен:</strong> {module.forWhom}
                    </p>
                  </div>

                  {/* Возможности */}
                  <div className="mb-6">
                    <h4 className={`text-sm font-semibold mb-3 ${module.bgColor === 'bg-white' ? 'text-gray-900' : 'text-white'}`}>
                      Возможности:
                    </h4>
                    <ul className="space-y-2">
                      {module.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check size={16} className={`mt-0.5 flex-shrink-0 ${module.bgColor === 'bg-white' ? 'text-[#1F1D2B]' : 'text-white'}`} />
                          <span className={module.bgColor === 'bg-white' ? 'text-gray-600' : 'text-gray-300'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Кнопка */}
                  <Link
                    href="/register"
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                      module.bgColor === 'bg-white'
                        ? 'bg-[#1F1D2B] text-white hover:bg-[#2A2838]'
                        : 'bg-white text-[#1F1D2B] hover:bg-gray-100'
                    }`}
                  >
                    Выбрать модуль
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA секция */}
          <div className="bg-gradient-to-br from-[#1F1D2B] to-[#2A2838] rounded-[2.5rem] p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Не нашли подходящий модуль?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Свяжитесь с нами, и мы поможем создать индивидуальное решение для вашего бизнеса
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#1F1D2B] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
              >
                Начать бесплатно
                <ArrowRight size={20} />
              </Link>
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition border border-white/20">
                Связаться с нами
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
