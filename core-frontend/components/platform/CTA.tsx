import Link from 'next/link'

export const CTA = () => (
  <section 
    className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden"
    style={{ 
      background: 'linear-gradient(-45deg, #00C742, #00B36C, #0082D6, #007DE3, #00C742)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }}
  >
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
    </div>
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
        Готовы начать?
      </h2>
      <h3 className="text-2xl md:text-3xl font-semibold text-white/90 mb-6">
        Присоединяйтесь к тысячам успешных магазинов
      </h3>
      <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
        Создайте свой интернет-магазин прямо сейчас и начните продавать онлайн.
      </p>
      <div className="flex flex-wrap gap-4 items-center justify-center mb-12">
        <Link
          href="/register"
          id="cta-register-btn"
          className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
        >
          Начать бесплатно
        </Link>
      </div>
      <div className="mt-12 pt-8 border-t border-white/20">
        <div className="inline-block text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div className="font-semibold text-white text-lg">Светлана Александровна</div>
          <div className="text-white/80">support@tochkarosta.ru</div>
        </div>
      </div>
    </div>
  </section>
)



