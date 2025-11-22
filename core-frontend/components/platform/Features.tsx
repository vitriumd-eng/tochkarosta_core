'use client'

import Image from 'next/image'

export const Features = () => {
  return (
    <div className="px-[25px] w-full flex flex-col md:flex-row gap-6 mb-20">
      {/* Card 1: Бизнес за 60 секунд - Wider */}
      <div className="flex-1 md:flex-[1.5] bg-gradient-to-br from-[#Dbeafe] to-[#E0E7FF] rounded-[2rem] p-8 md:p-10 h-[250px] relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-2xl font-medium text-[#1F1D2B] mb-4">Бизнес за 60 секунд</h3>
          <p className="text-gray-600 text-sm max-w-xs">
            Выберите модуль, выберите дизайн и начните продавать. Никакого программирования и сложных настроек.
          </p>
        </div>
        <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 opacity-90 mix-blend-multiply rounded-full rotate-12 group-hover:scale-110 transition duration-500 relative">
          <Image
            src="https://images.unsplash.com/photo-1680284780958-240735c6d42b?q=80&w=1000&auto=format&fit=crop"
            alt="Flower 3D"
            fill
            className="object-cover rounded-full"
          />
        </div>
      </div>

      {/* Card 2: Полная изоляция */}
      <div className="flex-1 bg-[#1F1D2B] rounded-[2rem] p-8 md:p-10 h-[250px] flex flex-col justify-between hover:bg-[#2a2838] transition duration-300">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">
            Полная<br />изоляция
          </h3>
        </div>
        <p className="text-gray-400 text-sm max-w-xs">
          Ваши данные и бизнес полностью изолированы. Даже если один магазин пострадает, остальные продолжат работать.
        </p>
      </div>

      {/* Card 3: Экономия */}
      <div className="flex-1 bg-[#1D1D1F] text-white rounded-[2rem] p-8 md:p-10 h-[250px] flex flex-col justify-between hover:bg-[#2a2838] transition duration-300">
        <div>
          <h3 className="text-2xl font-medium text-white mb-2">
            Экономия<br />145 000 ₽
          </h3>
          <p className="text-gray-400 text-xs mb-4">в среднем</p>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Разработка и запуск</span>
              <span>~150 000 ₽</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-full w-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-emerald-400 mb-1 font-medium">
              <span>Точка Роста</span>
              <span>5 000 ₽</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '3.3%', minWidth: '8px' }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              * Выгода в 30 раз
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
