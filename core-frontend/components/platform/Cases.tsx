'use client'

import { useState } from 'react'
import { ShoppingCart, Briefcase, GraduationCap, MoreHorizontal, Check } from 'lucide-react'

type TabType = 'sales' | 'services' | 'education' | 'other'

interface TabContent {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
}

const tabs: Record<TabType, TabContent> = {
  sales: {
    title: 'Автоматизация торговли',
    description: 'Создайте интернет-магазин, настройте автоматизацию продаж и управляйте заказами из одного места.',
    features: [
      'Создайте сайт на удобном конструкторе',
      'Внедрите чат-боты в общение с клиентами',
      'Просматривайте аналитику продаж',
      'Общайтесь с клиентами в одном окне',
      'Используйте ИИ для быстрых ответов клиентам',
      'Используйте весь функционал Точка.Роста'
    ],
    icon: <ShoppingCart size={24} />
  },
  services: {
    title: 'Автоматизация сферы услуг',
    description: 'Для любого бизнеса: аренда, услуги и перевозки. Управляйте записями и клиентами автоматически.',
    features: [
      'Групповые и индивидуальные занятия',
      'Онлайн-запись клиентов на сайте и в боте',
      'Бронирование мест по предоплате',
      'ИИ для записи клиентов в мессенджерах',
      'Управление записями в едином окне'
    ],
    icon: <Briefcase size={24} />
  },
  education: {
    title: 'Для сферы онлайн-обучения',
    description: 'Создавайте курсы, продавайте их и управляйте учениками из единой платформы.',
    features: [
      'Гибкая настройка уроков и практических заданий',
      'Продажа курсов через сайт и чат-бот',
      'Общение с учениками в одном окне',
      'Выдача сертификатов об окончании курса',
      'Настройка реферальной программы',
      'Доступ кураторов для поддержки учеников'
    ],
    icon: <GraduationCap size={24} />
  },
  other: {
    title: 'Еще больше возможностей',
    description: 'Платформа Точка.Роста подходит для любых бизнес-задач. Расширяйте функционал по мере роста.',
    features: [
      'CRM для работы с клиентами',
      'Проведение трансляций и автовебов',
      'Виджет обратного звонка и сбора заявок',
      'Рассылки в мессенджеры и email',
      'Онлайн-запись для автобусных перевозок',
      'Прием платежей на сайте, в курсах и боте'
    ],
    icon: <MoreHorizontal size={24} />
  }
}

export const Cases = () => {
  const [activeTab, setActiveTab] = useState<TabType>('sales')

  return (
    <section id="cases" className="py-16 bg-white overflow-hidden">
      <div className="px-[25px] w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1D1D1F] mb-4">
            Для каких бизнесов подходит
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Решения, которые работают в вашей сфере. Вам не нужно внедрять несколько разных сервисов, чтобы автоматизировать ваши бизнес-процессы. Просто используйте универсальное решение для всех задач.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(tabs).map(([key, tab]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabType)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === key
                  ? 'bg-[#1F1D2B] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span>
                  {key === 'sales' && 'Продажи'}
                  {key === 'services' && 'Услуги'}
                  {key === 'education' && 'Образование'}
                  {key === 'other' && 'Другие'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#F5F5F7] rounded-[2rem] p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#1F1D2B] rounded-full flex items-center justify-center text-white">
                {tabs[activeTab].icon}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-2">
                  {tabs[activeTab].title}
                </h3>
                <p className="text-gray-600">
                  {tabs[activeTab].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {tabs[activeTab].features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check size={20} className="text-[#1F1D2B]" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


