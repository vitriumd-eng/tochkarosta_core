'use client'

import { Package, MessageSquare, ShoppingCart, Calendar, Sparkles, Users, TrendingUp, Bell } from 'lucide-react'
import Image from 'next/image'

export const UseCases = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="px-[50px] w-full mb-20">
        {/* Верхняя секция: две карточки с соотношением 16:9 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch max-w-[1400px] mx-auto">
          {/* Карточка 1: Интернет-Магазин */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col relative" style={{ aspectRatio: '16/9', minHeight: '100%', maxWidth: '700px' }}>
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
                alt="Интернет-магазин"
                fill
                className="object-cover opacity-20"
              />
            </div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1D1D1F] mb-4">
                Интернет-Магазин
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                <strong>Что это:</strong> Готовый интернет-магазин с каталогом товаров, корзиной и приёмом платежей.
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Кому нужен:</strong> Предпринимателям, которые хотят продавать товары онлайн без разработки сайта.
              </p>
            </div>
          </div>

          {/* Карточка 2: Строительный бизнес */}
          <div className="bg-[#1F1D2B] rounded-[2.5rem] overflow-hidden text-white flex flex-col relative" style={{ aspectRatio: '16/9', minHeight: '100%', maxWidth: '700px' }}>
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop"
                alt="Строительный бизнес"
                fill
                className="object-cover opacity-30"
              />
            </div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Строительный бизнес
              </h2>
              <p className="text-gray-400 text-sm mb-2">
                <strong>Что это:</strong> Система для управления строительными проектами, расчёта смет и работы с клиентами.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Кому нужен:</strong> Строительным компаниям, подрядчикам и архитекторам для автоматизации работы.
              </p>
            </div>
          </div>
        </div>

        {/* Нижняя секция: три карточки модулей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch max-w-[1400px] mx-auto">
          {/* Карточка 1: Мероприятия */}
          <div className="bg-[#1F1D2B] rounded-[2.5rem] overflow-hidden text-white flex flex-col h-full relative" style={{ maxWidth: '700px' }}>
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop"
                alt="Мероприятия"
                fill
                className="object-cover opacity-30"
              />
            </div>
            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Мероприятия
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                <strong>Что это:</strong> Платформа для организации событий с продажей билетов и управлением участниками.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Кому нужен:</strong> Организаторам конференций, вебинаров, мастер-классов и других мероприятий.
              </p>
            </div>
          </div>

          {/* Карточка 2: Курсы */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-lg flex flex-col h-full relative" style={{ maxWidth: '700px' }}>
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop"
                alt="Курсы"
                fill
                className="object-cover opacity-20"
              />
            </div>
            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
              <h3 className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-4">
                Курсы/Обучение
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                <strong>Что это:</strong> Платформа для продажи онлайн-курсов с отслеживанием прогресса и выдачей сертификатов.
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Кому нужен:</strong> Преподавателям, экспертам и образовательным платформам для продажи знаний.
              </p>
            </div>
          </div>

          {/* Карточка 3: Портфолио */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-lg flex flex-col h-full relative" style={{ maxWidth: '700px' }}>
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                alt="Портфолио"
                fill
                className="object-cover opacity-20"
              />
            </div>
            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
              <h3 className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-4">
                Портфолио
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                <strong>Что это:</strong> Сайт-портфолио для демонстрации работ с приёмом заказов и контактами.
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Кому нужен:</strong> Фотографам, дизайнерам, художникам и другим творческим профессионалам.
              </p>
            </div>
          </div>
        </div>

        {/* Кнопка под всеми карточками */}
        <div className="flex justify-center mt-8">
          <button className="bg-[#1F1D2B] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2A2838] transition">
            Выбрать модули
          </button>
        </div>
      </div>
    </section>
  )
}
