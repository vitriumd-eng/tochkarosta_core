/**
 * Platform Page - Public entry point
 * Design based on D:\tochkarosta_core — копия\core-frontend\app\page.tsx
 * Visual design recreated 1:1 with clean modern code for App Router
 * 
 * Правила переноса:
 * - Только UI (дизайн, верстка, Tailwind классы)
 * - Компоненты модульные в components/platform/
 * - Интерактивные компоненты имеют 'use client'
 * - Главная страница серверная (без 'use client')
 */
import { Header } from '@/components/platform/Header'
import { Hero } from '@/components/platform/Hero'
import { HeroMedia } from '@/components/platform/HeroMedia'
import { FeaturesPreview } from '@/components/platform/FeaturesPreview'
import { Stats } from '@/components/platform/Stats'
import { BusinessScale } from '@/components/platform/BusinessScale'
import { StatsFeaturesBridge } from '@/components/platform/StatsFeaturesBridge'
import { Features } from '@/components/platform/Features'
import { WhyChoose } from '@/components/platform/WhyChoose'
import { Pricing } from '@/components/platform/Pricing'
import { Roadmap } from '@/components/platform/Roadmap'
import { CTA } from '@/components/platform/CTA'
import { Footer } from '@/components/platform/Footer'

export default async function PlatformPage() {
  return (
    <div 
      className="min-h-screen bg-white relative platform-page"
      style={{ 
        fontFamily: "'PF BeauSans Pro', 'Montserrat', sans-serif"
      }}
    >
      <Header />
      <Hero />
      <StatsFeaturesBridge />
      <HeroMedia />
      <FeaturesPreview />
      <Stats />
      <Roadmap />
      <Features />
      <WhyChoose />
      <Pricing />
      <Roadmap />
      <CTA />
      <Footer />
    </div>
  )
}
