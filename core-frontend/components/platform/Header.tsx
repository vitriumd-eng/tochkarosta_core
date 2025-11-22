'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-[25px] w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Точка.Роста"
          width={120}
          height={35}
          className="h-8 w-auto"
          priority
        />
      </Link>
      
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link
          href="/modules"
          className="text-gray-900 hover:text-gray-600 transition"
        >
          Модули
        </Link>
        <a
          href="#business"
          className="text-gray-600 hover:text-gray-900 transition"
        >
          Для бизнеса
        </a>
        <a
          href="#features"
          className="text-gray-600 hover:text-gray-900 transition"
        >
          Возможности
        </a>
        <a
          href="#about"
          className="text-gray-600 hover:text-gray-900 transition"
        >
          О платформе
        </a>
      </div>

      <button 
        className="bg-[#1F1D2B] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#2A2838] transition"
        aria-label="Войти в личный кабинет"
      >
        Войти
      </button>
    </nav>
  )
}
