import { Header } from '@/components/platform/Header'
import { Footer } from '@/components/platform/Footer'
import { ModulesShowcase } from '@/components/platform/ModulesShowcase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Модули платформы | Точка Роста',
  description: 'Выберите модули для вашего бизнеса: интернет-магазин, мероприятия, онлайн-курсы, портфолио и многое другое',
}

export default function ModulesPage() {
  return (
    <div 
      className="min-h-screen bg-[#FFFBEA] relative"
      style={{ 
        fontFamily: "'PF BeauSans Pro', 'Montserrat', sans-serif"
      }}
    >
      <Header />
      <ModulesShowcase />
      <Footer />
    </div>
  )
}

