/**
 * Test Page - Simple test page for debugging
 * Accessible at localhost:7000/test
 */
export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🧪 Тестовая страница
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Эта страница используется для тестирования базовой функциональности Next.js App Router.
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Проверка</h2>
          <ul className="space-y-2 text-left">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Next.js App Router работает</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Tailwind CSS подключен</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Стили применяются корректно</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            На главную
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-light transition-colors"
          >
            В дашборд
          </a>
        </div>
      </div>
    </div>
  )
}



