/**
 * Shop Module - Home Page (Public Route)
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 * Дизайн 1 в 1 со скриншота
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ShopHomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Все')

  const categories = ['Все', 'ОБУВЬ', 'ВЕРХНЯЯ ОДЕЖДА', 'ПРАЗДНИЧНАЯ']

  const products = [
    { id: '1', name: 'Новый товар', price: 0, category: 'mini', tag: 'Осталось 3 шт', imageType: 'ai' },
    { id: '2', name: 'Болая рубашка', price: 0, category: 'outerwear', imageType: 'no-bg' },
    { id: '3', name: 'Джинсы', price: 0, category: 'party', imageType: 'ai' },
    { id: '4', name: 'Куртка зимняя', price: 0, category: 'mini', tag: 'Осталось 3 шт', imageType: 'no-bg' },
    { id: '5', name: 'Новый товар', price: 0, category: 'outerwear', imageType: 'ai', outOfStock: true },
    { id: '6', name: 'Болая рубашка', price: 0, category: 'party', imageType: 'no-bg' },
    { id: '7', name: 'Джинсы', price: 0, category: 'mini', imageType: 'ai' },
    { id: '8', name: 'Куртка зимняя', price: 0, category: 'outerwear', tag: 'Осталось 3 шт', imageType: 'no-bg' },
    { id: '9', name: 'Новый товар', price: 0, category: 'party', imageType: 'ai' },
    { id: '10', name: 'Болая рубашка', price: 0, category: 'mini', imageType: 'no-bg' },
    { id: '11', name: 'Джинсы', price: 0, category: 'outerwear', imageType: 'ai' },
    { id: '12', name: 'Куртка зимняя', price: 0, category: 'party', imageType: 'no-bg' },
    { id: '13', name: 'Новый товар', price: 0, category: 'mini', imageType: 'ai' },
    { id: '14', name: 'Болая рубашка', price: 0, category: 'outerwear', imageType: 'no-bg' },
    { id: '15', name: 'Джинсы', price: 0, category: 'party', imageType: 'ai' },
    { id: '16', name: 'Куртка зимняя', price: 0, category: 'mini', imageType: 'no-bg' },
  ]

  const reviews = [
    { name: 'ИВАНОВ ИВАН', text: 'пример текста отзыва. короткий абзац имитации комментария.' },
    { name: 'ПЕТРОВА АННА', text: 'пример текста отзыва. короткий абзац имитации комментария.' },
    { name: 'СИДОРОВ ПЕТР', text: 'пример текста отзыва. короткий абзац имитации комментария.' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#3A3632] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold">
              точка роста
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-peach-400">Главная</Link>
              <Link href="/catalog" className="hover:text-peach-400">Каталог</Link>
              <Link href="/about" className="hover:text-peach-400">Наш Магазин</Link>
              <Link href="/account" className="hover:text-peach-400">Вход</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FFE5CC] via-[#FFD6B3] to-[#FFF5EC] py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Promo Banner */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Свежий привоз</h3>
              <p className="text-sm text-gray-600">Новые модели уже в наличии. Смотрите каталог брендов</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold">
                АКЦИЯ 20%
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">2д 23:14:06</div>
                <div className="text-xs text-gray-600">До конца акции</div>
              </div>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Онлайн примерка — примерьте образ на фото ребёнка
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Загрузите фото — и за пару минут получите AI-примерку выбранной модели. Быстро, безопасно и наглядно: изображения удаляются после генерации.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/catalog"
                  className="px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg"
                >
                  Каталог
                </Link>
                <Link
                  href="/catalog"
                  className="px-8 py-4 bg-[#1E40AF] text-white rounded-xl font-semibold hover:bg-[#1E3A8A] transition shadow-lg"
                >
                  Новые поступления
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* Мишка с лентами - placeholder для изображения */}
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-blue-200 to-orange-200 rounded-2xl flex items-center justify-center">
                  <div className="text-9xl">🧸</div>
                </div>
                {/* Декоративные ленты */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-purple-400 rounded-full opacity-60 blur-xl"></div>
                <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-400 rounded-full opacity-60 blur-xl"></div>
                <div className="absolute top-1/2 right-20 w-16 h-16 bg-orange-400 rounded-full opacity-60 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Как работает онлайн примерка
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Шаг 1</h3>
              <p className="text-gray-600">Загрузите фото ребенка в полный рост</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Шаг 2</h3>
              <p className="text-gray-600">Добавьте фото лица крупным планом</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Шаг 3</h3>
              <p className="text-gray-600">Получите результат</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Каталог</h2>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-square">
                  {product.imageType === 'ai' ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
                      <span className="text-sm text-gray-600">AI Фото — Пример</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center">
                      <span className="text-sm text-gray-600">Фото без фона — Пример</span>
                    </div>
                  )}
                  {product.tag && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {product.tag}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-medium text-gray-700">
                    {product.category}
                  </div>
                  {product.outOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Нет в наличии</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price} руб
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Отзывы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                  <div className="font-semibold text-gray-900">{review.name}</div>
                </div>
                <p className="text-gray-600 text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Категории</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Кроссовки', 'Платья', 'Куртки'].map((category, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Категория — изображение</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category}</h3>
                  <p className="text-gray-600 mb-4">Цена: 0 руб</p>
                  <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium">
                    Смотреть
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3A3632] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Городец</h3>
              <p className="text-gray-400 text-sm">© 2025 Все права защищены</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="text-gray-400 hover:text-white text-sm">Главная</Link>
                <Link href="/catalog" className="text-gray-400 hover:text-white text-sm">Каталог</Link>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm">Наш Магазин</Link>
              </nav>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <p className="text-gray-400 text-sm mb-2">Городец, Россия</p>
              <p className="text-gray-400 text-sm mb-2">Пн-Пт 10:00-18:00</p>
              <p className="text-gray-400 text-sm mb-4">Сб-Вс 11:00-18:00</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
              >
                <span>🔒</span>
                Админ панель
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">Сделано с ❤️ для детей и их родителей</p>
            <div className="text-xl font-bold">точка роста</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
