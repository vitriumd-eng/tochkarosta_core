'use client'

import { Star } from 'lucide-react'

interface Review {
  id: number
  name: string
  role: string
  company: string
  text: string
  rating: number
  avatar?: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Иван Петров',
    role: 'Предприниматель',
    company: 'Интернет-магазин "Стиль"',
    text: 'Платформа Точка.Роста помогла мне запустить интернет-магазин буквально за час. Никакого программирования, всё интуитивно понятно. Продажи начались уже в первый день!',
    rating: 5
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    role: 'Фотограф',
    company: 'Студия "Момент"',
    text: 'Создала портфолио на платформе за 60 секунд. Клиенты могут сразу оставлять заказы, а я управляю всем из одного места. Очень удобно!',
    rating: 5
  },
  {
    id: 3,
    name: 'Алексей Козлов',
    role: 'Организатор мероприятий',
    company: 'EventPro',
    text: 'Использую модуль для мероприятий. Продажа билетов, управление участниками, рассылки — всё автоматизировано. Экономия времени колоссальная!',
    rating: 5
  },
  {
    id: 4,
    name: 'Елена Волкова',
    role: 'Преподаватель',
    company: 'Онлайн-школа "Знания"',
    text: 'Запустила курс на платформе. Ученики видят прогресс, получают сертификаты. Всё работает как часы. Рекомендую всем!',
    rating: 5
  },
  {
    id: 5,
    name: 'Дмитрий Соколов',
    role: 'Строитель',
    company: 'СтройКомплекс',
    text: 'Модуль для строительного бизнеса — это находка! Управление проектами, сметы, клиенты — всё в одном месте. Работа стала намного эффективнее.',
    rating: 5
  },
  {
    id: 6,
    name: 'Анна Морозова',
    role: 'Дизайнер',
    company: 'Freelance',
    text: 'Портфолио на Точка.Роста выглядит профессионально. Клиенты легко находят мои работы и оставляют заказы. Очень довольна результатом!',
    rating: 5
  }
]

export const Reviews = () => {
  // Дублируем отзывы для бесконечной прокрутки
  const duplicatedReviews = [...reviews, ...reviews, ...reviews]

  return (
    <section className="py-20 bg-[#FAFAFA] overflow-hidden w-full">
      <div className="px-[50px] w-full">
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mb-4">
              Отзывы клиентов
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Что говорят предприниматели о платформе Точка.Роста
            </p>
          </div>

          {/* Бесконечная карусель */}
          <div className="relative overflow-hidden w-full" aria-label="Отзывы клиентов">
            <div className="flex animate-scroll-reviews gap-4" role="list">
              {duplicatedReviews.map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="flex-shrink-0 w-full md:w-[350px] bg-white rounded-xl p-6 shadow-lg"
                  role="listitem"
                  aria-label={`Отзыв от ${review.name}`}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    "{review.text}"
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-semibold text-[#1D1D1F] text-base mb-1">
                      {review.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {review.role}, {review.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

