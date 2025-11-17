/**
 * Shop Module - Cart Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import Link from 'next/link'

export default function CartPage() {
  const cartItems = [
    { id: '1', name: 'Товар 1', price: 1500, image: '👕', quantity: 2 },
    { id: '2', name: 'Товар 2', price: 2500, image: '👔', quantity: 1 },
  ]

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Корзина пуста</p>
            <Link href="/catalog" className="text-blue-600 hover:underline">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-4xl">{item.image}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-sm text-gray-500">Количество: {item.quantity}</div>
                      </div>
                      <button className="text-red-600 hover:text-red-700">Удалить</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Итого</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Товары ({cartItems.length})</span>
                    <span>{total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Доставка</span>
                    <span>Бесплатно</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                    <span>Всего</span>
                    <span>{total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

