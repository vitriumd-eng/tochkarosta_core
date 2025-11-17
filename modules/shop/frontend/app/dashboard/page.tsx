/**
 * Dashboard - Main Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../components/dashboard/Sidebar'
import StatsCard from '../../components/dashboard/StatsCard'
import QuickActionCard from '../../components/dashboard/QuickActionCard'

export default function DashboardPage() {
  const [subscriptionStatus] = useState({ plan: 'Базовый', status: 'Активна', shopId: 'SHOP-12345', isPremium: false })

  const recentOrders = [
    { id: '#1001', customer: 'Иван Иванов', status: 'Новый', amount: 5000, avatar: 'И' },
    { id: '#1002', customer: 'Мария Петрова', status: 'В обработке', amount: 3500, avatar: 'М' },
    { id: '#1003', customer: 'Алексей Сидоров', status: 'Отправлен', amount: 7200, avatar: 'А' },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Новый': 'bg-orange-100 text-orange-800',
      'В обработке': 'bg-blue-100 text-blue-800',
      'Отправлен': 'bg-purple-100 text-purple-800',
      'Доставлен': 'bg-green-100 text-green-800',
      'Отменен': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" userEmail="ivan@example.com" userId="USER-123" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">Добро пожаловать!</h1>
          
          {/* Subscription Card - только для владельца, скрыта на мобильных */}
          <div className="hidden lg:block bg-white rounded-xl shadow-md p-6 max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Тарифный план</p>
                <p className="text-lg font-bold text-gray-900">{subscriptionStatus.plan}</p>
              </div>
              {subscriptionStatus.isPremium && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                  PREMIUM
                </span>
              )}
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Статус</p>
              <p className="text-sm font-semibold text-green-600">{subscriptionStatus.status}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Shop ID</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono text-gray-900">{subscriptionStatus.shopId}</p>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <button className="w-full px-4 py-2 gradient-button text-white rounded-xl hover:opacity-90 transition font-medium shadow-button">
              Управление подпиской →
            </button>
          </div>
        </div>

        {/* Stats Cards - скрыты на мобильных */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon="🚀" label="Заказов сегодня" value={12} color="blue" />
          <StatsCard icon="👥" label="Новых клиентов" value={5} color="green" />
          <StatsCard icon="👗" label="Заказов по фото" value={3} color="purple" />
          <StatsCard icon="💰" label="Выручка" value="45 000 ₽" color="orange" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <QuickActionCard icon="➕" label="Добавить товар" href="/dashboard/catalog" color="blue" />
          <QuickActionCard icon="📋" label="Просмотреть заказы" href="/dashboard/orders" color="green" />
          <QuickActionCard icon="💬" label="Внутренний Чат" href="/dashboard/chat" color="pink" />
          <QuickActionCard icon="🤖" label="AI Примерки" href="/dashboard/photo-order" color="purple" />
        </div>

        {/* Recent Orders - скрыты на мобильных */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Последние заказы</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full gradient-avatar flex items-center justify-center text-white font-semibold">
                    {order.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-gray-900">{order.amount.toLocaleString('ru-RU')} ₽</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Chat Button - только на мобильных */}
        <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-peach-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-peach-600 transition z-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </main>
    </div>
  )
}

