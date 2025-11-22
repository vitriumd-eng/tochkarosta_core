'use client'

import { Plus, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const ModulesHero = () => {
  return (
    <div className="px-[25px] w-full mb-20">
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
        <div className="relative z-10 flex flex-col items-center pt-20 md:pt-28 text-center px-4">
          <Package className="mb-4 text-gray-800" size={24} strokeWidth={3} />
          <h1 className="text-4xl md:text-6xl font-medium text-[#1F1D2B] mb-6 tracking-tight">
            Готовые модули для вашего бизнеса
          </h1>
          <p className="text-gray-600 max-w-md mb-8 text-sm md:text-base leading-relaxed">
            Выберите подходящий модуль и начните продавать за 60 секунд без программирования. Все модули готовы к использованию из коробки.
          </p>
          <Link
            href="/register"
            className="bg-[#1F1D2B] text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition duration-300"
          >
            Начать бизнес
          </Link>
        </div>
      </div>
    </div>
  )
}


