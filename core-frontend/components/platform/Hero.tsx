'use client'

import Image from 'next/image'

export const Hero = () => {
  return (
    <div className="px-[25px] w-full mb-20 pt-24">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden h-[85vh]">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1634117622592-114e3024ff27?q=80&w=2525&auto=format&fit=crop"
          alt="Hero 3D Landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-x-0 top-0 h-[80%] bg-gradient-to-b from-indigo-50/80 via-transparent to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center pt-12 md:pt-16 text-center px-4">
          <Image
            src="/logo.svg"
            alt="Точка.Роста"
            width={300}
            height={88}
            className="h-20 md:h-24 w-auto mb-4"
            priority
          />
          <h1 className="text-4xl md:text-6xl font-medium text-[#1F1D2B] mb-6 tracking-tight">
            Где растет ваш бизнес
          </h1>
          <p className="text-gray-600 max-w-md mb-8 text-sm md:text-base leading-relaxed">
            Платформа для аренды готовых цифровых бизнесов. Запустите свой магазин, портфолио или мероприятие за 60 секунд без программистов.
          </p>
          <button 
            className="bg-[#1F1D2B] text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition duration-300"
            aria-label="Начать бизнес на платформе Точка.Роста"
          >
            Начать бизнес
          </button>
        </div>
      </div>
    </div>
  )
}
