'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Wallet, Clock, ArrowUpRight, ArrowRight } from 'lucide-react'

export const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Эффект появления при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    const section = document.getElementById('stats-section')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats-section" className="py-16 bg-white overflow-hidden">
      <div className="px-[25px] w-full">
        
        <div className="text-left mb-8 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1D1D1F] mb-3">
            Математика в вашу пользу.
          </h2>
          <p className="text-base text-gray-500">
            Мы посчитали, сколько ресурсов освобождает платформа. Результаты говорят сами за себя.
          </p>
        </div>

        {/* Объединенная карточка */}
        <div className="bg-[#F5F5F7] rounded-[2rem] p-6 max-w-4xl border border-transparent hover:border-gray-200 transition-all duration-500">
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Секция 1: Рост конверсии */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
                <TrendingUp size={18} className="text-emerald-500"/>
                <span>Рост конверсии</span>
              </div>
              <div className="text-2xl font-semibold text-[#1D1D1F] mb-4">
                +320%
                <span className="text-sm text-gray-400 ml-1 font-normal">за полгода</span>
              </div>
              {/* SVG Chart Area */}
              <div className="mt-auto h-32 w-full relative">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#E5E5E5" strokeWidth="0.5" strokeDasharray="2"/>
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#E5E5E5" strokeWidth="0.5" strokeDasharray="2"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0,45 C20,45 30,35 50,25 C70,15 80,10 100,5" 
                    fill="url(#gradient)" 
                    stroke="none"
                    className={`transition-all duration-[2000ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <path 
                    d="M0,45 C20,45 30,35 50,25 C70,15 80,10 100,5" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                    style={{ strokeDasharray: 120, strokeDashoffset: isVisible ? 0 : 120 }}
                  />
                  <circle cx="0" cy="45" r="1.5" fill="white" stroke="#10B981" strokeWidth="1"/>
                  <circle cx="50" cy="25" r="1.5" fill="white" stroke="#10B981" strokeWidth="1"/>
                  <circle cx="100" cy="5" r="2" fill="#10B981" className="animate-pulse"/>
                </svg>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Старт</span>
                  <span>3 мес</span>
                  <span>Сейчас</span>
                </div>
              </div>
            </div>

            {/* Секция 2: Экономия */}
            <div className="bg-[#1D1D1F] text-white rounded-[1.5rem] p-4 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-2">
                <Wallet size={18} className="text-blue-500"/>
                <span>Экономия</span>
              </div>
              <div className="text-2xl font-semibold mb-4">
                145 000 ₽
                <span className="text-sm text-gray-500 ml-1 font-normal">в среднем</span>
              </div>
              <div className="mt-auto space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Агентство</span>
                    <span>~150 000 ₽</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-full transition-all duration-1000 delay-300 ${isVisible ? 'w-full' : 'w-0'}`}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-emerald-400 mb-1 font-medium">
                    <span>Точка Роста</span>
                    <span>5 000 ₽</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 delay-500 ${isVisible ? 'w-[3.3%]' : 'w-0'}`}
                      style={{ minWidth: '8px' }} 
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    * Выгода в 30 раз
                  </div>
                </div>
              </div>
            </div>

            {/* Секция 3: Время */}
            <div className="bg-white border border-gray-100 rounded-[1.5rem] p-4 flex flex-col shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-orange-50 p-2 rounded-full text-orange-500">
                  <Clock size={18} />
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F]">Больше времени</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4 flex-1">
                Самозанятые тратят до 30% времени на рутину. С Точкой Роста это время сводится к нулю.
              </p>
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Было</div>
                  <div className="text-lg font-bold text-gray-300 line-through">4ч/день</div>
                </div>
                <ArrowRight size={16} className="text-gray-300"/>
                <div className="text-center">
                  <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Стало</div>
                  <div className="text-2xl font-bold text-[#1D1D1F]">15 мин</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
