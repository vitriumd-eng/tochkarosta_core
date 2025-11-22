'use client'

import Image from 'next/image'

interface TeamMember {
  name: string
  role: string
  description: string
  image: string
  alt: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Максим Трушков',
    role: 'Founder and Project Architect',
    description: 'Основатель и архитектор проекта Точка.Роста',
    image: '/max.webp',
    alt: 'Максим Трушков'
  },
  {
    name: 'Светлана Александровна',
    role: 'Менеджер по связям',
    description: 'Управление связями и коммуникациями',
    image: '/sveta.webp',
    alt: 'Светлана Александровна'
  },
  {
    name: 'Алексей Петров',
    role: 'Lead Developer',
    description: 'Разработка и архитектура технических решений',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    alt: 'Алексей Петров'
  },
  {
    name: 'Мария Волкова',
    role: 'UX/UI Designer',
    description: 'Дизайн интерфейсов и пользовательский опыт',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    alt: 'Мария Волкова'
  },
  {
    name: 'Дмитрий Соколов',
    role: 'Product Manager',
    description: 'Управление продуктом и развитие платформы',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    alt: 'Дмитрий Соколов'
  },
  {
    name: 'Елена Морозова',
    role: 'Marketing Director',
    description: 'Маркетинговая стратегия и продвижение',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    alt: 'Елена Морозова'
  },
  {
    name: 'Иван Козлов',
    role: 'DevOps Engineer',
    description: 'Инфраструктура и автоматизация процессов',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    alt: 'Иван Козлов'
  }
]

export const OurTeam = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="px-[25px] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1D1D1F] mb-3">
              Наша команда
            </h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Знакомьтесь с людьми, которые создают платформу Точка.Роста
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-semibold text-[#1D1D1F] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-1">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

