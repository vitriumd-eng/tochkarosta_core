/**
 * Platform Page - Public entry point for subscribers
 * Registration flow: tariff → module → phone → subdomain → site creation
 * This is NOT a module - it's part of core and cannot be moved/deleted
 * 
 * Design based on D:\tochkarosta_v5\frontend\app\(public)\page.tsx
 * Visual design recreated 1:1 with clean modern code for App Router
 * 
 * Правила переноса:
 * - Только UI (дизайн, верстка, Tailwind классы)
 * - Компоненты модульные в components/platform/
 * - Интерактивные компоненты имеют 'use client'
 * - Главная страница серверная (без 'use client')
 */
import { Hero } from '@/components/platform/Hero'
import { HeroMedia } from '@/components/platform/HeroMedia'
import { Stats } from '@/components/platform/Stats'
import { Features } from '@/components/platform/Features'
import { WhyChoose } from '@/components/platform/WhyChoose'
import { Pricing } from '@/components/platform/Pricing'
import { CTA } from '@/components/platform/CTA'

export default async function PlatformPage() {
  return (
    <div 
      className="min-h-screen bg-[#FFFBEA] relative platform-page"
      style={{ 
        fontFamily: "'PF BeauSans Pro', 'Montserrat', sans-serif"
      }}
    >
      <Hero />
      <HeroMedia />
      <Stats />
      <Features />
      <WhyChoose />
      <Pricing />
      <CTA />
    </div>
  )
}
