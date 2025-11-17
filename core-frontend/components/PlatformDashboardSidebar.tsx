'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface NavLinkProps {
  href: string
  icon: string
  text: string
  active?: boolean
}

function NavLink({ href, icon, text, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{text}</span>
      </div>
    </Link>
  )
}

interface PlatformDashboardSidebarProps {
  user?: {
    name: string
    email: string
  }
}

export default function PlatformDashboardSidebar({ user }: PlatformDashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/platform/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout error:', err)
    }
    
    router.push('/platform-dashboard/login')
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl">
      <div className="p-6 border-b border-gray-700">
        <Link href="/platform-dashboard" className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center font-bold text-xl">
            🏢
          </div>
          <div>
            <div className="font-bold text-lg">Platform</div>
            <div className="text-xs text-gray-400">Управление платформеной страницей</div>
          </div>
        </Link>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink 
          href="/platform-dashboard" 
          icon="📊" 
          text="Главная" 
          active={pathname === '/platform-dashboard'}
        />
        <NavLink 
          href="/platform-dashboard/modules" 
          icon="🧩" 
          text="Модули" 
          active={pathname?.includes('/modules')}
        />
        <NavLink 
          href="/platform-dashboard/settings" 
          icon="⚙️" 
          text="Настройки" 
          active={pathname?.includes('/settings')}
        />
        <NavLink 
          href="/platform-dashboard/sections/stats" 
          icon="📈" 
          text="Statistics" 
          active={pathname?.includes('/sections/stats')}
        />
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        {user && (
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || 'П'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{user.name || 'Platform Master'}</div>
              <div className="text-xs text-gray-400 truncate">{user.email || 'platform@example.com'}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg font-semibold transition text-sm"
        >
          🚪 Выход
        </button>
      </div>
    </aside>
  )
}


