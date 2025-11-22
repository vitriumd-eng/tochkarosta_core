'use client'

import Link from 'next/link'
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="bg-[#1F1D2B] text-white">
      <div className="px-[25px] w-full">
        <div className="max-w-7xl mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Логотип и описание */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/logow.svg"
                  alt="Точка.Роста"
                  width={120}
                  height={35}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                Платформа для цифрового бизнеса. Запустите свой бизнес за 60 секунд без программирования.
              </p>
            </div>

            {/* Навигация */}
            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/modules" className="hover:text-white transition">
                    Модули
                  </Link>
                </li>
                <li>
                  <a href="#business" className="hover:text-white transition">
                    Для бизнеса
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Возможности
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition">
                    О платформе
                  </a>
                </li>
              </ul>
            </div>

            {/* Правовая информация */}
            <div>
              <h3 className="font-semibold mb-4">Правовая информация</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Пользовательское соглашение
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="/biometric" className="hover:text-white transition">
                    Согласие на биометрию
                  </Link>
                </li>
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:info@tochkarosta.ru" className="hover:text-white transition">
                    info@tochkarosta.ru
                  </a>
                </li>
                <li>
                  <a href="tel:+79999999999" className="hover:text-white transition">
                    +7 (999) 999-99-99
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Копирайт */}
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Точка.Роста. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
