'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export const StatsFeaturesBridge = () => {
  const [currentMessageSet, setCurrentMessageSet] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Разные наборы сообщений для ротации - только посты о возможностях без сообщений других людей
  const messageSets = [
    // Набор 1: Вырезание фона и создание карточек товаров
    [
      {
        id: 1,
        avatar: 'platform',
        name: 'Точка Роста',
        date: '16.01.2025',
        text: 'Платформа автоматически вырезает фон с фотографии и создает карточку товара! Просто загрузите фото — всё остальное сделаем мы. Профессиональный результат без дизайнера.',
        type: 'image',
        image: {
          before: '/images/features/before-product.jpg',
          after: '/images/features/after-product.jpg',
          title: 'Вырезание фона и создание карточки товара'
        }
      }
    ],
    // Набор 2: Генератор баннеров и размещение постов
    [
      {
        id: 2,
        avatar: 'platform',
        name: 'Точка Роста',
        date: '17.01.2025',
        text: 'Используйте наш генератор баннеров! Создайте один пост, и платформа разместит его одним кликом во все указанные вами места: VK, Telegram, и другие.',
        type: 'banner',
        banner: {
          image: '/images/features/banner-example.jpg',
          post: '🎉 Новая коллекция уже в продаже! Скидка 20% на все товары. Успейте купить!',
          platforms: ['VK', 'Telegram', 'Max']
        }
      }
    ],
    // Набор 3: Модуль для строителей
    [
      {
        id: 3,
        avatar: 'platform',
        name: 'Точка Роста',
        date: '18.01.2025',
        text: 'У нас есть специальный модуль для строителей! Включает каталог домов, бань, котлов с калькулятором стоимости. Онлайн-заказ, автоматизация всех процессов. В модуле доступны темы от обычных до премиум, и вы можете полностью кастомизировать дизайн под свой бренд.',
        type: 'construction',
        construction: {
          preview: true
        },
        buttons: ['Посмотреть модуль', 'Начать бесплатно']
      }
    ],
    // Набор 4: Модуль продажи курсов
    [
      {
        id: 4,
        avatar: 'platform',
        name: 'Точка Роста',
        date: '19.01.2025',
        text: 'Продаешь курсы, нет времени создавать сайт. К тому же они нужны всего на месяц. Смысл тратить большие деньги. Просто выбери понравившуюся тему из модуля Мероприятия.',
        type: 'courses',
        courses: {
          preview: true
        },
        buttons: ['Посмотреть модуль', 'Начать бесплатно']
      }
    ],
    // Набор 5: Модуль портфолио
    [
      {
        id: 5,
        avatar: 'platform',
        name: 'Точка Роста',
        date: '20.01.2025',
        text: 'Модуль портфолио создан специально для фотографов, артистов и организаторов! Показывайте работы, принимайте заказы прямо с сайта. Очень удобно! В каждом модуле доступны темы от обычных до премиум, и вы можете кастомизировать их под свой бренд.',
        type: 'portfolio',
        portfolio: {
          title: 'Модуль портфолио для фотографов, артистов и организаторов',
          features: [
            'Показ работ и проектов',
            'Прием заказов онлайн',
            'Галерея с фильтрами',
            'Календарь бронирования'
          ],
          examples: [
            { type: 'photographer', label: 'Фотограф' },
            { type: 'artist', label: 'Артист' },
            { type: 'organizer', label: 'Организатор' }
          ]
        },
        buttons: ['Посмотреть модуль', 'Начать бесплатно']
      }
    ],
    // Набор 6: Модуль мероприятий
    [
      {
        id: 6,
        avatar: 'platform',
        name: 'Точка Роста',
        date: '21.01.2025',
        text: 'Для организации мероприятий у нас есть модуль "Мероприятия"! Вы можете быстро создать полноценный сайт-визитку с 3D-элементами. Недорого и, самое главное, быстро! Продажа билетов, регистрация участников — всё автоматически.',
        type: 'events',
        events: {
          preview: true
        },
        buttons: ['Посмотреть модуль', 'Начать бесплатно']
      }
    ],
    // Набор 7: Модуль Крипто
    [
      {
        id: 7,
        avatar: 'platform',
        name: 'Точка Роста',
        date: '22.01.2025',
        text: 'У нас есть модуль Крипто! В нем доступны тематические темы с использованием 3D элементов. Готовое решение для профессиональных криптопроектов с современным дизайном.',
        type: 'crypto-preview',
        cryptoPreview: {
          preview: true
        },
        buttons: ['Посмотреть модуль', 'Начать бесплатно']
      }
    ],
    // Набор 8: Интернет-магазин
    [
      {
        id: 8,
        avatar: 'platform',
        name: 'Точка Роста',
        date: '23.01.2025',
        text: 'Интернет-магазин. Подключил. Сфоткал. Уже продаешь. Мгновенное добавление товара. Просто сфотографируй. И продавай. Об остальном заботится платформа.',
        type: 'shop',
        shop: {
          preview: true
        },
        buttons: ['Посмотреть модуль', 'Начать бесплатно']
      }
    ]
  ]

  // Ротация наборов сообщений с плавным переходом
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentMessageSet((prev) => (prev + 1) % messageSets.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 300) // Время для fade-out
    }, 8000) // Меняем каждые 8 секунд

    return () => clearInterval(interval)
  }, [])

  // Функции для ручного переключения постов
  const goToPrevious = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentMessageSet((prev) => (prev - 1 + messageSets.length) % messageSets.length)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  const goToNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentMessageSet((prev) => (prev + 1) % messageSets.length)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  // Плавная прокрутка чата в начало при смене сообщений (оптимизировано)
  useEffect(() => {
    if (!chatContainerRef.current || isTransitioning) return
    
    let animationFrameId: number | null = null
    let timeoutId: NodeJS.Timeout | null = null
    
    timeoutId = setTimeout(() => {
      if (!chatContainerRef.current) return
      
      const container = chatContainerRef.current
      const targetScroll = 0
      const startScroll = container.scrollTop
      
      // Если уже в начале, не анимируем
      if (Math.abs(startScroll - targetScroll) < 1) return
      
      const distance = targetScroll - startScroll
      const duration = 1500 // Уменьшено до 1.5 секунд
      const startTime = performance.now()
      
      const animateScroll = (currentTime: number) => {
        if (!chatContainerRef.current) return
        
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing функция
        const easeInOut = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        
        chatContainerRef.current.scrollTop = startScroll + distance * easeInOut
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateScroll)
        } else {
          animationFrameId = null
        }
      }
      
      animationFrameId = requestAnimationFrame(animateScroll)
    }, 300)
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
    }
  }, [currentMessageSet, isTransitioning])

  const currentMessages = messageSets[currentMessageSet]

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-transparent relative overflow-visible -mt-[170px] md:-mt-[170px] mb-[250px]">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFFBEA] to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Single window */}
        <div className="bg-gray-800/95 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden relative">
          {/* Window header */}
          <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/stats/logo.svg"
                alt="Точка Роста"
                width={120}
                height={36}
                className="h-6 w-auto"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
          </div>
          
          {/* Window content - two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-gray-800 h-[600px]">
            {/* Left column - Text and link */}
            <div className="p-6 sm:p-8 lg:border-r border-gray-700 flex flex-col justify-center">
              <div className="max-w-md">
                <h2 className="text-white font-bold text-2xl sm:text-3xl mb-4">
                  Готовые решения для выхода в интернет
                </h2>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                  Платформа предоставляет инструменты для новых возможностей. Выберите модуль и откройте для себя новые горизонты бизнеса.
                </p>
                <div className="inline-flex items-center gap-2 text-orange-500 font-semibold text-sm hover:text-orange-400 transition-colors cursor-pointer">
                  <span>Попробовать все возможности</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right column - Chat interface */}
            <div className="p-6 sm:p-8 bg-gray-800 relative overflow-hidden h-full flex flex-col">
              <div className="mb-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">#обсуждение-платформы</div>
                    <div className="text-gray-300 text-xs">12 участников</div>
                  </div>
                  {/* Кнопки переключения постов */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPrevious}
                      className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                      aria-label="Предыдущий пост"
                    >
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="text-gray-400 text-xs px-2">
                      {currentMessageSet + 1} / {messageSets.length}
                    </div>
                    <button
                      onClick={goToNext}
                      className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                      aria-label="Следующий пост"
                    >
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div 
                ref={chatContainerRef}
                className="space-y-4 overflow-y-auto scroll-smooth transition-opacity duration-300 flex-1"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  opacity: isTransitioning ? 0 : 1
                }}
                key={currentMessageSet}
              >
                {currentMessages.map((message) => (
                  <div key={message.id} className="flex gap-3 animate-fade-in-message">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.avatar === 'platform' 
                        ? 'bg-gradient-to-br from-[#00C742] to-[#0082D6]' 
                        : `bg-gradient-to-br ${message.avatar}`
                    }`}>
                      {message.avatar === 'platform' ? (
                        <span className="text-white font-bold text-xs">ТР</span>
                      ) : (
                        <span className="text-white font-semibold text-xs">{message.name[0]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-sm">{message.name}</span>
                        <span className="text-gray-500 text-xs">{message.date}</span>
                      </div>
                      
                      {message.type === 'text' && (
                        <p className="text-gray-300 text-sm">{message.text}</p>
                      )}

                      {message.type === 'courses' && message.courses && (
                        <div className="mb-2">
                          <p className="text-gray-300 text-sm mb-3">{message.text}</p>
                          {/* Превью сайта */}
                          {message.courses.preview && (
                            <div className="mb-3 bg-gray-900 rounded-lg p-2 border border-gray-700">
                              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                  <div className="w-full h-full relative bg-gray-900 rounded border border-gray-700">
                                    {/* Заголовок курса */}
                                    <div className="absolute top-2 left-2 right-2">
                                      <div className="h-2 bg-gray-700 rounded w-24 mb-1"></div>
                                      <div className="h-1.5 bg-gray-600 rounded w-32"></div>
                                    </div>
                                    
                                    {/* Элементы курса */}
                                    <div className="absolute bottom-4 left-2 right-2">
                                      <div className="grid grid-cols-2 gap-1.5">
                                        {/* Видео */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center">
                                          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                          </div>
                                        </div>
                                        {/* Тесты */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center">
                                          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                          </div>
                                        </div>
                                        {/* Сертификат */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center">
                                          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                          </div>
                                        </div>
                                        {/* Прогресс */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center">
                                          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {message.type === 'events' && message.events && (
                        <div className="mb-2">
                          <p className="text-gray-300 text-sm mb-3">{message.text}</p>
                          {/* Превью сайта */}
                          {message.events.preview && (
                            <div className="mb-3 bg-gray-900 rounded-lg p-2 border border-gray-700">
                              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                  <div className="w-full h-full relative bg-gray-900 rounded border border-gray-700 flex items-center justify-center gap-3">
                                    {/* Фотоаппарат */}
                                    <div className="flex flex-col items-center">
                                      <svg className="w-8 h-8 text-gray-500" viewBox="0 0 100 100" fill="currentColor">
                                        {/* Корпус фотоаппарата */}
                                        <rect x="20" y="30" width="60" height="45" rx="5" />
                                        {/* Объектив */}
                                        <circle cx="50" cy="52" r="15" fill="#1f2937" />
                                        <circle cx="50" cy="52" r="10" fill="#111827" />
                                        {/* Вспышка */}
                                        <rect x="65" y="35" width="8" height="6" rx="1" />
                                      </svg>
                                      <span className="text-gray-400 text-[8px] mt-1">📷</span>
                                    </div>
                                    
                                    {/* Микрофон */}
                                    <div className="flex flex-col items-center">
                                      <svg className="w-8 h-8 text-gray-500" viewBox="0 0 100 100" fill="currentColor">
                                        {/* Стойка микрофона */}
                                        <rect x="45" y="60" width="10" height="25" />
                                        {/* Основание */}
                                        <ellipse cx="50" cy="90" rx="20" ry="5" />
                                        {/* Головка микрофона */}
                                        <ellipse cx="50" cy="40" rx="18" ry="25" />
                                        <ellipse cx="50" cy="40" rx="12" ry="18" fill="#1f2937" />
                                      </svg>
                                      <span className="text-gray-400 text-[8px] mt-1">🎤</span>
                                    </div>
                                    
                                    {/* Кисточки */}
                                    <div className="flex flex-col items-center">
                                      <svg className="w-8 h-8 text-gray-500" viewBox="0 0 100 100" fill="currentColor">
                                        {/* Кисть 1 */}
                                        <path d="M30 20 L35 60 L25 60 Z" />
                                        <rect x="28" y="15" width="4" height="8" />
                                        {/* Кисть 2 */}
                                        <path d="M50 15 L55 65 L45 65 Z" />
                                        <rect x="48" y="10" width="4" height="8" />
                                        {/* Кисть 3 */}
                                        <path d="M70 25 L75 70 L65 70 Z" />
                                        <rect x="68" y="20" width="4" height="8" />
                                      </svg>
                                      <span className="text-gray-400 text-[8px] mt-1">🖌️</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {message.type === 'construction' && message.construction && (
                        <div className="mb-2">
                          <p className="text-gray-300 text-sm mb-3">{message.text}</p>
                          {/* Превью сайта */}
                          {message.construction.preview && (
                            <div className="mb-3 bg-gray-900 rounded-lg p-2 border border-gray-700">
                              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                  <div className="w-full h-full relative bg-gray-900 rounded border border-gray-700">
                                    {/* Силуэт дома */}
                                    <div className="absolute top-2 right-2">
                                      <svg className="w-12 h-12 text-gray-600" viewBox="0 0 100 100" fill="currentColor">
                                        {/* Крыша */}
                                        <path d="M50 10 L20 40 L80 40 Z" />
                                        {/* Стены */}
                                        <rect x="25" y="40" width="50" height="50" />
                                        {/* Дверь */}
                                        <rect x="40" y="60" width="20" height="30" fill="#1f2937" />
                                        {/* Окна */}
                                        <rect x="30" y="50" width="10" height="10" fill="#1f2937" />
                                        <rect x="60" y="50" width="10" height="10" fill="#1f2937" />
                                      </svg>
                                    </div>
                                    
                                    {/* Карточки товаров (квадратики) */}
                                    <div className="absolute bottom-4 left-2 right-2">
                                      <div className="grid grid-cols-3 gap-1.5">
                                        {/* Карточка 1 */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center">
                                          <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                        </div>
                                        {/* Карточка 2 */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center">
                                          <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                        </div>
                                        {/* Карточка 3 */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center">
                                          <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {message.type === 'image' && message.image && (
                        <div className="mb-2">
                          <p className="text-gray-300 text-sm mb-3">{message.text}</p>
                          <div className="bg-gray-900 rounded-lg p-2 border border-gray-700">
                            <p className="text-white text-xs font-semibold mb-2">{message.image.title}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {/* До */}
                              <div>
                                <p className="text-gray-400 text-[10px] mb-1 font-medium">До</p>
                                <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                                  <div className="relative aspect-square bg-gradient-to-br from-gray-600 to-gray-700 rounded overflow-hidden">
                                    {/* Фон */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-green-200/30"></div>
                                    {/* Предмет */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded shadow-lg"></div>
                                    </div>
                                    {/* Текст "Фон" */}
                                    <div className="absolute bottom-1 left-1 right-1 bg-black/50 rounded px-1 py-0.5">
                                      <p className="text-white text-[10px] text-center">Фото с фоном</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* После */}
                              <div>
                                <p className="text-gray-400 text-[10px] mb-1 font-medium">После</p>
                                <div className="bg-gray-800 rounded-lg p-2 border border-green-500/50">
                                  <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden">
                                    {/* Прозрачный фон */}
                                    <div className="absolute inset-0" style={{
                                      backgroundImage: 'repeating-linear-gradient(45deg, #1f2937 0px, #1f2937 10px, #111827 10px, #111827 20px)'
                                    }}></div>
                                    {/* Предмет без фона */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded shadow-lg"></div>
                                    </div>
                                    {/* Карточка товара */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                                      <div className="bg-white/15 rounded p-1 border border-white/20">
                                        <p className="text-white text-[10px] font-semibold mb-0.5">Название товара</p>
                                        <p className="text-green-400 text-[10px] font-bold">2 990 ₽</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {message.type === 'banner' && message.banner && (
                        <div className="mb-2">
                          <p className="text-gray-300 text-sm mb-3">{message.text}</p>
                          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                            {/* Баннер */}
                            <div className="mb-3">
                              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden relative border border-gray-700">
                                {/* Изображение товара - стилизованное */}
                                <div className="absolute inset-0">
                                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#00C742]/10 to-transparent"></div>
                                  {/* Стилизованное изображение коллекции */}
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-32 h-32 opacity-40">
                                    <div className="relative w-full h-full">
                                      {/* Товар 1 */}
                                      <div className="absolute top-0 right-0 w-16 h-16 bg-gray-700 rounded-lg shadow-lg transform rotate-12"></div>
                                      {/* Товар 2 */}
                                      <div className="absolute top-6 left-0 w-12 h-12 bg-gray-600 rounded-lg shadow-lg transform -rotate-6"></div>
                                      {/* Товар 3 */}
                                      <div className="absolute bottom-0 right-6 w-14 h-14 bg-gray-800 rounded-lg shadow-lg transform rotate-6"></div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Контент баннера */}
                                <div className="relative z-10 p-4">
                                  <div className="max-w-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xl">🎉</span>
                                      <p className="text-white font-bold text-lg">Новая коллекция</p>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-3">Скидка 20% на все товары</p>
                                    <button className="bg-[#00C742] hover:bg-[#00B36C] text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg text-sm">
                                      Успейте купить!
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Пост под баннером */}
                            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00C742] to-[#0082D6] flex items-center justify-center">
                                  <span className="text-white font-bold text-[10px]">ТР</span>
                                </div>
                                <div>
                                  <p className="text-white text-xs font-semibold">Точка Роста</p>
                                  <p className="text-gray-500 text-[10px]">только что</p>
                                </div>
                              </div>
                              <p className="text-gray-300 text-xs mb-3 leading-relaxed">{message.banner.post}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-gray-400 text-[10px]">Разместить в:</span>
                                {message.banner.platforms.map((platform, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-green-600/20 text-green-400 text-[10px] rounded-lg border border-green-600/30 font-semibold flex items-center gap-1">
                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {platform}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {message.type === 'portfolio' && message.portfolio && (
                        <div className="mb-2">
                          <p className="text-gray-300 text-sm mb-3">{message.text}</p>
                          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                            <p className="text-white text-xs font-semibold mb-3">{message.portfolio.title}</p>
                            
                            {/* Примеры использования */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              {message.portfolio.examples.map((example, idx) => (
                                <div key={idx} className="bg-gray-800 rounded-lg p-2 border border-gray-700 text-center">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C742] to-[#0082D6] mx-auto mb-1.5 flex items-center justify-center">
                                    <span className="text-white font-bold text-[10px]">
                                      {example.type === 'photographer' ? '📷' : example.type === 'artist' ? '🎭' : '🎪'}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 text-[10px] font-medium">{example.label}</p>
                                </div>
                              ))}
                            </div>
                            
                            {/* Возможности */}
                            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                              <p className="text-gray-400 text-[10px] mb-2 font-medium">Возможности:</p>
                              <div className="space-y-1.5">
                                {message.portfolio.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-gray-300 text-xs">{feature}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {message.type === 'crypto-preview' && message.cryptoPreview && (
                        <div className="mb-2">
                          <p className="text-gray-300 text-sm mb-3">{message.text}</p>
                          {/* Превью сайта */}
                          {message.cryptoPreview.preview && (
                            <div className="mb-3 bg-gray-900 rounded-lg p-2 border border-gray-700">
                              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                  <div className="w-full h-full flex items-center justify-center gap-2">
                                    {/* Карточка товара с монеткой */}
                                    <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center p-2">
                                      <div className="w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-600 flex items-center justify-center">
                                        <span className="text-gray-500 text-[10px] font-bold">₿</span>
                                      </div>
                                    </div>
                                    
                                    {/* Текст Crypto */}
                                    <div className="text-center">
                                      <p className="text-white text-xs font-bold">Crypto</p>
                                    </div>
                                    
                                    {/* Карточка товара со свечным графиком */}
                                    <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex items-center justify-center p-1">
                                      <div className="w-full h-full relative">
                                        {/* Свечной график */}
                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                          {/* Свечи */}
                                          {/* Свеча 1 */}
                                          <line x1="15" y1="30" x2="15" y2="50" stroke="#00C742" strokeWidth="3" />
                                          <line x1="12" y1="30" x2="18" y2="30" stroke="#00C742" strokeWidth="2" />
                                          <line x1="12" y1="50" x2="18" y2="50" stroke="#ef4444" strokeWidth="2" />
                                          
                                          {/* Свеча 2 */}
                                          <line x1="30" y1="25" x2="30" y2="55" stroke="#00C742" strokeWidth="3" />
                                          <line x1="27" y1="25" x2="33" y2="25" stroke="#00C742" strokeWidth="2" />
                                          <line x1="27" y1="55" x2="33" y2="55" stroke="#ef4444" strokeWidth="2" />
                                          
                                          {/* Свеча 3 */}
                                          <line x1="45" y1="20" x2="45" y2="60" stroke="#00C742" strokeWidth="3" />
                                          <line x1="42" y1="20" x2="48" y2="20" stroke="#00C742" strokeWidth="2" />
                                          <line x1="42" y1="60" x2="48" y2="60" stroke="#ef4444" strokeWidth="2" />
                                          
                                          {/* Свеча 4 */}
                                          <line x1="60" y1="35" x2="60" y2="65" stroke="#00C742" strokeWidth="3" />
                                          <line x1="57" y1="35" x2="63" y2="35" stroke="#00C742" strokeWidth="2" />
                                          <line x1="57" y1="65" x2="63" y2="65" stroke="#ef4444" strokeWidth="2" />
                                          
                                          {/* Свеча 5 */}
                                          <line x1="75" y1="15" x2="75" y2="70" stroke="#00C742" strokeWidth="3" />
                                          <line x1="72" y1="15" x2="78" y2="15" stroke="#00C742" strokeWidth="2" />
                                          <line x1="72" y1="70" x2="78" y2="70" stroke="#ef4444" strokeWidth="2" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {message.type === 'shop' && message.shop && (
                        <div className="mb-2">
                          <p className="text-gray-300 text-sm mb-3">{message.text}</p>
                          {/* Превью сайта */}
                          {message.shop.preview && (
                            <div className="mb-3 bg-gray-900 rounded-lg p-2 border border-gray-700">
                              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                  <div className="w-full h-full relative bg-gray-900 rounded border border-gray-700">
                                    {/* Заголовок магазина */}
                                    <div className="absolute top-2 left-2 right-2">
                                      <div className="flex items-center justify-between">
                                        <div className="h-2 bg-gray-700 rounded w-16"></div>
                                        <div className="flex gap-1">
                                          <div className="w-4 h-4 bg-gray-700 rounded"></div>
                                          <div className="w-4 h-4 bg-gray-700 rounded"></div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Карточки товаров */}
                                    <div className="absolute bottom-4 left-2 right-2">
                                      <div className="grid grid-cols-3 gap-1.5">
                                        {/* Карточка товара 1 */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex flex-col items-center justify-center p-1">
                                          <div className="w-full h-2/3 bg-gray-700 rounded mb-1"></div>
                                          <div className="w-full h-1 bg-gray-600 rounded"></div>
                                        </div>
                                        {/* Карточка товара 2 */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex flex-col items-center justify-center p-1">
                                          <div className="w-full h-2/3 bg-gray-700 rounded mb-1"></div>
                                          <div className="w-full h-1 bg-gray-600 rounded"></div>
                                        </div>
                                        {/* Карточка товара 3 */}
                                        <div className="bg-gray-800 rounded border border-gray-700 aspect-square flex flex-col items-center justify-center p-1">
                                          <div className="w-full h-2/3 bg-gray-700 rounded mb-1"></div>
                                          <div className="w-full h-1 bg-gray-600 rounded"></div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Иконка корзины */}
                                    <div className="absolute top-6 right-2">
                                      <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {message.buttons && (
                        <div className="flex gap-2 flex-wrap mt-3">
                          {message.buttons.map((button, idx) => (
                            <button 
                              key={idx}
                              className={`px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition-colors ${
                                idx === 0 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                            >
                              {button}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notch (монобровь) - снизу блока, на границе с Roadmap */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50" style={{ bottom: '-32px' }}>
        <div className="w-64 h-10 bg-gray-900 rounded-b-full shadow-lg"></div>
      </div>
    </section>
  )
}
