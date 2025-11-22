'use client'

export const WhatIsUSD = () => {
  return (
    <div className="px-[25px] w-full mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-medium text-[#1F1D2B] mb-6">
          Что такое Точка.Роста?
        </h2>
        <button className="bg-[#2A2838] text-white px-6 py-2.5 rounded-full text-sm flex items-center gap-2 hover:bg-opacity-90 transition">
          Узнать больше
        </button>
      </div>
      <p className="text-gray-500 max-w-sm text-lg leading-relaxed md:text-right">
        Точка.Роста — это экосистема, где предприниматели арендуют готовые цифровые бизнесы без необходимости нанимать программистов. Бизнес за 60 секунд.
      </p>
    </div>
  )
}
