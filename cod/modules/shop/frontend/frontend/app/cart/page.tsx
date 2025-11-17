/**
 * Shop Module - Cart Page
 * Shopping cart with order summary and checkout
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image_url?: string
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock cart data - will be replaced with real cart state
    setTimeout(() => {
      setCartItems([
        {
          id: '1',
          productId: '1',
          name: 'Смартфон Premium',
          price: 29990,
          quantity: 1,
          image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200'
        },
        {
          id: '2',
          productId: '3',
          name: 'Наушники Wireless',
          price: 4990,
          quantity: 2,
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
        }
      ])
      setLoading(false)
    }, 300)
  }, [])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      return
    }
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal >= 5000 ? 0 : 500
  const total = subtotal + delivery

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка корзины...</p>
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
              <Link href="/catalog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Каталог</Link>
              <Link href="/cart" className="relative text-blue-600 font-medium">
                Корзина
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Корзина</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ваша корзина пуста</h2>
            <p className="text-gray-600 mb-6">Добавьте товары из каталога, чтобы продолжить покупки</p>
            <Link
              href="/catalog"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row gap-4"
                >
                  <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </Link>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.productId}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {item.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        ✕ Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Итого</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span className="font-semibold">{subtotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Доставка</span>
                    <span className="font-semibold">
                      {delivery === 0 ? (
                        <span className="text-green-600">Бесплатно</span>
                      ) : (
                        `${delivery.toLocaleString('ru-RU')} ₽`
                      )}
                    </span>
                  </div>
                  
                  {subtotal < 5000 && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      Добавьте товаров на {5000 - subtotal} ₽ для бесплатной доставки
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>К оплате</span>
                    <span>{total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    alert('Переход к оформлению заказа (будет реализовано)')
                  }}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mb-4"
                >
                  Оформить заказ
                </button>
                
                <Link
                  href="/catalog"
                  className="block w-full py-3 text-center border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Продолжить покупки
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


