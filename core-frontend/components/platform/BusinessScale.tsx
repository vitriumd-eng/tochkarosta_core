'use client'

import { ScrollReveal } from '@/components/ScrollReveal'
import { useEffect, useRef } from 'react'

export const BusinessScale = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Установка размера canvas
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Параметры частиц
    const particleCount = 800
    const particles: Array<{
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      radius: number
    }> = []

    // Инициализация частиц на сфере
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 100
      
      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 1.5
      })
    }

    let time = 0
    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      time += 0.01

      // Обновление и отрисовка частиц
      particles.forEach((particle, i) => {
        // Морфинг: добавление волнового эффекта
        const morphFactor = Math.sin(time * 2 + i * 0.1) * 20
        const baseRadius = 100
        const currentRadius = baseRadius + morphFactor

        // Пересчет позиции на сфере с морфингом
        const theta = Math.atan2(particle.y, particle.x) + particle.vx * 0.01
        const phi = Math.acos(particle.z / currentRadius) + particle.vy * 0.01
        
        particle.x = currentRadius * Math.sin(phi) * Math.cos(theta)
        particle.y = currentRadius * Math.sin(phi) * Math.sin(theta)
        particle.z = currentRadius * Math.cos(phi)

        // Проекция 3D в 2D
        const scale = 200 / (200 + particle.z)
        const x2d = centerX + particle.x * scale
        const y2d = centerY + particle.y * scale

        // Размер частицы зависит от глубины
        const size = particle.radius * scale

        // Отрисовка частицы
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <ScrollReveal>
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Текст слева */}
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Точка.Роста — это ваш инструмент для масштабирования вашего бизнеса
              </h2>
            </div>

            {/* Морфирующая сфера справа */}
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-[50px]"
                style={{ maxWidth: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}

