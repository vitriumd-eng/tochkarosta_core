'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export const Hero = () => {
  const [heroContent, setHeroContent] = useState<{
    subtitle?: string
    titleLines?: string[]
  }>({
    subtitle: 'Современная платформа',
    titleLines: ['Создайте свой', 'интернет-магазин', 'за считанные минуты']
  })

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/platform/content', {
          cache: 'no-store',
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.hero_banner?.content) {
            const content = data.hero_banner.content
            setHeroContent({
              subtitle: content.subtitle || 'Современная платформа',
              titleLines: content.titleLines || ['Создайте свой', 'интернет-магазин', 'за считанные минуты']
            })
          }
        }
      } catch (error) {
        console.error('Failed to load hero content:', error)
      }
    }

    loadContent()
    
    // Reload content every 5 seconds to check for updates
    const interval = setInterval(loadContent, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-visible"
      style={{ 
        background: 'linear-gradient(-45deg, #00C742, #00B36C, #0082D6, #007DE3, #00C742)',
        backgroundSize: '400% 400%',
        paddingTop: '120px',
        paddingBottom: 'clamp(100px, 15vw, 217.5px)',
        animation: 'gradient 15s ease infinite',
        zIndex: 10
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10 pt-20 sm:pt-24 md:pt-32 pb-20 sm:pb-24 md:pb-32">
        <div className="mb-6 animate-fade-in">
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium text-white tracking-wide uppercase">
            {heroContent.subtitle}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-white mb-6 sm:mb-8 leading-tight tracking-tight animate-fade-in-up">
          {heroContent.titleLines?.map((line, index) => (
            <span key={index} className="block">{line}</span>
          ))}
        </h1>
      <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center mb-12 sm:mb-16 animate-fade-in-up animation-delay-200">
        <Link
          href="/register"
          id="start-registration-btn"
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white font-bold rounded-full text-sm sm:text-base md:text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transform touch-manipulation"
          style={{ color: '#00C742', minHeight: '44px', minWidth: '44px' }}
        >
          <span className="relative z-10">Начать бесплатно</span>
        </Link>
        <Link
          href="/catalog"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-full text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50 active:scale-95 touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          Посмотреть примеры
        </Link>
      </div>
    </div>
  </section>
  )
}



