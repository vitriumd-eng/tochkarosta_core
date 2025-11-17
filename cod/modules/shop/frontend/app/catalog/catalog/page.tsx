/**
 * Shop Module - Catalog Page
 * Product catalog with filters and search
 */
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  image_url?: string
  category?: string
  badge?: string
  inStock: boolean
}

interface Filter {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest'
}

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<Filter>({
    category: searchParams?.get('category') || undefined,
    sortBy: 'newest'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function loadProducts() {
      try {
        // Mock data - will be replaced with API
        setTimeout(() => {
          const mockProducts: Product[] = [
            { id: '1', name: 'Смартфон Premium', price: 29990, oldPrice: 34990, category: '1', badge: 'Хит', inStock: true, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500' },
            { id: '2', name: 'Ноутбук Pro 15"', price: 89990, oldPrice: 99990, category: '2', badge: 'Новинка', inStock: true, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500' },
            { id: '3', name: 'Наушники Wireless', price: 4990, category: '3', inStock: true, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
            { id: '4', name: 'Часы Smart Watch', price: 14990, category: '4', badge: 'Скидка', inStock: true, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
            { id: '5', name: 'Камера Mirrorless', price: 59990, category: '2', inStock: false, image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500' },
            { id: '6', name: 'Планшет 10"', price: 24990, category: '2', inStock: true, image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
            { id: '7', name: 'Смартфон Budget', price: 14990, category: '1', inStock: true, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500' },
            { id: '8', name: 'Клавиатура Mechanical', price: 5990, category: '3', inStock: true, image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500' },
          ]
          
          setProducts(mockProducts)
          setFilteredProducts(mockProducts)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Failed to load products:', error)
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock)
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!)
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // newest - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [products, filters, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка товаров...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/catalog" className="text-blue-600 font-medium">Каталог</Link>
              <Link href="/cart" className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Корзина
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Каталог товаров</h1>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors md:hidden"
            >
              {showFilters ? '✕ Фильтры' : '☰ Фильтры'}
            </button>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Новинки</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`hidden md:block w-64 flex-shrink-0 ${showFilters ? 'block' : ''} ${showFilters ? 'fixed md:relative inset-0 md:inset-auto z-50 bg-white md:bg-transparent p-4 md:p-0' : ''}`}>
            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden mb-4 text-gray-600 hover:text-gray-900"
              >
                ✕ Закрыть
              </button>
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
              
              {/* Category Filter */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Категория</h3>
                <div className="space-y-2">
                  {[
                    { id: '1', name: 'Смартфоны' },
                    { id: '2', name: 'Ноутбуки' },
                    { id: '3', name: 'Аксессуары' },
                    { id: '4', name: 'Гаджеты' },
                  ].map((cat) => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={filters.category === cat.id}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                        className="mr-2"
                      />
                      <span className="text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                  <button
                    onClick={() => setFilters({ ...filters, category: undefined })}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
              
              {/* Price Filter */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Цена</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="number"
                      placeholder="От"
                      value={filters.minPrice || ''}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="До"
                      value={filters.maxPrice || ''}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              {/* Stock Filter */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked || undefined })}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Только в наличии</span>
                </label>
              </div>
              
              <button
                onClick={() => setFilters({ sortBy: 'newest' })}
                className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Сбросить все фильтры
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-4 text-gray-600">
              Найдено товаров: <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
                <p className="text-gray-600 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
                <button
                  onClick={() => {
                    setFilters({ sortBy: 'newest' })
                    setSearchQuery('')
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                      {!product.inStock && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-gray-500 text-white text-sm font-semibold rounded-full">
                          Нет в наличии
                        </span>
                      )}
                      {product.oldPrice && (
                        <span className="absolute bottom-3 right-3 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                          -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
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
                          // Add to cart
                        }}
                        disabled={!product.inStock}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? 'В корзину' : 'Нет в наличии'}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}


