const features = [
  {
    title: 'Быстрый старт',
    description: 'Создайте полнофункциональный интернет-магазин за считанные минуты без технических знаний.',
    icon: '⚡'
  },
  {
    title: 'Гибкая настройка',
    description: 'Персонализируйте дизайн, добавьте свои товары и настройте все под свой бренд.',
    icon: '🎨'
  },
  {
    title: 'Полный контроль',
    description: 'Управляйте заказами, клиентами и контентом самостоятельно без помощи разработчиков.',
    icon: '🎯'
  }
]

export const WhyChoose = () => (
  <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
          Почему выбирают нас
        </h2>
        <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, #00C742, #0082D6)' }}></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group relative p-8 bg-gradient-to-br from-[#FFFBEA] to-white rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-primary"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to bottom right, rgba(0, 199, 66, 0.2), rgba(0, 130, 214, 0.2))' }}></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #00C742, #0082D6)' }}>
                <span className="text-3xl text-white">{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)



