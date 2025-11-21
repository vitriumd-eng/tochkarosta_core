'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  tenantName?: string
}

export const DashboardHeader = ({ tenantName }: DashboardHeaderProps) => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ 
        fontFamily: "'PF BeauSans Pro', 'Montserrat', sans-serif",
        background: 'linear-gradient(to bottom, #1a1f2e 0%, #0a0e1a 100%)',
        borderBottom: '1px solid rgba(0, 255, 153, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/dashboard-platform" 
              className="text-gray-300 hover:text-[#00ff99] transition-colors font-medium"
            >
              Дашборд
            </Link>
            <Link 
              href="/dashboard-platform/modules" 
              className="text-gray-300 hover:text-[#00ff99] transition-colors font-medium"
            >
              Модули
            </Link>
            <Link 
              href="/dashboard-platform/settings" 
              className="text-gray-300 hover:text-[#00ff99] transition-colors font-medium"
            >
              Настройки
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {tenantName && (
              <span className="hidden sm:block text-gray-300 font-medium">
                {tenantName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 hover:text-red-400 transition-colors font-medium"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

