import Link from 'next/link'

export const Footer = () => {
  return (
    <footer 
      className="bg-gray-900 text-white"
      style={{ 
        fontFamily: "'PF BeauSans Pro', 'Montserrat', sans-serif"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-[#00C742]">Точка Роста</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Современная платформа для создания интернет-магазинов. 
              Создайте свой магазин за считанные минуты.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00C742] transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.174 1.858-.926 6.655-1.305 8.84-.152.855-.45 1.14-.74 1.168-.63.057-1.11-.415-1.721-.815-.955-.64-1.496-1.038-2.423-1.662-1.07-.699-.376-1.084.233-1.712.16-.164 2.93-2.688 2.987-2.916.007-.03.014-.145-.055-.202-.069-.057-.17-.034-.243-.02-.104.02-1.755 1.12-4.953 3.285-.469.313-.893.465-1.275.458-.42-.008-1.227-.237-1.827-.432-.737-.24-1.322-.367-1.27-.775.026-.207.39-.42 1.074-.637 4.25-1.85 7.08-3.07 8.4-3.68 2.05-.95 2.47-1.115 2.75-1.12.06-.001.19.014.275.1.07.07.09.163.1.23.01.06.02.2.01.308z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00C742] transition-colors"
                aria-label="VK"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.785 16.241s-.327.038-.745-.038c-.509-.086-1.2-.3-1.662-.535-.19-.095-.475-.238-.475-.475 0-.143.095-.238.19-.3.19-.143.475-.238.66-.3.856-.38 1.338-.6 1.338-1.2 0-.509-.38-.856-1.015-.856-.713 0-1.1.3-1.2.856 0 .095-.095.19-.19.19h-1.015c-.19 0-.285-.095-.285-.238 0-.713.475-1.9 1.9-1.9 1.2 0 1.9.713 1.9 1.662 0 .856-.475 1.338-1.015 1.662-.095.047-.19.095-.19.19 0 .095.047.143.143.238.19.19.475.38.856.475.19.047.38.095.475.19.19.19.19.38.19.475 0 .19-.095.38-.19.475zm-1.338-6.09c-.713 0-1.338.6-1.338 1.338s.6 1.338 1.338 1.338 1.338-.6 1.338-1.338-.6-1.338-1.338-1.338zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 5.562c.19 0 .38.19.38.38v1.338c0 .19-.19.38-.38.38h-1.338c-.19 0-.38-.19-.38-.38V5.942c0-.19.19-.38.38-.38h1.338zm-2.856 0c.19 0 .38.19.38.38v1.338c0 .19-.19.38-.38.38h-1.338c-.19 0-.38-.19-.38-.38V5.942c0-.19.19-.38.38-.38h1.338z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-gray-400 hover:text-[#00C742] transition-colors">
                  Возможности
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-[#00C742] transition-colors">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-[#00C742] transition-colors">
                  Регистрация
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-400 hover:text-[#00C742] transition-colors">
                  Войти
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Правовая информация</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terms" className="text-gray-400 hover:text-[#00C742] transition-colors">
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-400 hover:text-[#00C742] transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-[#00C742] transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Точка Роста. Все права защищены.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/legal/terms" className="hover:text-[#00C742] transition-colors">
                Условия
              </Link>
              <Link href="/legal/privacy" className="hover:text-[#00C742] transition-colors">
                Конфиденциальность
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

