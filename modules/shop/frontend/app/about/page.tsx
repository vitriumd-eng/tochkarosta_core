/**
 * Shop Module - About Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import Link from 'next/link'

export default function AboutPage() {
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
              <Link href="/about" className="text-peach-600 font-semibold">О магазине</Link>
              <Link href="/account" className="text-gray-600 hover:text-peach-600">Кабинет</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 lg:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">О нашем магазине</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Добро пожаловать в наш интернет-магазин! Мы предлагаем широкий ассортимент качественных товаров для всей семьи.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Наша миссия</h2>
            <p className="text-gray-600 mb-6">
              Мы стремимся предоставить нашим клиентам лучший сервис, качественные товары и приятные цены. 
              Ваше удовлетворение - наш приоритет.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-6 bg-peach-50 rounded-xl">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Быстрая доставка</h3>
                <p className="text-gray-600">Доставка в течение дня по городу</p>
              </div>
              <div className="p-6 bg-peach-50 rounded-xl">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Удобная оплата</h3>
                <p className="text-gray-600">Различные способы оплаты</p>
              </div>
              <div className="p-6 bg-peach-50 rounded-xl">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Качество</h3>
                <p className="text-gray-600">Только проверенные товары</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">Контакты</h2>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p className="text-gray-700 mb-2"><strong>Телефон:</strong> +7 (999) 123-45-67</p>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> info@shop.ru</p>
              <p className="text-gray-700"><strong>Адрес:</strong> г. Москва, ул. Ленина, д. 10</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">Режим работы</h2>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p className="text-gray-700 mb-2"><strong>Пн-Пт:</strong> 10:00 - 19:00</p>
              <p className="text-gray-700"><strong>Сб-Вс:</strong> 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">О нас</h3>
              <p className="text-gray-400">Интернет-магазин с широким ассортиментом товаров</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Навигация</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="text-gray-400 hover:text-white">Главная</Link>
                <Link href="/catalog" className="text-gray-400 hover:text-white">Каталог</Link>
                <Link href="/about" className="text-gray-400 hover:text-white">О магазине</Link>
                <Link href="/account" className="text-gray-400 hover:text-white">Кабинет</Link>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <p className="text-gray-400">Email: info@shop.ru</p>
              <p className="text-gray-400">Телефон: +7 (999) 123-45-67</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Магазин. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
