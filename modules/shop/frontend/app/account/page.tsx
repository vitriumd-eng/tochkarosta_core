/**
 * Account - Buyer Personal Cabinet
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'orders' | 'loyalty'>('home')
  const [showQuestionModal, setShowQuestionModal] = useState(false)

  const recentOrders = [
    { id: '#1001', date: '2025-01-15', status: 'Доставлен', items: ['Платье розовое'], total: 2500 },
    { id: '#1002', date: '2025-01-10', status: 'Отправлен', items: ['Футболка синяя'], total: 1500 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Магазин</h1>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'home' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🏠</span>
                  <span className="font-medium">Главная</span>
                </button>
              </li>
              <li>
                <a
                  href="/catalog"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <span className="text-xl">📦</span>
                  <span className="font-medium">Каталог</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('cart')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'cart' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🛒</span>
                  <span className="font-medium">Корзина</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'orders' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📋</span>
                  <span className="font-medium">Заказы</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('loyalty')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'loyalty' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🎁</span>
                  <span className="font-medium">Программа Лояльности</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowQuestionModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <span className="text-xl">❓</span>
                  <span className="font-medium">Задать вопрос</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-avatar flex items-center justify-center text-white font-semibold">
                И
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">Иван Иванов</p>
                <p className="text-sm text-gray-500 truncate">ivan@example.com</p>
                <p className="text-xs text-gray-400 truncate">+7 (999) 123-45-67</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium">
              🚪 Выход
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-6 lg:p-8">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Добро пожаловать!</h1>
              <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🎁</span>
                  <div>
                    <p className="text-sm opacity-90">Бонусы</p>
                    <p className="text-3xl font-bold">1 250</p>
                    <p className="text-sm opacity-90">баллов</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider placeholder */}
            <div className="bg-white rounded-xl shadow-md p-12 mb-8 text-center">
              <p className="text-gray-500">📸 Слайдер с акциями и новинками</p>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">История заказов</h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.items.join(', ')}</p>
                    <p className="font-bold text-gray-900">{order.total.toLocaleString('ru-RU')} ₽</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[
                  { id: '1', name: 'Платье розовое', price: 2500, quantity: 2, image: '👗' },
                  { id: '2', name: 'Футболка синяя', price: 1500, quantity: 1, image: '👕' },
                ].map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-gray-900">{item.price.toLocaleString('ru-RU')} ₽</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button className="px-2 py-1 border border-gray-300 rounded">-</button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button className="px-2 py-1 border border-gray-300 rounded">+</button>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-700">Удалить</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Итого</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Товары (3)</span>
                      <span>6 500 ₽</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Скидка</span>
                      <span className="text-green-600">-650 ₽</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                      <span>Всего</span>
                      <span>5 850 ₽</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Использовать бонусы</label>
                    <input
                      type="number"
                      placeholder="0"
                      max={1755}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Максимум 30% от суммы (1 755 баллов)</p>
                  </div>
                  <button className="w-full px-6 py-3 gradient-button text-white rounded-xl hover:opacity-90 transition font-semibold shadow-button">
                    Оформить заказ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Заказы</h1>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Доставлен' ? 'bg-green-100 text-green-800' :
                      order.status === 'Отправлен' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex gap-4 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        {item.includes('Платье') ? '👗' : '👕'}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">{order.total.toLocaleString('ru-RU')} ₽</p>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Программа Лояльности</h1>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-500 mb-2">💰 Потрачено в этом месяце</p>
                <p className="text-3xl font-bold text-gray-900">25 000 ₽</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-500 mb-2">📊 Всего потрачено</p>
                <p className="text-3xl font-bold text-gray-900">125 000 ₽</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-500 mb-2">🛒 Покупок в этом месяце</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
            </div>

            {/* Levels */}
            <div className="space-y-6 mb-8">
              {[
                { name: 'Серебряный', condition: 30000, discount: 10, spent: 25000, active: false },
                { name: 'Золотой', condition: 100000, discount: 20, spent: 25000, active: false },
                { name: 'VIP', condition: 150000, discount: 30, spent: 25000, active: false },
              ].map((level) => (
                <div key={level.name} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">✨ {level.name} уровень</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      level.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {level.active ? 'Активен' : `Осталось: ${(level.condition - level.spent).toLocaleString('ru-RU')} ₽`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Условие: Потратить от {level.condition.toLocaleString('ru-RU')}₽ в месяц
                  </p>
                  <p className="text-sm text-gray-600 mb-4">Скидка: {level.discount}% | Действует: 7 дней</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="gradient-button h-2 rounded-full"
                      style={{ width: `${Math.min((level.spent / level.condition) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Frequent Buyer */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔄 Частый покупатель</h3>
              <p className="text-sm text-gray-600 mb-4">
                Условие: Совершить 15 или более покупок в месяц, каждая на сумму от 1000₽
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">Ваших покупок: 8 / 15</p>
                <p className="text-sm text-gray-600">Средний чек: 3 125 ₽</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="gradient-button h-2 rounded-full" style={{ width: '53%' }} />
              </div>
              <p className="text-sm text-gray-600">Осталось покупок: 7</p>
            </div>
          </div>
        )}

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Задать вопрос</h2>
              <textarea
                placeholder="Введите ваш вопрос..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-peach-500"
              />
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Контактная информация</p>
                <input
                  type="text"
                  defaultValue="Иван Иванов"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                />
                <input
                  type="tel"
                  defaultValue="+7 (999) 123-45-67"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Закрыть
                </button>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 px-4 py-2 gradient-button text-white rounded-xl hover:opacity-90 font-medium shadow-button"
                >
                  Отправить вопрос
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
