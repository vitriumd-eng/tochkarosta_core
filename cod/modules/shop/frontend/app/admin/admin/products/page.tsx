/**
 * Shop Module - Admin Products Page (Dashboard Route)
 * Product management dashboard with CRUD operations
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  category?: string
  image_url?: string
  inStock: boolean
  description?: string
}

interface SubscriptionStatus {
  active: boolean
  plan?: string
  limits?: Record<string, number>
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        // Mock data - will be replaced with API
        setTimeout(() => {
          setProducts([
            { id: '1', name: 'Смартфон Premium', price: 29990, oldPrice: 34990, category: '1', inStock: true, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200', description: 'Современный смартфон с отличной камерой' },
            { id: '2', name: 'Ноутбук Pro 15"', price: 89990, oldPrice: 99990, category: '2', inStock: true, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200', description: 'Мощный ноутбук для работы' },
            { id: '3', name: 'Наушники Wireless', price: 4990, category: '3', inStock: true, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', description: 'Беспроводные наушники' },
          ])
          
          setSubscription({
            active: true,
            plan: 'Grow',
            limits: { products: 100 }
          })
          
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Failed to load data:', error)
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const maxProducts = subscription?.limits?.products || 50
  const isUnlimited = maxProducts === -1
  const productsCount = products.length
  const canAddMore = isUnlimited || productsCount < maxProducts

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleToggleStock = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, inStock: !p.inStock } : p
    ))
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Назад к сайту
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Управление товарами</h1>
                <p className="text-sm text-gray-500">Панель администратора магазина</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!canAddMore}
              className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                canAddMore
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              + Добавить товар
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Всего товаров</p>
                <p className="text-3xl font-bold text-gray-900">{productsCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">В наличии</p>
                <p className="text-3xl font-bold text-green-600">
                  {products.filter(p => p.inStock).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Лимит тарифа</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isUnlimited ? '∞' : `${productsCount}/${maxProducts}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        {subscription && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 mb-1">Тарифный план</p>
                <p className="text-2xl font-bold">{subscription.plan || 'N/A'}</p>
                <p className="text-sm text-blue-100 mt-1">
                  Лимит товаров: {isUnlimited ? 'Безлимитно' : `${maxProducts} товаров`}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                subscription.active 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {subscription.active ? '✓ Активна' : '✗ Неактивна'}
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Table */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Добавьте первый товар, чтобы начать'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={!canAddMore}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    canAddMore
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  + Добавить товар
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Товар
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Категория
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          {product.image_url && (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-gray-900">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                          {product.oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {product.oldPrice.toLocaleString('ru-RU')} ₽
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStock(product.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            product.inStock
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.category === '1' && 'Смартфоны'}
                        {product.category === '2' && 'Ноутбуки'}
                        {product.category === '3' && 'Аксессуары'}
                        {product.category === '4' && 'Гаджеты'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Modal Placeholder */}
        {(showAddModal || editingProduct) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingProduct(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600">
                  Форма добавления/редактирования товара (будет реализована)
                </p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingProduct(null)
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingProduct(null)
                      alert('Товар сохранён (будет реализовано)')
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
