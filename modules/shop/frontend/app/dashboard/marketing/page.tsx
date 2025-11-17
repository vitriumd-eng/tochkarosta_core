/**
 * Dashboard - Marketing Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'

interface Post {
  id: string
  image: string
  description: string
  date: string
  messengers: string[]
}

export default function MarketingPage() {
  const [bannerEnabled, setBannerEnabled] = useState(true)
  const [bannerTitle, setBannerTitle] = useState('Свежий привоз')
  const [bannerSubtitle, setBannerSubtitle] = useState('Новые модели уже в наличии')
  const [bannerDiscount, setBannerDiscount] = useState('АКЦИЯ 20%')
  const [bannerEndDate, setBannerEndDate] = useState('2025-02-01')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [cardDescription, setCardDescription] = useState('')
  const [selectedMessengers, setSelectedMessengers] = useState<string[]>([])
  const [posts] = useState<Post[]>([
    { id: '1', image: '👕', description: 'Новая коллекция!', date: '2025-01-15', messengers: ['Telegram', 'Max'] },
  ])

  const toggleMessenger = (messenger: string) => {
    if (selectedMessengers.includes(messenger)) {
      setSelectedMessengers(selectedMessengers.filter(m => m !== messenger))
    } else {
      setSelectedMessengers([...selectedMessengers, messenger])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Маркетинг</h1>

        {/* Banner Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Управление Баннером на Главной Странице</h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerEnabled}
                  onChange={(e) => setBannerEnabled(e.target.checked)}
                  className="w-5 h-5 text-peach-500 rounded focus:ring-peach-500"
                />
                <span className="font-medium text-gray-900">🎯 Отображение баннера</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Подзаголовок</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Текст скидки</label>
                <input
                  type="text"
                  value={bannerDiscount}
                  onChange={(e) => setBannerDiscount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Дата окончания акции</label>
                <input
                  type="date"
                  value={bannerEndDate}
                  onChange={(e) => setBannerEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="gradient-button rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">{bannerTitle}</h3>
              <p className="text-sm mb-2">{bannerSubtitle}</p>
              <p className="text-xl font-bold mb-2">{bannerDiscount}</p>
              <p className="text-xs opacity-90">До окончания: 15 дней</p>
            </div>

            <button className="w-full px-6 py-3 gradient-button text-white rounded-xl hover:opacity-90 transition font-semibold shadow-button">
              💾 Сохранить настройки баннера
            </button>
          </div>
        </div>

        {/* Product Card Generator */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Генератор Карточек Товаров</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📸 Загрузка изображения</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                {selectedImage ? (
                  <div className="relative">
                    <div className="text-6xl">{selectedImage}</div>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Удалить
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 mb-2">Перетащите изображение сюда</p>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                      Выбрать файл
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Описание карточки
              </label>
              <textarea
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                rows={4}
                placeholder="Опишите товар... Используйте эмодзи для привлечения внимания 🎉"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
              />
              <p className="text-xs text-gray-500 mt-1">{cardDescription.length} символов</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">📱 Выбор мессенджеров</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => toggleMessenger('Telegram')}
                  className={`p-6 border-2 rounded-lg transition ${
                    selectedMessengers.includes('Telegram')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📱</span>
                      <div>
                        <p className="font-semibold text-gray-900">Telegram</p>
                        <p className="text-sm text-gray-500">Синяя карточка</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${selectedMessengers.includes('Telegram') ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </button>
                <button
                  onClick={() => toggleMessenger('Max')}
                  className={`p-6 border-2 rounded-lg transition ${
                    selectedMessengers.includes('Max')
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">💬</span>
                      <div>
                        <p className="font-semibold text-gray-900">Max</p>
                        <p className="text-sm text-gray-500">Фиолетовая карточка</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${selectedMessengers.includes('Max') ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </button>
              </div>
            </div>

            <button
              disabled={!selectedImage || !cardDescription || selectedMessengers.length === 0}
              className="w-full px-6 py-3 gradient-button text-white rounded-xl hover:opacity-90 transition font-semibold shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 Создать и отправить карточку
            </button>
          </div>
        </div>

        {/* Posts History */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">История Постов</h2>
          
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="text-6xl">{post.image}</div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{post.description}</p>
                    <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                    <div className="flex gap-2">
                      {post.messengers.map((msg) => (
                        <span key={msg} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {msg}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
                      🔄 Отправить снова
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

