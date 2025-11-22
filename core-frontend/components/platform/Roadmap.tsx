'use client'

import { Calendar, Rocket, Zap, Globe, Users, Sparkles, TrendingUp } from 'lucide-react'

export const RoadMap = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      period: 'Январь - Март',
      icon: Rocket,
      title: 'Запуск и стабилизация',
      items: [
        'Публичный запуск платформы',
        'Первые 100 активных пользователей',
        'Стабилизация базовых модулей',
        'Интеграция с основными платежными системами'
      ],
      color: 'bg-blue-500'
    },
    {
      quarter: 'Q2 2026',
      period: 'Апрель - Июнь',
      icon: Zap,
      title: 'Расширение функционала',
      items: [
        'Запуск AI-генератора контента',
        'Добавление модуля для мероприятий',
        'Интеграция с Telegram и VK',
        'Улучшение 3D-витрин'
      ],
      color: 'bg-purple-500'
    },
    {
      quarter: 'Q3 2026',
      period: 'Июль - Сентябрь',
      icon: Globe,
      title: 'Масштабирование',
      items: [
        'Запуск реферальной программы',
        'Добавление модуля для онлайн-курсов',
        'Расширение аналитики',
        'Мобильное приложение (iOS/Android)'
      ],
      color: 'bg-green-500'
    },
    {
      quarter: 'Q4 2026',
      period: 'Октябрь - Декабрь',
      icon: TrendingUp,
      title: 'Инновации и рост',
      items: [
        'AI-ассистент для владельцев бизнесов',
        'Маркетплейс готовых решений',
        'Интеграция с популярными CRM',
        'Достижение 1000+ активных пользователей'
      ],
      color: 'bg-orange-500'
    }
  ]

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="px-[25px] w-full">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mb-4">
              Road Map 2026
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              План развития платформы Точка.Роста на 2026 год. Мы постоянно работаем над улучшением и добавлением новых возможностей.
            </p>
          </div>

          <div className="relative">
            {/* Горизонтальная линия */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-gray-200 hidden md:block"></div>

            {/* Милстоуны - горизонтальная раскладка */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon
                return (
                  <div key={index} className="relative flex flex-col items-center">
                    {/* Иконка */}
                    <div className={`${milestone.color} w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg relative z-10 mb-4`}>
                      <Icon size={28} />
                    </div>

                    {/* Контент */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 w-full h-full flex flex-col mt-8 relative">
                      {/* Вертикальная линия от карточки к горизонтальной линии */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-200 hidden md:block z-0"></div>
                      <div className="mb-4 text-center">
                        <div className="text-sm font-semibold text-gray-900 mb-1">{milestone.quarter}</div>
                        <div className="text-xs text-gray-500">{milestone.period}</div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1D1D1F] mb-4 text-center">
                        {milestone.title}
                      </h3>
                      <ul className="space-y-2 flex-1">
                        {milestone.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Стрелка между элементами (кроме последнего) */}
                    {index < milestones.length - 1 && (
                      <div className="hidden lg:block absolute top-8 -right-3 z-20">
                        <div className="w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-300"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full">
              <Calendar size={20} />
              <span className="font-medium">Road Map обновляется ежеквартально</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
