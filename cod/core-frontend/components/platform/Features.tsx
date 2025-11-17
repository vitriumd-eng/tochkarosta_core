'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const featureCards = [
  { id: 1, title: 'Управление товарами', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' },
  { id: 2, title: 'Аналитика продаж', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400' },
  { id: 3, title: 'Маркетинг инструменты', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
  { id: 4, title: 'Интеграции', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400' },
  { id: 5, title: 'Мобильное приложение', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400' },
  { id: 6, title: 'Безопасность', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400' },
  { id: 7, title: 'Поддержка 24/7', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400' },
  { id: 8, title: 'Автоматизация', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400' },
  { id: 9, title: 'Отчетность', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400' },
  { id: 10, title: 'Масштабирование', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400' }
]

export const Features = () => (
  <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-[#FFFBEA]">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
          Возможности платформы
        </h2>
        <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, #00C742, #0082D6)' }}></div>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="pb-12"
      >
        {featureCards.map((card) => (
          <SwiperSlide key={card.id}>
            <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-xl">{card.title}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
)

