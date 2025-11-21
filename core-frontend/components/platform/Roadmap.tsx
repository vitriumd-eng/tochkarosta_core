'use client'

const features = [
  {
    title: 'Экономия времени и денег',
    description: 'Не нужны программисты, маркетологи и десятки сервисов.'
  },
  {
    title: 'Партнёр в продажах',
    description: 'Помогает твоему делу приносить доход каждый день, без суеты.'
  },
  {
    title: 'Работает 24/7',
    description: 'Покупки, записи и заявки приходят даже когда ты занят или отдыхаешь.'
  },
  {
    title: 'Маркетинговая команда внутри',
    description: 'SEO, дизайн, продвижение и удобные продажи уже встроены — ничего настраивать не нужно.'
  }
]

export const Roadmap = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ paddingLeft: '50px', paddingRight: '50px', backgroundColor: '#FFFBEA' }}>
      <div className="w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Почему Точка Роста
          </h2>
          <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, #00C742, #0082D6)' }}></div>
        </div>

        <div className="relative">
          {/* Horizontal timeline line */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #00C742, #00B36C, #0082D6, #007DE3)' }}></div>
          
          {/* Grid with points and text aligned */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {features.map((feature, i) => {
              const colors = ['#22c55e', '#00C742', '#00B36C', '#0082D6']
              const isPulsing = i === 1
              
              return (
                <div key={i} className="relative flex flex-col items-center">
                  {/* Point on timeline - centered above text */}
                  <div 
                    className={`absolute top-0 left-1/2 w-4 h-4 rounded-full border-4 border-[#FFFBEA] shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10 ${isPulsing ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: colors[i] }}
                  ></div>
                  
                  {/* Text content below - centered with point */}
                  <div className="w-full text-center mt-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
