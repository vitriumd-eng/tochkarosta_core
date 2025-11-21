'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Переменные для центра canvas
    let centerX = canvas.offsetWidth / 2
    let centerY = canvas.offsetHeight / 2

    // Установка размера canvas
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2) // Ограничиваем DPR для производительности
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      centerX = canvas.offsetWidth / 2
      centerY = canvas.offsetHeight / 2
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Параметры частиц
    const particleCount = 1200
    const particles: Array<{
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      radius: number
      baseTheta: number
      basePhi: number
    }> = []

    // Инициализация частиц на сфере
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const baseRadius = 360
      
      particles.push({
        x: baseRadius * Math.sin(phi) * Math.cos(theta),
        y: baseRadius * Math.sin(phi) * Math.sin(theta),
        z: baseRadius * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        radius: 0.5 + Math.random() * 0.5,
        baseTheta: theta,
        basePhi: phi
      })
    }

    let time = 0
    let animationFrameId: number | null = null

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      time += 0.01

      // Медленная пульсация сферы
      const baseRadius = 180
      const pulseAmplitude = 15
      const pulseSpeed = 0.3
      const currentRadius = baseRadius + Math.sin(time * pulseSpeed) * pulseAmplitude
      
      // Медленное вращение сферы вокруг осей (упрощенное - только Y и X)
      const rotationY = time * 0.03
      const rotationX = time * 0.02
      
      // Предвычисляем синусы и косинусы для оптимизации
      const cosY = Math.cos(rotationY)
      const sinY = Math.sin(rotationY)
      const cosX = Math.cos(rotationX)
      const sinX = Math.sin(rotationX)
      
      // Обновление и отрисовка частиц
      particles.forEach((particle) => {
        // Исходные углы частицы на сфере
        const theta = particle.baseTheta
        const phi = particle.basePhi
        
        // Вычисляем позицию на поверхности сферы
        const sinPhi = Math.sin(phi)
        const cosPhi = Math.cos(phi)
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)
        
        let x = currentRadius * sinPhi * cosTheta
        let y = currentRadius * sinPhi * sinTheta
        let z = currentRadius * cosPhi
        
        // Вращение вокруг оси Y
        const tempX = x * cosY - z * sinY
        z = x * sinY + z * cosY
        x = tempX
        
        // Вращение вокруг оси X
        const tempZ = z * cosX - y * sinX
        y = z * sinX + y * cosX
        z = tempZ

        // Проекция 3D в 2D
        const scale = 300 / (300 + z)
        const x2d = centerX + x * scale
        const y2d = centerY + y * scale

        // Пропускаем частицы, которые слишком далеко или вне экрана
        if (z < -250 || Math.abs(x2d - centerX) > canvas.offsetWidth || Math.abs(y2d - centerY) > canvas.offsetHeight) {
          return
        }

        // Размер частицы зависит от глубины
        const size = particle.radius * scale

        // Отрисовка частицы
        ctx.fillStyle = '#808080'
        ctx.beginPath()
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-visible hero-gradient"
      style={{ 
        background: '#ffffff',
        zIndex: 10,
        position: 'relative'
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Текст слева */}
          <div className="text-left">
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-4">
                Точка.Роста
              </h2>
              <p className="font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black leading-tight">
                — это ваш инструмент для масштабирования вашего бизнеса
              </p>
            </div>
          </div>

          {/* Морфирующая сфера справа */}
          <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] xl:h-[800px] flex items-center justify-center overflow-visible">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ maxWidth: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

