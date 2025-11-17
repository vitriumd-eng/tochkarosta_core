/**
 * Dashboard - Catalog Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'

interface ProductGroup {
  id: string
  icon: string
  name: string
  description: string
  productCount: number
}

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const groups: ProductGroup[] = [
    { id: '1', icon: '👗', name: 'Платья', description: 'Платья для девочек', productCount: 15 },
    { id: '2', icon: '👕', name: 'Футболки', description: 'Футболки для мальчиков', productCount: 23 },
    { id: '3', icon: '👟', name: 'Обувь', description: 'Детская обувь', productCount: 8 },
  ]

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalProducts = groups.reduce((sum, group) => sum + group.productCount, 0)
  const totalGroups = groups.length
  const avgProductsPerGroup = totalGroups > 0 ? Math.round(totalProducts / totalGroups) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Каталог</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 gradient-button text-white rounded-xl hover:opacity-90 transition font-semibold shadow-button"
          >
            Создать группу
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">Всего товаров в каталоге</p>
            <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">Групп товаров</p>
            <p className="text-3xl font-bold text-gray-900">{totalGroups}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">Средний товаров на группу</p>
            <p className="text-3xl font-bold text-gray-900">{avgProductsPerGroup}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Поиск группы товаров"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
          />
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group">
              <div className="text-6xl mb-4">{group.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <p className="text-sm text-gray-500 mb-4">Товаров: {group.productCount}</p>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                  Открыть
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Создать группу</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Иконка группы</label>
                <input
                  type="text"
                  placeholder="👗"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Название группы *</label>
                <input
                  type="text"
                  placeholder="Платья"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  placeholder="Краткое описание назначения группы"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Отмена
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 gradient-button text-white rounded-xl hover:opacity-90 transition font-medium shadow-button"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

