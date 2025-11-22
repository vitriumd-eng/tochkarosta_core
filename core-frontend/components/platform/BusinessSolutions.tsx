'use client'

import { useState } from 'react'
import { Globe, MessageSquare, BarChart3, Users, Sparkles, Settings } from 'lucide-react'

export const BusinessSolutions = () => {
  const [activeTab, setActiveTab] = useState('sales')

  const tabs = [
    { id: 'sales', label: 'Продажи' },
    { id: 'services', label: 'Услуги' },
    { id: 'education', label: 'Образование' },
    { id: 'other', label: 'Другие' }
  ]

  const solutions = {
    sales: {
      title: 'Интернет-магазины',
      features: [
        { icon: Globe, text: 'Готовый модуль интернет-магазина за 60 секунд' },
        { icon: MessageSquare, text: 'Удобный каталог товаров с фотографиями' },
        { icon: BarChart3, text: 'Встроенная аналитика продаж и конверсии' },
        { icon: Users, text: 'Управление заказами и клиентами в одном месте' },
        { icon: Sparkles, text: 'AI-генератор описаний товаров и контента' },
        { icon: Settings, text: 'Прямые платежи на ваш счет без комиссии платформы' }
      ]
    },
    services: {
      title: 'Сфера услуг',
      subtitle: 'Для любого бизнеса: аренда, услуги, консультации',
      features: [
        { icon: Users, text: 'Модуль портфолио для демонстрации работ' },
        { icon: MessageSquare, text: 'Прием заявок и бронирование онлайн' },
        { icon: Sparkles, text: 'AI-консультант для ответов на вопросы' },
        { icon: Settings, text: 'Управление проектами и клиентами' }
      ]
    },
    education: {
      title: 'Онлайн-образование',
      features: [
        { icon: Settings, text: 'Модуль для продажи онлайн-курсов' },
        { icon: Globe, text: 'Личный кабинет для учеников' },
        { icon: Users, text: 'Выдача сертификатов об окончании' },
        { icon: BarChart3, text: 'Отслеживание прогресса обучения' },
        { icon: MessageSquare, text: 'Интеграция с платежными системами' },
        { icon: Users, text: 'Поддержка кураторов и обратная связь' }
      ]
    },
    other: {
      title: 'Другие возможности',
      features: [
        { icon: Users, text: 'Модуль для строительного бизнеса' },
        { icon: MessageSquare, text: 'Модуль для мероприятий и продажи билетов' },
        { icon: Globe, text: 'Блог для публикации контента' },
        { icon: Users, text: 'CRM для управления клиентами и сделками' },
        { icon: MessageSquare, text: 'Автоматизация маркетинга в один клик' },
        { icon: Settings, text: 'Полная изоляция данных каждого бизнеса' },
        { icon: BarChart3, text: 'Масштабирование без ограничений' }
      ]
    }
  }

  const currentSolution = solutions[activeTab as keyof typeof solutions]

  return (
    <section id="business" className="py-20 bg-[#1F1D2B] text-white overflow-hidden">
      <div className="px-[25px] w-full">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Левая часть: Текст и чат-примеры */}
            <div>
              <p className="text-orange-400 text-sm font-medium mb-2">Для каких бизнесов подходит</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Готовые модули для вашего бизнеса
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Точка.Роста предлагает готовые цифровые бизнесы (Модули) для разных сфер. Выберите подходящий модуль и начните продавать за 60 секунд без программирования
              </p>

              {/* Чат-примеры */}
              <div className="space-y-3">
                <div className="bg-[#2A2838] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">ТР</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Точка.Роста</span>
                      <span className="text-xs text-gray-400">5 мин назад</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Новый заказ: Интернет-магазин "Стиль". Товар: Куртка зимняя. Сумма: 4 500 ₽
                    </p>
                  </div>
                </div>

                <div className="bg-[#2A2838] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">ИП</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Иванов Петр</span>
                      <span className="text-xs text-gray-400">1 час назад</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-300">Модуль портфолио активирован</span>
                      <span className="text-sm font-semibold text-orange-400">5 000 ₽/мес</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2A2838] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">АК</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="какие модули доступны?"
                      className="w-full bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Правая часть: Табы и возможности */}
            <div>
              {/* Табы */}
              <div className="flex gap-2 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-[#1F1D2B]'
                        : 'bg-[#2A2838] text-gray-300 hover:bg-[#353344]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Заголовок секции */}
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {currentSolution.title}
              </h3>
              {currentSolution.subtitle && (
                <p className="text-gray-300 mb-6">{currentSolution.subtitle}</p>
              )}

              {/* Список возможностей */}
              <div className="space-y-4 mb-8">
                {currentSolution.features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#2A2838] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-orange-400" />
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed pt-2">
                        {feature.text}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Кнопки */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition">
                  Запустить бизнес
                </button>
                <button className="bg-[#2A2838] hover:bg-[#353344] text-white px-8 py-4 rounded-lg font-semibold transition">
                  Попробовать бесплатно
                  <span className="block text-xs text-gray-400 mt-1 font-normal">
                    Бизнес за 60 секунд
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
