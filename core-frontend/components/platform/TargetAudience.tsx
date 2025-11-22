'use client'

export const TargetAudience = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 px-[25px] bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#1D1D1F] mb-6 tracking-tight">
            Платформа для тех,<br />
            кто <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-purple-600">делает дело</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Мы создали Точку Роста для людей, которые хотят монетизировать свое мастерство, но не хотят тратить жизнь на изучение кода и маркетинга.
          </p>
        </div>
      </section>

      {/* Target Audience Bento Grid */}
      <section className="py-12 px-[25px] bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] mb-10 text-center md:text-left">
            Для кого это решение?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
            
            {/* Card 1: Offline Point */}
            <div className="lg:col-span-2 bg-white rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 group border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 hover:border-[#7C3AED]/20">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase mb-4">
                  Офлайн бизнес
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Точки в ТЦ и Шоурумы</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  У вас есть физическая точка и постоянные клиенты, но вы боитесь выходить на маркетплейсы из-за штрафов, комиссий и потери бренда.
                </p>
                <div className="flex gap-3 text-sm font-medium text-[#1D1D1F]">
                  <span className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> Своя база клиентов
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> Без комиссий за продажу
                  </span>
                </div>
              </div>
              <div className="w-full md:w-1/3 h-48 bg-orange-50 rounded-2xl flex items-center justify-center text-6xl relative overflow-hidden">
                🏬
                <div className="absolute top-4 right-4 w-8 h-8 bg-orange-200 rounded-full opacity-50 animate-[float_6s_ease-in-out_infinite]"></div>
              </div>
            </div>

            {/* Card 2: Self-Employed */}
            <div className="bg-white rounded-[32px] p-8 flex flex-col justify-between group border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED]/20">
              <div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-white/20 transition">
                  ⏳
                </div>
                <h3 className="text-xl font-bold mb-2">Самозанятые мастера</h3>
                <p className="text-gray-500 text-sm group-hover:text-white/80">
                  У вас нет времени разбираться в конструкторах сайтов. Вам нужно «сфоткать и продать» здесь и сейчас.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 group-hover:border-white/20 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Возраст 30-50 лет</span>
                <span className="text-xl group-hover:translate-x-2 transition">→</span>
              </div>
            </div>

            {/* Card 3: Creators */}
            <div className="bg-white rounded-[32px] p-8 relative overflow-hidden border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 hover:border-[#7C3AED]/20">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-6">
                  🎨
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Хобби → Деньги</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Для тех, кто хочет превратить увлечение в системный доход. Продавайте не только товары, но и мастер-классы.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Card 4: Event & Courses */}
            <div className="lg:col-span-2 bg-white rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 hover:border-[#7C3AED]/20">
              <div className="w-full md:w-1/2 h-full min-h-[200px] bg-blue-50 rounded-2xl p-6 relative overflow-hidden border border-blue-100">
                {/* Mockup of Event Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm w-full h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                      ОНЛАЙН
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="w-full h-8 bg-[#1D1D1F] rounded-lg mt-2"></div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Организаторы и Эксперты</h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Вам нужен сайт не «навечно», а под конкретное мероприятие или запуск курса.
                </p>
                <ul className="space-y-2 text-sm text-[#1D1D1F]">
                  <li className="flex items-center gap-2">🔹 Продажа билетов</li>
                  <li className="flex items-center gap-2">🔹 Доступ к контенту после оплаты</li>
                  <li className="flex items-center gap-2">🔹 Сбор заявок в Telegram</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

