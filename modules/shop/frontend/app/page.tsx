'use client'

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold">Интернет-магазин</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow p-6">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Товар {item}</h3>
              <p className="text-gray-600 mb-4">Описание товара</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">1000 ₽</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}







