export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Точка Роста</h1>
            <nav className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">Вход</a>
              <a href="/register" className="text-blue-600 hover:text-blue-800">Регистрация</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-bold mb-6">Цифровой бизнес за 60 секунд</h2>
            <p className="text-xl mb-8 text-blue-100">
              Арендуйте готовые цифровые бизнесы без необходимости нанимать программистов
            </p>
            <a
              href="/"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
            >
              Начать бесплатно
            </a>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12">Возможности</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🛍️</div>
                <h4 className="text-xl font-semibold mb-2">Интернет-магазин</h4>
                <p className="text-gray-600">Готовый магазин с корзиной, оплатой и управлением товарами</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🎫</div>
                <h4 className="text-xl font-semibold mb-2">Мероприятия</h4>
                <p className="text-gray-600">Продажа билетов на события и управление расписанием</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">📚</div>
                <h4 className="text-xl font-semibold mb-2">Онлайн-курсы</h4>
                <p className="text-gray-600">Платформа для обучения с видео, тестами и сертификатами</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold mb-8">Тарифы</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow p-8">
                <h4 className="text-2xl font-bold mb-4">Base</h4>
                <div className="text-4xl font-bold mb-4">990 ₽<span className="text-lg text-gray-500">/мес</span></div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ 1 поддомен</li>
                  <li>✓ Модуль Магазин</li>
                  <li>✓ 5 ГБ хранилища</li>
                  <li>✓ Email поддержка</li>
                </ul>
                <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Выбрать
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-600">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm inline-block mb-4">
                  Популярный
                </div>
                <h4 className="text-2xl font-bold mb-4">Growth</h4>
                <div className="text-4xl font-bold mb-4">2990 ₽<span className="text-lg text-gray-500">/мес</span></div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ 2 поддомена</li>
                  <li>✓ Магазин + Мероприятия</li>
                  <li>✓ 20 ГБ хранилища</li>
                  <li>✓ Приоритетная поддержка</li>
                </ul>
                <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Выбрать
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-8">
                <h4 className="text-2xl font-bold mb-4">Master</h4>
                <div className="text-4xl font-bold mb-4">9990 ₽<span className="text-lg text-gray-500">/мес</span></div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ 10 поддоменов</li>
                  <li>✓ Все модули</li>
                  <li>✓ 100 ГБ хранилища</li>
                  <li>✓ Телефонная поддержка</li>
                </ul>
                <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Выбрать
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Точка Роста. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}



