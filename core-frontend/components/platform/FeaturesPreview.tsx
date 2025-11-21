'use client'

import { ScrollReveal } from '@/components/ScrollReveal'

export const FeaturesPreview = () => {
  return (
    <ScrollReveal>
      <section className="bg-transparent text-white py-32 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-3 gap-8">
        
        {/* Карточка 1: AI Копирайтер (Широкая) */}
        <div className="md:col-span-2 bg-[#0a0e1a] border border-white/10 rounded-[2rem] p-10 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="relative z-10">
            <svg className="text-yellow-400 mb-4 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-3xl font-semibold mb-2">AI Копирайтер</h3>
            <p className="text-gray-400 text-lg max-w-md">
              Не знаете, что написать? ИИ создаст описание товара и сгенерирует продающий текст за секунды.
            </p>
          </div>
          {/* Декоративный градиент справа */}
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-yellow-500/10 to-transparent opacity-50"></div>
        </div>

        {/* Карточка 2: Мультипостинг (Высокая) */}
        <div className="md:col-span-1 bg-[#0a0e1a] border border-white/10 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-white/20 transition-colors">
          <div>
            <svg className="text-blue-500 mb-4 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <h3 className="text-2xl font-semibold mb-2">Мультипостинг</h3>
            <p className="text-gray-400">
              Один клик — и товар улетает в Telegram, VK и Max.
            </p>
          </div>
          {/* Индикатор соцсетей (кружочки) */}
          <div className="mt-8 flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
             <div className="w-8 h-8 rounded-full bg-blue-500"></div>
             <div className="w-8 h-8 rounded-full bg-blue-400"></div>
             <div className="w-8 h-8 rounded-full bg-white"></div>
          </div>
        </div>

         {/* Карточка 3: Авто-SEO (Во всю ширину) */}
         <div className="md:col-span-3 bg-[#0a0e1a] border border-white/10 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-10 hover:border-white/20 transition-colors">
            <div className="flex-1">
              <svg className="text-emerald-500 mb-4 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-3xl font-semibold mb-2">Авто-SEO</h3>
              <p className="text-gray-400 text-lg">
                Платформа сама заботится о том, чтобы вас находили. 
                Мы оптимизируем структуру под поисковики автоматически.
              </p>
            </div>
            {/* Визуализация поисковой строки */}
            <div className="flex-1 w-full bg-white/5 rounded-xl h-32 flex items-center justify-center border border-white/5">
              <span className="text-gray-500 font-mono text-sm">Google: "Купить свечи ручной работы..."</span>
            </div>
         </div>

      </div>
    </section>
    </ScrollReveal>
  )
}

