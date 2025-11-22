'use client'

import Image from 'next/image'

export const BentoGrid = () => {
  return (
    <section className="py-24 px-[25px] bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Bento Grid Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] mb-12 text-center">Всё, что нужно для роста</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. SNAP & SELL (Featured) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl mb-4 border border-gray-200">📸</div>
                <h3 className="text-2xl font-bold mb-2">Сфоткал — и продал</h3>
                <p className="text-gray-500 break-words pr-4">Забудь про сложные админки. Наведи камеру на свой товар, AI распознает его, предложит цену и создаст карточку за секунду.</p>
              </div>
              
              {/* Visual: Camera Interface */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 border-l border-gray-100 overflow-hidden hidden sm:block">
                <Image
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Товар"
                  fill
                  className="object-cover opacity-80"
                />
                
                {/* Viewfinder Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white/50 rounded-3xl relative backdrop-blur-[2px]">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#7C3AED] rounded-tl-xl"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#7C3AED] rounded-tr-xl"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#7C3AED] rounded-bl-xl"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#7C3AED] rounded-br-xl"></div>
                    
                    {/* Tag UI */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white text-xs py-1 px-3 rounded-full flex items-center gap-2 whitespace-nowrap">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Игрушка, ручная работа
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. AI Marketing */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all flex flex-col">
              <div className="mb-auto">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-4 text-[#7C3AED]">✨</div>
                <h3 className="text-xl font-bold mb-2">AI Маркетолог</h3>
                <p className="text-gray-500 text-sm">Генерирует тексты и посты для соцсетей.</p>
              </div>
              {/* Chat Bubble UI */}
              <div className="mt-6 space-y-3">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-xs text-gray-600 max-w-[90%]">
                  Напиши пост про новую свечу с лавандой...
                </div>
                <div className="bg-[#7C3AED]/10 p-3 rounded-2xl rounded-tr-none text-xs text-[#7C3AED] font-medium ml-auto max-w-[90%]">
                  ✨ "Окунись в атмосферу Прованса с новой..."
                </div>
              </div>
            </div>

            {/* 3. AI SEO Analyzer */}
            <div className="bg-[#1D1D1F] text-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-4 text-[#7C3AED]">🔍</div>
                <h3 className="text-xl font-bold mb-2">AI SEO-аналитик</h3>
                <p className="text-gray-400 text-sm mb-4">Анализирует товар и пишет лучшее SEO-описание для максимальной видимости.</p>
                
                <div className="mt-6 space-y-3">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Анализ товара</div>
                    <div className="text-sm text-white">Определяет ключевые характеристики</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">SEO-оптимизация</div>
                    <div className="text-sm text-white">Создает идеальное описание</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#7C3AED] rounded-full blur-[60px] opacity-40"></div>
            </div>

            {/* 4. Omni-channel */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex items-center justify-between">
              <div className="relative z-10 max-w-[60%]">
                <h3 className="text-xl font-bold mb-2">Одна кнопка — везде пост</h3>
                <p className="text-gray-500 text-sm">Автоматический кросс-постинг в Telegram и VK. Ваша витрина синхронизируется с соцсетями.</p>
              </div>
              {/* Logos Floating */}
              <div className="relative w-32 h-32">
                <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg transform rotate-12">VK</div>
                <div className="absolute bottom-0 left-4 w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-lg transform -rotate-6">TG</div>
                <div className="absolute top-10 left-0 w-12 h-12 bg-[#1D1D1F] text-white rounded-xl flex items-center justify-center shadow-lg transform -rotate-12 z-10">TR</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


