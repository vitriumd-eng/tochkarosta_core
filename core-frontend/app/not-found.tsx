export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">404</h2>
      <p className="text-gray-600 mb-4">Страница не найдена</p>
      <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Вернуться на главную
      </a>
    </div>
  )
}





