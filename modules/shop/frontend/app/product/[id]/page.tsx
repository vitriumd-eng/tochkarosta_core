/**
 * Shop Module - Product Detail Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { use } from 'react'
import Link from 'next/link'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  // Mock product data
  const product = {
    id,
    name: 'Товар ' + id,
    price: 5000,
    image: '👕',
    category: 'Одежда',
    description: 'Описание товара. Подробная информация о товаре.',
    inStock: true,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Магазин
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-peach-600">Главная</Link>
              <Link href="/catalog" className="text-gray-600 hover:text-peach-600">Каталог</Link>
              <Link href="/about" className="text-gray-600 hover:text-peach-600">О магазине</Link>
              <Link href="/account" className="text-gray-600 hover:text-peach-600">Кабинет</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
              <div className="text-9xl">{product.image}</div>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-sm text-gray-500 mb-2">{product.category}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="text-3xl font-bold text-gray-900 mb-6">
              {product.price.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-gray-600 mb-8">{product.description}</p>
            {product.inStock ? (
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                Добавить в корзину
              </button>
            ) : (
              <button className="w-full px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed" disabled>
                Нет в наличии
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

