'use client'

import { ShoppingCart, Package, Calendar, Sparkles, Shield, Zap, BarChart3, Settings } from 'lucide-react'

interface Possibility {
  icon: React.ReactNode
  title: string
  description: string
}

const possibilities: Possibility[] = [
  {
    icon: <Package size={24} />,
    title: 'Готовые модули',
    description: 'Интернет-магазины, портфолио, мероприятия и другие готовые решения из коробки'
  },
  {
    icon: <Zap size={24} />,
    title: 'Бизнес за 60 секунд',
    description: 'Запустите свой цифровой бизнес без программирования и сложных настроек'
  },
  {
    icon: <Sparkles size={24} />,
    title: 'AI-инструменты',
    description: 'Генератор контента, изображений, баннеров и автоматизация маркетинга'
  },
  {
    icon: <ShoppingCart size={24} />,
    title: '3D-витрины',
    description: 'Интерактивные 3D-модели товаров для повышения конверсии'
  },
  {
    icon: <Shield size={24} />,
    title: 'Полная изоляция',
    description: 'Ваши данные и бизнес полностью изолированы и защищены'
  },
  {
    icon: <Calendar size={24} />,
    title: 'Управление заказами',
    description: 'Обрабатывайте заказы, управляйте товарами и клиентами из личного кабинета'
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Аналитика и отчеты',
    description: 'Отслеживайте продажи, конверсию и ключевые показатели бизнеса'
  },
  {
    icon: <Settings size={24} />,
    title: 'Без комиссий',
    description: 'Мы не берем процент с оборота — все деньги от продаж идут напрямую вам'
  }
]

export const Possibilities = () => {
  return (
    <section id="features" className="py-16 bg-white overflow-hidden">
      <div className="px-[25px] w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1D1D1F] mb-4">
            Возможности, которые нужны вашему бизнесу
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Замените десятки инструментов одной платформой
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Готовые модули, AI-инструменты, 3D-витрины, управление заказами и аналитика — всё необходимое для запуска и развития цифрового бизнеса
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {possibilities.map((possibility, index) => (
            <div
              key={index}
              className="bg-[#F5F5F7] rounded-[2rem] p-6 hover:bg-[#E8E8ED] transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-[#1F1D2B] rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {possibility.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                {possibility.title}
              </h3>
              <p className="text-sm text-gray-600">
                {possibility.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#1D1D1F] mb-3">
              Управляйте товарами и заказами
            </h3>
            <p className="text-gray-600 text-sm">
              Полный контроль над товарами, заказами и клиентами из удобного личного кабинета
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#1D1D1F] mb-3">
              Автоматизируйте маркетинг
            </h3>
            <p className="text-gray-600 text-sm">
              AI-генераторы создают контент и баннеры, одна кнопка публикует во все каналы
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#1D1D1F] mb-3">
              Масштабируйте бизнес
            </h3>
            <p className="text-gray-600 text-sm">
              Добавляйте новые модули, расширяйте функционал и увеличивайте продажи без ограничений
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

