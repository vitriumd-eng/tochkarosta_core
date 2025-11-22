'use client'

export const AboutPlatform = () => {
  return (
    <section id="about" className="py-20 bg-white overflow-hidden">
      <div className="px-[25px] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D1D1F] mb-6">
              О платформе
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Точка.Роста — это единая платформа для запуска и развития цифрового бизнеса. 
              Без программирования, без сложных настроек, без лишних затрат.
            </p>
            
            {/* Цели и аудитория */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12 text-left">
              <div className="bg-[#FAFAFA] rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-4">Для каких целей создана</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Быстрый запуск цифрового бизнеса без технических знаний</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Упрощение процесса продаж товаров и услуг онлайн</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Автоматизация рутинных задач с помощью AI</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Снижение затрат на разработку и поддержку бизнеса</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Объединение всех инструментов для бизнеса в одной платформе</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#FAFAFA] rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-4">Для кого предназначена</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Предприниматели, которые хотят продавать товары онлайн</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Самозанятые, предлагающие услуги и консультации</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Малый бизнес без IT-отдела</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Творческие профессионалы (фотографы, дизайнеры, ремесленники)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7C3AED] font-bold">•</span>
                    <span>Организаторы мероприятий и курсов</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Преимущество 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Запуск за 60 секунд</h3>
              <p className="text-gray-600">
                Выберите модуль, настройте базовые параметры и начните продавать. 
                Никаких технических знаний не требуется.
              </p>
            </div>

            {/* Преимущество 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">AI-инструменты</h3>
              <p className="text-gray-600">
                Встроенный AI помогает создавать контент, анализировать товары, 
                оптимизировать SEO и автоматизировать рутинные задачи.
              </p>
            </div>

            {/* Преимущество 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Без комиссий</h3>
              <p className="text-gray-600">
                Мы не берем процент с оборота. Вы платите только за подписку 
                и получаете все заработанные средства.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-[#FAFAFA] rounded-3xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] mb-4">
                Всё необходимое в одном месте
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Управление товарами, заказами, клиентами, аналитика, AI-инструменты, 
                интеграции с мессенджерами — всё это уже встроено в платформу.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                  Каталог товаров
                </div>
                <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                  Корзина и оплата
                </div>
                <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                  CRM система
                </div>
                <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                  Аналитика
                </div>
                <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                  AI-консультант
                </div>
                <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                  Интеграции
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

