/**
 * Dashboard - Profile Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'

export default function ProfilePage() {
  const [phoneBound, setPhoneBound] = useState(true)
  const [businessType, setBusinessType] = useState<'IP' | 'NPD'>('IP')
  const [telegramEnabled, setTelegramEnabled] = useState(false)
  const [maxEnabled, setMaxEnabled] = useState(false)
  const [yookassaEnabled, setYookassaEnabled] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Профиль</h1>

        {/* Phone Management */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Управление Номером Телефона</h2>
          
          {phoneBound ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">📞 Привязанный номер</p>
                  <p className="text-lg font-bold text-gray-900">+7 (999) 123-45-67</p>
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm mt-1">
                    ✓ Подтвержден
                  </span>
                </div>
                <div className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                  👑 Администратор
                </div>
              </div>
              <button
                onClick={() => setPhoneBound(false)}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                🔓 Отвязать номер
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Для доступа к функциям администратора необходимо привязать номер телефона
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Номер телефона</label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                  📱 Привязать номер
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Business Details */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Реквизиты Организации</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Тип бизнеса</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="businessType"
                  value="IP"
                  checked={businessType === 'IP'}
                  onChange={() => setBusinessType('IP')}
                  className="w-4 h-4 text-peach-500"
                />
                <span>ИП</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="businessType"
                  value="NPD"
                  checked={businessType === 'NPD'}
                  onChange={() => setBusinessType('NPD')}
                  className="w-4 h-4 text-peach-500"
                />
                <span>НПД</span>
              </label>
            </div>
          </div>

          {businessType === 'IP' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Название компании" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="ИНН" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="КПП" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="ОГРН" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Юридический адрес" className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" />
              <input type="text" placeholder="Название банка" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="БИК" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Расчетный счет" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Корреспондентский счет" className="px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="ФИО" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="ИНН" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Номер карты" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="tel" placeholder="Телефон" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Название банка" className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" />
            </div>
          )}
        </div>

        {/* Account Credentials */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Учетные Данные</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Имя пользователя</label>
              <input
                type="text"
                defaultValue="ivan@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Смена пароля</label>
              <input
                type="password"
                placeholder="Текущий пароль"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
              />
              <input
                type="password"
                placeholder="Новый пароль"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
              />
              <input
                type="password"
                placeholder="Подтверждение нового пароля"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                Изменить пароль
              </button>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Интеграции</h2>
          
          <div className="space-y-6">
            {/* Telegram */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telegram Бот</h3>
                    <p className="text-sm text-gray-500">Уведомления и коммуникации</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={telegramEnabled}
                    onChange={(e) => setTelegramEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-peach-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-peach-500"></div>
                </label>
              </div>
              {telegramEnabled && (
                <div className="space-y-4 mt-4">
                  <input type="text" placeholder="Токен бота" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="ID общей группы" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="ID группы продавца" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
                    🔍 Проверить подключение
                  </button>
                </div>
              )}
            </div>

            {/* Max */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Max Бот</h3>
                    <p className="text-sm text-gray-500">Уведомления и коммуникации</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maxEnabled}
                    onChange={(e) => setMaxEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-peach-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-peach-500"></div>
                </label>
              </div>
              {maxEnabled && (
                <div className="space-y-4 mt-4">
                  <input type="text" placeholder="API ключ" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="ID общего канала" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="ID канала продавца" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
                    🔍 Проверить подключение
                  </button>
                </div>
              )}
            </div>

            {/* YooKassa */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💳</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">ЮКасса</h3>
                    <p className="text-sm text-gray-500">Платежная система</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={yookassaEnabled}
                    onChange={(e) => setYookassaEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-peach-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-peach-500"></div>
                </label>
              </div>
              {yookassaEnabled && (
                <div className="space-y-4 mt-4">
                  <input type="text" placeholder="Shop ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Secret Key" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
                    🔍 Проверить подключение
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Domain */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Custom Domain (Премиум)</h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
              PREMIUM
            </span>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="moy-magazin.ru"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-sm text-gray-500">
              Настройте DNS записи согласно инструкциям для подключения домена
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

