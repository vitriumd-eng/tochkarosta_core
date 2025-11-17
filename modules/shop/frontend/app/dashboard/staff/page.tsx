/**
 * Dashboard - Staff Management Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'

interface StaffMember {
  id: string
  name: string
  pin: string
  status: 'Активен' | 'Неактивен'
  lastUsed: string
  createdAt: string
}

export default function StaffPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [staffName, setStaffName] = useState('')
  const [currentTariff] = useState({ name: 'Базовый', limit: 3, current: 1 })
  const [shopId] = useState('SHOP-12345')

  const staff: StaffMember[] = [
    {
      id: '1',
      name: 'Мария Петрова',
      pin: '****',
      status: 'Активен',
      lastUsed: '2025-01-15',
      createdAt: '2025-01-01',
    },
  ]

  const handleCreate = () => {
    const generatedPin = Math.random().toString().slice(2, 6)
    setNewPin(generatedPin)
    setShowCreateModal(false)
    setShowPinModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Персонал</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 gradient-button text-white rounded-xl hover:opacity-90 transition font-semibold shadow-button"
          >
            ➕ Создать PIN-код
          </button>
        </div>

        {/* Limits Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Текущий тариф</p>
              <p className="text-lg font-bold text-gray-900">{currentTariff.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Лимит персонала</p>
              <p className="text-lg font-bold text-gray-900">
                {currentTariff.current} / {currentTariff.limit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Shop ID</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-mono font-bold text-gray-900">{shopId}</p>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя сотрудника</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PIN-код</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Последнее использование</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата создания</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staff.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{member.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.pin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      member.status === 'Активен' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.lastUsed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">
                      🗑️ Деактивировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Создать PIN-код</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Имя сотрудника *</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Мария Петрова"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">PIN-код (опционально)</label>
                <input
                  type="text"
                  placeholder="Оставьте пустым для автогенерации"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 px-4 py-2 gradient-button text-white rounded-xl hover:opacity-90 font-medium shadow-button"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PIN Modal */}
        {showPinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">PIN-код создан</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Ваш PIN-код:</p>
                <p className="text-4xl font-bold text-gray-900 font-mono">{newPin}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ Важно! Сохраните этот PIN-код. Он больше не будет показан.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(newPin)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  📋 Копировать
                </button>
                <button
                  onClick={() => {
                    setShowPinModal(false)
                    setStaffName('')
                  }}
                  className="flex-1 px-4 py-2 gradient-button text-white rounded-xl hover:opacity-90 font-medium shadow-button"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

