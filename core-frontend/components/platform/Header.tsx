'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
      style={{ 
        fontFamily: "'PF BeauSans Pro', 'Montserrat', sans-serif"
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/stats/logo.svg"
              alt="Точка Роста"
              width={150}
              height={45}
              priority
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/modules" 
              className="text-gray-700 hover:text-[#00C742] transition-colors font-medium"
            >
              Модули
            </Link>
            <Link 
              href="/#about" 
              className="text-gray-700 hover:text-[#00C742] transition-colors font-medium"
            >
              О платформе
            </Link>
            <Link 
              href="/#pricing" 
              className="text-gray-700 hover:text-[#00C742] transition-colors font-medium"
            >
              Тарифы
            </Link>
            <Link 
              href="/#roadmap" 
              className="text-gray-700 hover:text-[#00C742] transition-colors font-medium"
            >
              Новости
            </Link>
            <Link 
              href="/auth" 
              className="text-gray-700 hover:text-[#00C742] transition-colors font-medium"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-[#00C742] text-white font-bold rounded-full transition-all duration-300 hover:bg-[#00B36C] hover:scale-105"
            >
              Регистрация
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#00C742] transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
            <Link 
              href="/modules" 
              className="block py-2 text-gray-700 hover:text-[#00C742] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Модули
            </Link>
            <Link 
              href="/#about" 
              className="block py-2 text-gray-700 hover:text-[#00C742] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              О платформе
            </Link>
            <Link 
              href="/#pricing" 
              className="block py-2 text-gray-700 hover:text-[#00C742] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Тарифы
            </Link>
            <Link 
              href="/#roadmap" 
              className="block py-2 text-gray-700 hover:text-[#00C742] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Новости
            </Link>
            <Link 
              href="/auth" 
              className="block py-2 text-gray-700 hover:text-[#00C742] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="block mt-4 px-6 py-2 bg-[#00C742] text-white font-bold rounded-full text-center transition-all duration-300 hover:bg-[#00B36C]"
              onClick={() => setIsMenuOpen(false)}
            >
              Регистрация
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

