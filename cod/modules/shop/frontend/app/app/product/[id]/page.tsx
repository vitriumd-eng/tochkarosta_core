/**
 * Shop Module - Product Detail Page
 * Detailed product view with images, description, reviews
 */
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  image_url?: string
  images?: string[]
  category?: string
  badge?: string
  inStock: boolean
  description: string
  specs?: Record<string, string>
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      try {
        // Mock data - will be replaced with API
        setTimeout(() => {
          const mockProduct: Product = {
            id: productId,
            name: 'Смартфон Premium Pro Max',
            price: 29990,
            oldPrice: 34990,
            category: '1',
            badge: 'Хит продаж',
            inStock: true,
            description: 'Современный смартфон с мощным процессором, отличной камерой и долгим временем работы батареи. Идеально подходит для работы и развлечений.',
            images: [
              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
            ],
            image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
            specs: {
              'Экран': '6.7" OLED',
              'Процессор': 'Snapdragon 888',
              'Память': '128 ГБ',
              'Камера': '108 Мп + 12 Мп + 12 Мп',
              'Батарея': '4500 мАч',
              'ОС': 'Android 13',
            }
          }
          
          setProduct(mockProduct)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Failed to load product:', error)
        setLoading(false)
      }
    }
    
    if (productId) {
      loadProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка товара...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Товар не найден</h2>
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images || (product.image_url ? [product.image_url] : [])

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
              <Link href="/catalog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Каталог</Link>
              <Link href="/cart" className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Корзина
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Главная</Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-blue-600">Каталог</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {images.length > 0 && (
              <>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index ? 'border-blue-600' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {product.badge && (
              <div className="mt-4 inline-block px-4 py-2 bg-red-500 text-white rounded-full font-semibold">
                {product.badge}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    {product.oldPrice.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center text-green-600">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="font-medium">В наличии</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="font-medium">Нет в наличии</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border border-gray-300 rounded-lg py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                disabled={!product.inStock}
                onClick={() => {
                  // Add to cart
                  alert(`Добавлено в корзину: ${product.name} x${quantity}`)
                }}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
              </button>
              
              <button
                disabled={!product.inStock}
                className={`w-full py-4 border-2 rounded-lg font-semibold text-lg transition-colors ${
                  product.inStock
                    ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                Купить в один клик
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-2xl">🚚</span>
                <span>Бесплатная доставка при заказе от 5000 ₽</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-2xl">🔒</span>
                <span>Безопасная оплата и возврат</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-2xl">💯</span>
                <span>Официальная гарантия 12 месяцев</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specs && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Характеристики</h2>
              <dl className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-100 pb-3">
                    <dt className="text-gray-600 font-medium">{key}</dt>
                    <dd className="text-gray-900 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Related Products Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие товары</h2>
          <p className="text-gray-600">Здесь будут отображаться похожие товары</p>
        </div>
      </div>
    </div>
  )
}


