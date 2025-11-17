/**
 * Dashboard - Subscription Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'

interface Tariff {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  maxStaff: number
  maxClients: number
  features: string[]
}

export default function SubscriptionPage() {
  const [currentSubscription] = useState({
    plan: 'Базовый',
    status: 'Активна',
    endDate: '2025-02-15',
    daysLeft: 30,
    isPremium: false,
  })

  const tariffs: Tariff[] = [
    {
      id: '1',
      name: 'Базовый',
      monthlyPrice: 990,
      yearlyPrice: 9900,
      maxStaff: 3,
      maxClients: 100,
      features: ['До 100 клиентов', 'До 3 сотрудников', 'Базовые функции'],
    },
    {
      id: '2',
      name: 'Премиум',
      monthlyPrice: 2990,
      yearlyPrice: 29900,
      maxStaff: 10,
      maxClients: 1000,
      features: ['До 1000 клиентов', 'До 10 сотрудников', 'Все функции', 'Custom Domain'],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Подписка</h1>

        {/* Current Subscription */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Информация о Текущей Подписке</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Название тарифа</p>
              <p className="text-xl font-bold text-gray-900">{currentSubscription.plan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Статус подписки</p>
              <p className="text-xl font-bold text-green-600">{currentSubscription.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Дата окончания</p>
              <p className="text-xl font-bold text-gray-900">{currentSubscription.endDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Дней осталось</p>
              <p className="text-xl font-bold text-gray-900">{currentSubscription.daysLeft}</p>
            </div>
          </div>

          {currentSubscription.isPremium && (
            <div className="mt-4">
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                PREMIUM
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Действия</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
              🔄 Сменить тариф
            </button>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
              📅 Продлить подписку
            </button>
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium">
              ❌ Отменить подписку
            </button>
          </div>
        </div>

        {/* Available Tariffs */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Доступные Тарифы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tariffs.map((tariff) => (
              <div key={tariff.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-peach-500 transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{tariff.name}</h3>
                  {tariff.name === 'Премиум' && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                      PREMIUM
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">{tariff.monthlyPrice.toLocaleString('ru-RU')} ₽</p>
                  <p className="text-sm text-gray-500">в месяц</p>
                  <p className="text-lg text-gray-600 mt-1">
                    {tariff.yearlyPrice.toLocaleString('ru-RU')} ₽ в год (со скидкой)
                  </p>
                </div>

                <div className="mb-4 space-y-2">
                  <p className="text-sm text-gray-600">👥 До {tariff.maxStaff} сотрудников</p>
                  <p className="text-sm text-gray-600">👤 До {tariff.maxClients} клиентов</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {tariff.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <button className="w-full px-6 py-3 gradient-button text-white rounded-xl hover:opacity-90 transition font-semibold shadow-button">
                  Выбрать тариф
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

