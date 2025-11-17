/**
 * Shop Module - Home Page (Public Route)
 * Modern e-commerce homepage with hero, categories, featured products
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  image_url?: string
  category?: string
  badge?: string
}

interface Category {
  id: string
  name: string
  icon?: string
  image_url?: string
}

export default function ShopHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Mock data for now - will be replaced with API calls
        setTimeout(() => {
          setFeaturedProducts([
            { id: '1', name: 'Смартфон Premium', price: 29990, oldPrice: 34990, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', badge: 'Хит продаж' },
            { id: '2', name: 'Ноутбук Pro 15"', price: 89990, oldPrice: 99990, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', badge: 'Новинка' },
            { id: '3', name: 'Наушники Wireless', price: 4990, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
            { id: '4', name: 'Часы Smart Watch', price: 14990, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', badge: 'Скидка' },
            { id: '5', name: 'Камера Mirrorless', price: 59990, image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500' },
            { id: '6', name: 'Планшет 10"', price: 24990, image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
          ])
          
          setCategories([
            { id: '1', name: 'Смартфоны', icon: '📱', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
            { id: '2', name: 'Ноутбуки', icon: '💻', image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
            { id: '3', name: 'Аксессуары', icon: '🎧', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
            { id: '4', name: 'Гаджеты', icon: '⌚', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
          ])
          
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Failed to load data:', error)
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🛍️</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Мой Магазин</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Главная</Link>
              <Link href="/catalog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Каталог</Link>
              <Link href="/cart" className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Корзина
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
              </Link>
            </nav>
            
            <Link href="/admin/products" className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
              ⚙️
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Добро пожаловать в наш магазин
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Широкий ассортимент качественных товаров по доступным ценам
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Перейти в каталог →
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Категории товаров</h2>
            <p className="text-lg text-gray-600">Выберите интересующую вас категорию</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.id}`}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-4xl">
                    {category.icon}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Популярные товары</h2>
            <p className="text-lg text-gray-600">Товары, которые выбирают наши покупатели</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {product.oldPrice && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </span>
                      {product.oldPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {product.oldPrice.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      // Add to cart logic
                    }}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    В корзину
                  </button>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/catalog"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Смотреть все товары →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Быстрая доставка</h3>
              <p className="text-gray-600">Доставка по всей стране за 1-3 дня</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Безопасная оплата</h3>
              <p className="text-gray-600">Защищённые способы оплаты и возврат</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Гарантия качества</h3>
              <p className="text-gray-600">Официальная гарантия на все товары</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🛍️</span>
                </div>
                <span className="text-xl font-bold">Мой Магазин</span>
              </div>
              <p className="text-gray-400 text-sm">
                Ваш надёжный партнёр в мире качественных товаров
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/catalog" className="hover:text-white transition-colors">Все товары</Link></li>
                <li><Link href="/catalog?category=1" className="hover:text-white transition-colors">Смартфоны</Link></li>
                <li><Link href="/catalog?category=2" className="hover:text-white transition-colors">Ноутбуки</Link></li>
                <li><Link href="/catalog?category=3" className="hover:text-white transition-colors">Аксессуары</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Покупателям</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/cart" className="hover:text-white transition-colors">Корзина</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Доставка и оплата</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Возврат</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 +7 (999) 123-45-67</li>
                <li>✉️ info@myshop.ru</li>
                <li>📍 Москва, ул. Примерная, 1</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Мой Магазин. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
