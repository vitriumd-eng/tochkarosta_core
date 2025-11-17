/**
 * Not Found Page for App Router
 * Replaces 404.js from Pages Router
 */
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-8">
          Запрошенная страница не существует или была перемещена.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}



