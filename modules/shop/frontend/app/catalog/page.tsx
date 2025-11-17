/**
 * Shop Module - Catalog Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 * Плиточный дизайн - grid layout с фильтрами
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

const allProducts: Product[] = [
  { id: '1', name: 'Товар 1', price: 1500, image: '👕', category: 'Одежда', inStock: true },
  { id: '2', name: 'Товар 2', price: 2500, image: '👔', category: 'Одежда', inStock: true },
  { id: '3', name: 'Товар 3', price: 3500, image: '👖', category: 'Одежда', inStock: false },
  { id: '4', name: 'Товар 4', price: 4500, image: '🧥', category: 'Верхняя одежда', inStock: true },
  { id: '5', name: 'Товар 5', price: 5500, image: '👗', category: 'Платья', inStock: true },
  { id: '6', name: 'Товар 6', price: 6500, image: '👟', category: 'Обувь', inStock: true },
  { id: '7', name: 'Товар 7', price: 7500, image: '🩳', category: 'Одежда', inStock: true },
  { id: '8', name: 'Товар 8', price: 8500, image: '👡', category: 'Обувь', inStock: false },
  { id: '9', name: 'Товар 9', price: 9500, image: '🎩', category: 'Аксессуары', inStock: true },
  { id: '10', name: 'Товар 10', price: 10500, image: '🧢', category: 'Аксессуары', inStock: true },
  { id: '11', name: 'Товар 11', price: 11500, image: '👒', category: 'Аксессуары', inStock: true },
  { id: '12', name: 'Товар 12', price: 12500, image: '👜', category: 'Аксессуары', inStock: true },
]

const categories = ['Все', 'Одежда', 'Верхняя одежда', 'Платья', 'Обувь', 'Аксессуары']

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
              <Link href="/catalog" className="text-peach-600 font-semibold">Каталог</Link>
              <Link href="/about" className="text-gray-600 hover:text-peach-600">О магазине</Link>
              <Link href="/account" className="text-gray-600 hover:text-peach-600">Кабинет</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Каталог товаров</h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - Плиточный дизайн */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
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
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  {product.inStock && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      В корзину
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Товары не найдены</p>
          </div>
        )}
      </main>
    </div>
  )
}
