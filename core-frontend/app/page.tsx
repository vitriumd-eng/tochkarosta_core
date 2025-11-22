import type { Metadata } from 'next'
import { Header } from '@/components/platform/Header'
import { Hero } from '@/components/platform/Hero'
import { WhatIsUSD } from '@/components/platform/WhatIsUSD'
import { Features } from '@/components/platform/Features'
import { BentoGrid } from '@/components/platform/BentoGrid'
import { Possibilities } from '@/components/platform/Possibilities'
import { TargetAudience } from '@/components/platform/TargetAudience'
import dynamic from 'next/dynamic'
import { RoadMap } from '@/components/platform/Roadmap'
import { BusinessSolutions } from '@/components/platform/BusinessSolutions'
import { AboutPlatform } from '@/components/platform/AboutPlatform'
import { OurTeam } from '@/components/platform/OurTeam'
import { ContactForm } from '@/components/platform/ContactForm'
import { Footer } from '@/components/platform/Footer'
import { ScrollHandler } from '@/components/platform/ScrollHandler'

// Lazy load тяжелых компонентов
const ChatBlog = dynamic(() => import('@/components/platform/ChatBlog').then(mod => ({ default: mod.ChatBlog })), {
  loading: () => <div className="py-20 bg-white"><div className="text-center">Загрузка...</div></div>
})

const Reviews = dynamic(() => import('@/components/platform/Reviews').then(mod => ({ default: mod.Reviews })), {
  loading: () => <div className="py-20 bg-[#FAFAFA]"><div className="text-center">Загрузка...</div></div>
})

export const metadata: Metadata = {
  title: 'Точка.Роста - Платформа для цифрового бизнеса',
  description: 'Запустите свой бизнес за 60 секунд без программирования. Готовые модули для интернет-магазинов, портфолио, мероприятий и других цифровых бизнесов.',
  keywords: ['цифровой бизнес', 'интернет-магазин', 'платформа', 'бизнес за 60 секунд', 'готовые модули', 'Точка.Роста'],
  openGraph: {
    title: 'Точка.Роста - Платформа для цифрового бизнеса',
    description: 'Запустите свой бизнес за 60 секунд без программирования',
    type: 'website',
    siteName: 'Точка.Роста',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Точка.Роста - Платформа для цифрового бизнеса',
    description: 'Запустите свой бизнес за 60 секунд без программирования',
  },
}

export default async function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100">
      <ScrollHandler />
      <Header />
      <Hero />
      <WhatIsUSD />
      <Features />
      <TargetAudience />
      <Possibilities />
      <ChatBlog />
      <BusinessSolutions />
      <RoadMap />
      <AboutPlatform />
      <OurTeam />
      <Reviews />
      <ContactForm />
      <BentoGrid />
      <Footer />
    </div>
  )
}
