'use client'

import { ScrollReveal } from '@/components/ScrollReveal'

export const Stats = () => (
  <ScrollReveal>
    <section className="advantages py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 bg-transparent relative overflow-hidden">
    <div className="container max-w-7xl mx-auto relative z-10">
      <div className="advantages__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 relative">
        {/* Stat 1 */}
        <div className="advantages__item relative border-b border-r border-gray-300 p-6 md:p-8 z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>1000+</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">магазинов</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Активные интернет-магазины созданы на нашей платформе. Мы помогаем предпринимателям запускать и развивать успешный онлайн-бизнес
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 pointer-events-none overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 24L32 16L44 24V40C44 42.2091 42.2091 44 40 44H24C21.7909 44 20 42.2091 20 40V24Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 24L32 32L44 24" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 32V48" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 28L8 32V48H56V32L48 28" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="advantages__item relative border-b border-r border-gray-300 p-6 md:p-8 md:border-r-0 lg:border-r z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>50K+</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">клиентов</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Довольных клиентов выбрали нашу платформу. Каждый клиент для нас самый важный, независимо от масштаба и бюджета
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 pointer-events-none overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="20" r="8" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 52C16 44.268 22.268 38 30 38H34C41.732 38 48 44.268 48 52" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="48" cy="20" r="6" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M56 52C56 47.5817 52.4183 44 48 44" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="20" r="6" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 52C8 47.5817 11.5817 44 16 44" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="advantages__item relative border-b border-gray-300 p-6 md:p-8 md:border-r lg:border-r-0 z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>24/7</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">поддержка</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Круглосуточная техническая поддержка всегда готова помочь. Доверьте свой бизнес профессионалам и получите надежную опору
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 pointer-events-none overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 20C16 15.5817 19.5817 12 24 12H40C44.4183 12 48 15.5817 48 20V44C48 48.4183 44.4183 52 40 52H24C19.5817 52 16 48.4183 16 44V20Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 20L32 28L44 20" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="32" cy="36" r="2" fill="#2F2F2F"/>
              <path d="M32 38V42" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="advantages__item relative border-b border-r border-gray-300 p-6 md:p-8 md:border-b-0 md:border-r-0 lg:border-b-0 lg:border-r z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>95%</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">довольных</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Процент клиентов, которые продолжают пользоваться платформой. Мы дорожим доверием наших клиентов. Ваша лояльность — предмет нашей гордости
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 pointer-events-none overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 8L38.9443 24.0557L56 31L38.9443 37.9443L32 54L25.0557 37.9443L8 31L25.0557 24.0557L32 8Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 20V28" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 34V42" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Stat 5 */}
        <div className="advantages__item relative border-b border-r border-gray-300 p-6 md:p-8 md:border-b-0 md:border-r-0 lg:border-b-0 lg:border-r z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>500K+</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">заказов</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Заказов успешно обработано через магазины на нашей платформе. Мы обеспечиваем стабильную работу и высокую конверсию продаж
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 pointer-events-none overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20L20 16L28 20V44L20 48L12 44V20Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M28 20L36 16L44 20V44L36 48L28 44V20Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 16V32" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M36 16V32" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20H28" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M28 20H44" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Stat 6 */}
        <div className="advantages__item relative border-b border-gray-300 p-6 md:p-8 md:border-b-0 md:border-r lg:border-r-0 z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>15 мин</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">запуск</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Среднее время создания и запуска магазина на платформе. Благодаря простому интерфейсу и автоматизации, вы можете начать продавать уже сегодня
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 pointer-events-none overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 8L40 16L32 24L24 16L32 8Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 24V40" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 32L24 40L16 48L8 40L16 32Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M48 32L56 40L48 48L40 40L48 32Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 40L40 48L32 56L24 48L32 40Z" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
  </ScrollReveal>
)

