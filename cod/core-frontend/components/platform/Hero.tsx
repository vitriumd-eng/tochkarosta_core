import Link from 'next/link'

export const Hero = () => (
  <section 
    className="relative min-h-screen flex items-center justify-center overflow-visible"
    style={{ 
      background: 'linear-gradient(-45deg, #00C742, #00B36C, #0082D6, #007DE3, #00C742)',
      backgroundSize: '400% 400%',
      paddingTop: '80px',
      paddingBottom: 'clamp(100px, 15vw, 217.5px)',
      animation: 'gradient 15s ease infinite',
      zIndex: 10
    }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10 pt-20 sm:pt-24 md:pt-32 pb-20 sm:pb-24 md:pb-32">
      <div className="mb-6 animate-fade-in">
        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium text-white tracking-wide uppercase">
          Современная платформа
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-white mb-6 sm:mb-8 leading-tight tracking-tight animate-fade-in-up">
        <span className="block">Создайте свой</span>
        <span className="block">интернет-магазин</span>
        <span className="block">за считанные минуты</span>
      </h1>
      <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center mb-12 sm:mb-16 animate-fade-in-up animation-delay-200">
        <button
          id="start-registration-btn"
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white font-bold rounded-full text-sm sm:text-base md:text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transform touch-manipulation"
          style={{ color: '#00C742', minHeight: '44px', minWidth: '44px' }}
        >
          <span className="relative z-10">Начать бесплатно</span>
        </button>
        <Link
          href="/catalog"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-full text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50 active:scale-95 touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          Посмотреть примеры
        </Link>
      </div>
    </div>
  </section>
)



