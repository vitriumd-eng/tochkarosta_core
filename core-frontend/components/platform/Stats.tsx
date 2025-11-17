'use client'

export const Stats = () => (
  <section className="advantages py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-transparent relative overflow-hidden">
    <div className="container max-w-7xl mx-auto relative z-10">
      <div className="advantages__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 relative">
        {/* Stat 1 - Top-left: border-b и border-r везде */}
        <div className="advantages__item relative border-b border-r border-gray-300 p-6 md:p-8 z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>1000+</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">магазинов</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Активные интернет-магазины созданы на нашей платформе. Мы помогаем предпринимателям запускать и развивать успешный онлайн-бизнес
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-400 opacity-20 pointer-events-none overflow-hidden">
            <img src="/images/stats/advantage-1.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Stat 2 - Top-right (md), Top-middle (lg): border-b везде, border-r только на мобильных и lg */}
        <div className="advantages__item relative border-b border-r border-gray-300 p-6 md:p-8 md:border-r-0 lg:border-r z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>50K+</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">клиентов</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Довольных клиентов выбрали нашу платформу. Каждый клиент для нас самый важный, независимо от масштаба и бюджета
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-400 opacity-20 pointer-events-none overflow-hidden">
            <img src="/images/stats/advantage-2.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Stat 3 - Bottom-left (md), Top-right (lg): border-b везде, border-r только на md */}
        <div className="advantages__item relative border-b border-gray-300 p-6 md:p-8 md:border-r lg:border-r-0 z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>24/7</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">поддержка</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Круглосуточная техническая поддержка всегда готова помочь. Доверьте свой бизнес профессионалам и получите надежную опору
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-400 opacity-20 pointer-events-none overflow-hidden">
            <img src="/images/stats/advantage-3.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Stat 4 - Bottom-right (md), Bottom-left (lg): border-b только на мобильных, border-r везде кроме последней колонки */}
        <div className="advantages__item relative border-b border-r border-gray-300 p-6 md:p-8 md:border-b-0 md:border-r-0 lg:border-b-0 lg:border-r z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>95%</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">довольных</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Процент клиентов, которые продолжают пользоваться платформой. Мы дорожим доверием наших клиентов. Ваша лояльность — предмет нашей гордости
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-400 opacity-20 pointer-events-none overflow-hidden">
            <img src="/images/stats/advantage-4.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Stat 5 - Bottom-left (md), Bottom-middle (lg): border-b только на мобильных, border-r только на lg */}
        <div className="advantages__item relative border-b border-r border-gray-300 p-6 md:p-8 md:border-b-0 md:border-r-0 lg:border-b-0 lg:border-r z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>500K+</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">заказов</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Заказов успешно обработано через магазины на нашей платформе. Мы обеспечиваем стабильную работу и высокую конверсию продаж
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-400 opacity-20 pointer-events-none overflow-hidden">
            <img src="/images/stats/advantage-5.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Stat 6 - Bottom-right (md), Bottom-right (lg): border-b только на мобильных, border-r только на md */}
        <div className="advantages__item relative border-b border-gray-300 p-6 md:p-8 md:border-b-0 md:border-r lg:border-r-0 z-10">
          <div className="offset-y advantages__content flex flex-col gap-3">
            <h3 className="title title--h3 advantages__subtitle text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <b>15 мин</b> <span className="text-base sm:text-lg md:text-xl font-normal text-gray-800">запуск</span>
            </h3>
            <p className="advantages__text text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Среднее время создания и запуска магазина на платформе. Благодаря простому интерфейсу и автоматизации, вы можете начать продавать уже сегодня
            </p>
          </div>
          <div className="advantages__img-wrap absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-400 opacity-20 pointer-events-none overflow-hidden">
            <img src="/images/stats/advantage-6.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  </section>
)


