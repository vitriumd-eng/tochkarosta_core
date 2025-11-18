import Link from 'next/link'

export const Roadmap = () => {
  return (
    <section 
      id="roadmap"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-white"
      style={{ 
        fontFamily: "'PF BeauSans Pro', 'Montserrat', sans-serif"
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            ДОРОЖНАЯ КАРТА (ROADMAP)
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#00C742] mb-6">
            TOCHKA ROSTA
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Наша цель — построить самую умную модульную бизнес-платформу для предпринимателей, экспертов, создателей продуктов и онлайн-проектов.
          </p>
        </div>

        {/* Roadmap Content */}
        <div className="space-y-12 md:space-y-16">
          {/* 1. Текущий этап (LIVE) */}
          <div className="bg-gradient-to-r from-[#00C742] to-[#00B36C] rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">1.</span>
              <h3 className="text-2xl md:text-3xl font-bold">Текущий этап (LIVE)</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-200">✔</span> Запуск ядра платформы
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Централизованная авторизация</li>
                  <li>• Управление подписчиками</li>
                  <li>• Управление модулями</li>
                  <li>• Поддомены третьего уровня</li>
                  <li>• Тарифы и пробные периоды</li>
                  <li>• Интеграция с Telegram/MAX/VK для 2FA</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-200">✔</span> Запущены первые модули
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Модуль «Магазин» (e-commerce)</li>
                  <li>• Система покупателей (личные кабинеты, история заказов)</li>
                  <li>• ЮKassa: базовое подключение</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-200">✔</span> Базовая AI инфраструктура
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Умная SEO-индексация</li>
                  <li>• Анализ контента магазина</li>
                  <li>• Генерация мета-разметки</li>
                  <li>• Авто-заголовки и description</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Ближайшие обновления */}
          <div className="bg-gradient-to-r from-[#0082D6] to-[#007DE3] rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">2.</span>
              <h3 className="text-2xl md:text-3xl font-bold">Ближайшие обновления (в процессе)</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔧</span> Улучшение модульной архитектуры
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• SDK v2 для backend'а модулей</li>
                  <li>• Автоматическая проверка совместимости модулей с ядром</li>
                  <li>• Миграции модулей с авто-проверкой</li>
                  <li>• Улучшенный gateway</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🤖</span> AI-SEO 2.0
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Анализ ниши пользователя</li>
                  <li>• Автоматический подбор запросов</li>
                  <li>• Генерация SEO-структуры</li>
                  <li>• Кластеризация ключевых слов</li>
                  <li>• AI-баннеры</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">💳</span> Платёжная инфраструктура
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• ЮKassa: подписки, рекуррентные платежи</li>
                  <li>• Stripe (международные подписчики)</li>
                  <li>• P2P-оплата «карта-к-карте»</li>
                  <li>• Внутренняя система промокодов</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🧾</span> Улучшенный Dashboard подписчика
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Глубокая аналитика действий покупателей</li>
                  <li>• AI-подсказки для увеличения продаж</li>
                  <li>• Центр уведомлений</li>
                  <li>• Центр SEO статуса</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Новые модули */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">3.</span>
              <h3 className="text-2xl md:text-3xl font-bold">Новые модули (Q1–Q2)</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛒</span> Модуль «Расширенный магазин»
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Фильтры</li>
                  <li>• Категории</li>
                  <li>• Варианты товара</li>
                  <li>• Доставки</li>
                  <li>• CRM из коробки</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎫</span> Модуль «Мероприятия»
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Продажа билетов</li>
                  <li>• QR-пропуска</li>
                  <li>• Автоматические письма</li>
                  <li>• Онлайн/оффлайн событие</li>
                  <li>• Расписание, спикеры, тарифы</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎨</span> Модуль «Портфолио»
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Кейсы</li>
                  <li>• Отзывы</li>
                  <li>• Галереи</li>
                  <li>• Лэндинги на поддомене</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎓</span> Модуль «Онлайн-курсы»
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Уроки</li>
                  <li>• Доступ по подписке</li>
                  <li>• ДЗ / проверки</li>
                  <li>• Сертификаты</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4. Большие релизы */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">4.</span>
              <h3 className="text-2xl md:text-3xl font-bold">Большие релизы (Q2–Q3)</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🤝</span> Marketplace модулей
                </h4>
                <p className="ml-8 text-gray-100 mb-2">
                  — Подписчики смогут подключать модули от сторонних разработчиков
                </p>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Разработчики смогут продавать свои модули</li>
                  <li>• Оценка, рейтинги, фильтрация</li>
                  <li>• Автоматическая проверка совместимости</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🧠</span> AI-ассистент бизнеса
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Генерация карточек товаров</li>
                  <li>• Генерация лендингов</li>
                  <li>• Персональный маркетолог</li>
                  <li>• Подбор рекламных стратегий</li>
                  <li>• Автоматические кампании в VK Ads / Target</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📈</span> Система аналитики 2.0
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Тепловые карты</li>
                  <li>• Конверсия по шагам</li>
                  <li>• Источники трафика</li>
                  <li>• Продажи в реальном времени</li>
                  <li>• Отчёты в PDF</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5. Долгосрочные планы */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">5.</span>
              <h3 className="text-2xl md:text-3xl font-bold">Долгосрочные планы (Q3–Q4)</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌍</span> Мульти-язычность
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Авто-перевод контента</li>
                  <li>• SEO-локализация</li>
                  <li>• Multi-region домены</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📦</span> WMS + интеграции
                </h4>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• МойСклад</li>
                  <li>• Yandex Delivery</li>
                  <li>• Post.ru</li>
                  <li>• Wildberries API</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏗</span> Конструктор лендингов 2.0
                </h4>
                <p className="ml-8 text-gray-100 mb-2">
                  — Drag & Drop
                </p>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• Темы</li>
                  <li>• Библиотека готовых блоков</li>
                  <li>• Маркетплейс шаблонов</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚙</span> Runtime-автоматизация
                </h4>
                <p className="ml-8 text-gray-100 mb-2">
                  Scenarios builder (как Zapier)
                </p>
                <ul className="space-y-2 ml-8 text-gray-100">
                  <li>• «Если товар закончился — включить форму заявки»</li>
                  <li>• «Если пришёл новый заказ — отправить телеграм»</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 6. Видение */}
          <div 
            className="rounded-2xl p-6 md:p-8 text-white shadow-xl"
            style={{
              background: 'linear-gradient(-45deg, #00C742, #00B36C, #0082D6, #007DE3, #00C742)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">6.</span>
              <h3 className="text-2xl md:text-3xl font-bold">Видение</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-xl font-semibold mb-4">
                Мы создаём не просто SaaS, а:
              </p>
              
              <div>
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">🚀</span> Единую экосистему для предпринимателей:
                </h4>
                <div className="space-y-3 ml-8 text-gray-100">
                  <p>Хочешь магазин → есть</p>
                  <p>Хочешь мероприятие → добавил</p>
                  <p>Хочешь курсы → включил</p>
                  <p>Хочешь портфолио → готово</p>
                  <p>Хочешь всё сразу → работает на одном поддомене</p>
                  <p>Нужна SEO-оптимизация → делает AI</p>
                  <p>Нужна аналитика → встроена</p>
                </div>
                <p className="mt-6 text-xl font-semibold">
                  Всё в одном месте.
                </p>
                <div className="mt-4 space-y-2 text-lg">
                  <p>Без программистов.</p>
                  <p>Без сложных интеграций.</p>
                  <p>Без хаоса.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-[#00C742] text-white font-bold rounded-full text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
          >
            Присоединиться к платформе
          </Link>
        </div>
      </div>
    </section>
  )
}

