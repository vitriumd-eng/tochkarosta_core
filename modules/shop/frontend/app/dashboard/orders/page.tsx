/**
 * Dashboard - Orders Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'

interface Order {
  id: string
  date: string
  customer: string
  phone: string
  address: string
  items: string[]
  total: number
  status: 'Новый' | 'В обработке' | 'Отправлен' | 'Доставлен' | 'Отменен'
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Все заказы')

  const orders: Order[] = [
    {
      id: '#1001',
      date: '2025-01-15 10:30',
      customer: 'Иван Иванов',
      phone: '+7 (999) 123-45-67',
      address: 'г. Москва, ул. Ленина, д. 10, кв. 5',
      items: ['Платье розовое', 'Футболка синяя'],
      total: 5000,
      status: 'Новый',
    },
    {
      id: '#1002',
      date: '2025-01-15 09:15',
      customer: 'Мария Петрова',
      phone: '+7 (999) 234-56-78',
      address: 'г. Москва, пр. Мира, д. 20',
      items: ['Обувь детская'],
      total: 3500,
      status: 'В обработке',
    },
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Все заказы' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalOrders = orders.length
  const newOrders = orders.filter(o => o.status === 'Новый').length
  const inProcess = orders.filter(o => o.status === 'В обработке').length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Заказы</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">📋 Всего заказов</p>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">🆕 Новые заказы</p>
            <p className="text-3xl font-bold text-orange-600">{newOrders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">⚙️ В обработке</p>
            <p className="text-3xl font-bold text-blue-600">{inProcess}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">💰 Выручка</p>
            <p className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="🔍 Поиск заказа"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
            >
              <option>Все заказы</option>
              <option>Новые</option>
              <option>В обработке</option>
              <option>Отправлены</option>
              <option>Доставлены</option>
              <option>Отменены</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Клиент:</span> {order.customer}</p>
                    <p><span className="font-semibold">Телефон:</span> {order.phone}</p>
                    <p><span className="font-semibold">Адрес:</span> {order.address}</p>
                    <div>
                      <span className="font-semibold">Товары:</span>
                      <ul className="list-disc list-inside ml-2">
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <p className="text-2xl font-bold text-gray-900">{order.total.toLocaleString('ru-RU')} ₽</p>
                  <div className="flex gap-2">
                    <select
                      defaultValue={order.status}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option>Новый</option>
                      <option>В обработке</option>
                      <option>Отправлен</option>
                      <option>Доставлен</option>
                      <option>Отменен</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium">
                      Детали
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

