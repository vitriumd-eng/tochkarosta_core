import Link from 'next/link'

const TARIFFS = [
  { 
    id: 'start',
    name: 'Старт', 
    price: '0', 
    period: 'месяц',
    description: 'Идеально для начинающих',
    features: [
      'До 50 товаров',
      'Базовые шаблоны',
      'Email поддержка',
      'Базовая аналитика',
      'Мобильная версия'
    ],
    popular: false
  },
  { 
    id: 'growth',
    name: 'Профессионал', 
    price: '2990', 
    period: 'месяц',
    description: 'Для растущего бизнеса',
    features: [
      'Неограниченное количество товаров',
      'Все шаблоны',
      'Приоритетная поддержка',
      'Расширенная аналитика',
      'Интеграции с платежами',
      'Скидочные программы',
      'Email маркетинг'
    ],
    popular: true
  },
  { 
    id: 'premium',
    name: 'Бизнес', 
    price: '7990', 
    period: 'месяц',
    description: 'Для крупных компаний',
    features: [
      'Все из Профессионал',
      'Персональный менеджер',
      'Кастомные интеграции',
      'API доступ',
      'Мультивалютность',
      'Белый лейбл',
      'Обучение команды'
    ],
    popular: false
  },
]

export const Pricing = () => (
  <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
          Тарифы
        </h2>
        <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, #00C742, #0082D6)' }}></div>
        <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
          Выберите план, который подходит именно вам
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TARIFFS.map((plan, i) => (
          <div
            key={i}
            className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
              plan.popular
                ? 'text-white scale-105'
                : 'bg-[#FFFBEA] border-gray-200 text-gray-900'
            }`}
            style={plan.popular ? { background: 'linear-gradient(to bottom right, #00C742, #0082D6)', borderColor: '#00C742' } : {}}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 text-gray-900 text-sm font-bold rounded-full bg-white">
                Популярный
              </div>
            )}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-4 ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className={`ml-2 text-lg ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                  ₽ / {plan.period}
                </span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start">
                  <span className="mr-3" style={{ color: plan.popular ? '#fff' : '#00C742' }}>
                    ✓
                  </span>
                  <span className={plan.popular ? 'text-white' : 'text-gray-700'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="http://localhost:7001/register"
              className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-300 ${
                plan.popular
                  ? 'bg-white hover:bg-gray-100'
                  : 'text-white'
              }`}
              style={plan.popular ? { color: '#00C742' } : { backgroundColor: '#00C742' }}
            >
              Выбрать план
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
)

