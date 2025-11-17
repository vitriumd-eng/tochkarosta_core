/**
 * Dashboard Sidebar Component
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SidebarProps {
  userRole?: 'admin' | 'seller'
  userName?: string
  userEmail?: string
  userId?: string
  onLogout?: () => void
}

export default function Sidebar({ userRole = 'admin', userName = 'Пользователь', userEmail, userId, onLogout }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { icon: '🏪', label: 'Магазин', href: '/dashboard/shop', available: true },
    { icon: '📦', label: 'Каталог', href: '/dashboard/catalog', available: true },
    { icon: '🛒', label: 'Заказы', href: '/dashboard/orders', available: true },
    { icon: '💬', label: 'Внутренний Чат', href: '/dashboard/chat', available: true },
    { icon: '📧', label: 'Почта', href: '/dashboard/mail', available: userRole === 'admin' },
    { icon: '👥', label: 'Персонал', href: '/dashboard/staff', available: userRole === 'admin' },
    { icon: '📊', label: 'Маркетинг', href: '/dashboard/marketing', available: userRole === 'admin' },
    { icon: '👤', label: 'Профиль', href: '/dashboard/profile', available: userRole === 'admin' },
    { icon: '💎', label: 'Подписка', href: '/dashboard/subscription', available: userRole === 'admin' },
    { icon: '📄', label: 'Счета', href: '/dashboard/invoices', available: userRole === 'admin' },
    { icon: '❓', label: 'Справка', href: '/dashboard/help', available: userRole === 'admin' },
    { icon: '📸', label: 'Заказ по фото', href: '/dashboard/photo-order', available: true },
  ]

  const filteredMenuItems = menuItems.filter(item => item.available)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Точка Роста</h1>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-peach-50 transition text-gray-700 hover:text-peach-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full gradient-avatar flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{userName}</p>
                  {userEmail && <p className="text-sm text-gray-500 truncate">{userEmail}</p>}
                  {userId && <p className="text-xs text-gray-400 truncate">ID: {userId}</p>}
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              Выход
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

