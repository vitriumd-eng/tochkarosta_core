/**
 * Shop Module - Admin Products Page (Dashboard Route)
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 * Плиточный дизайн для управления товарами
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  inStock: boolean
}

const mockProducts: Product[] = [
  { id: '1', name: 'Товар 1', price: 1500, image: '👕', category: 'Одежда', inStock: true },
  { id: '2', name: 'Товар 2', price: 2500, image: '👔', category: 'Одежда', inStock: true },
  { id: '3', name: 'Товар 3', price: 3500, image: '👖', category: 'Одежда', inStock: false },
  { id: '4', name: 'Товар 4', price: 4500, image: '🧥', category: 'Верхняя одежда', inStock: true },
]

export default function AdminProductsPage() {
  const [products] = useState<Product[]>(mockProducts)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Админ панель
            </Link>
            <nav className="flex gap-6">
              <Link href="/admin/products" className="text-blue-600 font-semibold">Товары</Link>
              <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900">Заказы</Link>
              <Link href="/admin/settings" className="text-gray-600 hover:text-gray-900">Настройки</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Управление товарами</h1>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            Добавить товар
          </button>
        </div>

        {/* Products Grid - Плиточный дизайн */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl">{product.image}</div>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Нет в наличии</span>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <div className="text-xl font-bold text-gray-900 mb-4">
                  {product.price.toLocaleString('ru-RU')} ₽
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                    Редактировать
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
