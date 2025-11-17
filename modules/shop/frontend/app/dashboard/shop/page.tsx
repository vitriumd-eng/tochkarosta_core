/**
 * Dashboard - Shop Settings Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'

interface Advantage {
  id: string
  icon: string
  title: string
  description: string
}

export default function ShopPage() {
  const [shopName, setShopName] = useState('Мой магазин')
  const [phone, setPhone] = useState('+7 (999) 123-45-67')
  const [address, setAddress] = useState('г. Москва, ул. Ленина, д. 10')
  const [weekdaysHours, setWeekdaysHours] = useState('10:00 - 19:00')
  const [weekendHours, setWeekendHours] = useState('10:00 - 18:00')
  const [aboutTitle, setAboutTitle] = useState('О нашем магазине')
  const [aboutDescription, setAboutDescription] = useState('Описание магазина...')
  const [advantages, setAdvantages] = useState<Advantage[]>([
    { id: '1', icon: '🚚', title: 'Быстрая доставка', description: 'Доставка в течение дня' },
    { id: '2', icon: '💳', title: 'Удобная оплата', description: 'Различные способы оплаты' },
  ])

  const addAdvantage = () => {
    setAdvantages([...advantages, { id: Date.now().toString(), icon: '✨', title: '', description: '' }])
  }

  const removeAdvantage = (id: string) => {
    setAdvantages(advantages.filter(a => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Магазин</h1>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="gradient-design-card rounded-xl shadow-md p-6 text-white cursor-pointer hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Дизайн сайта</h3>
            <p className="text-sm opacity-90">Настройка темы и цветов</p>
          </div>
          <div className="gradient-domain-card rounded-xl shadow-md p-6 text-white cursor-pointer hover:shadow-lg transition relative">
            <div className="absolute top-4 right-4 px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
              PREMIUM
            </div>
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold mb-2">Custom Domain</h3>
            <p className="text-sm opacity-90">Настройка собственного домена</p>
          </div>
        </div>

        {/* Main Info */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Основная информация</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏪 Название магазина *
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📞 Номер телефона *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (XXX) XXX-XX-XX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Адрес магазина *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 Режим работы (Пн-Пт) *
                </label>
                <input
                  type="text"
                  value={weekdaysHours}
                  onChange={(e) => setWeekdaysHours(e.target.value)}
                  placeholder="10:00 - 19:00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 Режим работы (Сб-Вс) *
                </label>
                <input
                  type="text"
                  value={weekendHours}
                  onChange={(e) => setWeekendHours(e.target.value)}
                  placeholder="10:00 - 18:00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* About Store */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">О магазине</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Заголовок блока
              </label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📄 Описание магазина
              </label>
              <textarea
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🖼️ Изображение для блока
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-2">Перетащите изображение сюда или нажмите для загрузки</p>
                <p className="text-sm text-gray-400">PNG, JPG, WebP до 5MB</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  ✨ Преимущества магазина
                </label>
                <button
                  onClick={addAdvantage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                >
                  Добавить
                </button>
              </div>
              <div className="space-y-4">
                {advantages.map((advantage) => (
                  <div key={advantage.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-1">
                        <input
                          type="text"
                          value={advantage.icon}
                          onChange={(e) => {
                            const updated = advantages.map(a => 
                              a.id === advantage.id ? { ...a, icon: e.target.value } : a
                            )
                            setAdvantages(updated)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl"
                          placeholder="✨"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          value={advantage.title}
                          onChange={(e) => {
                            const updated = advantages.map(a => 
                              a.id === advantage.id ? { ...a, title: e.target.value } : a
                            )
                            setAdvantages(updated)
                          }}
                          placeholder="Заголовок"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-6">
                        <input
                          type="text"
                          value={advantage.description}
                          onChange={(e) => {
                            const updated = advantages.map(a => 
                              a.id === advantage.id ? { ...a, description: e.target.value } : a
                            )
                            setAdvantages(updated)
                          }}
                          placeholder="Описание"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <button
                          onClick={() => removeAdvantage(advantage.id)}
                          className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button - Sticky */}
        <div className="sticky bottom-0 bg-white border-t shadow-lg p-4 -mx-6 lg:-mx-8 mt-8">
          <button className="w-full px-6 py-4 gradient-button text-white rounded-xl hover:opacity-90 transition font-semibold text-lg shadow-button">
            💾 Сохранить все изменения
          </button>
        </div>
      </main>
    </div>
  )
}

