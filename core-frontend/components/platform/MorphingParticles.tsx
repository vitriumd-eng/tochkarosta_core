'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const MorphingParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const geometryRef = useRef<THREE.BufferGeometry | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timeRef = useRef<number>(0)
  const basePositionsRef = useRef<Float32Array | null>(null)

  const particleCount = 1200
  const radius = 3.5

  // Генерация базовых позиций сферы
  const generateSpherePositions = (): Float32Array => {
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * (0.8 + Math.random() * 0.2)
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }

    return positions
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Сцена
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Камера
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 8 // Отодвинуто дальше для большего размера
    cameraRef.current = camera

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Геометрия частиц
    const geometry = new THREE.BufferGeometry()
    const initialPositions = generateSpherePositions()
    basePositionsRef.current = initialPositions
    geometry.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3))
    geometryRef.current = geometry

    // Материал частиц (круглые)
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    // Темно-фиолетовый/темно-индиго цвет
    gradient.addColorStop(0, 'rgba(55, 48, 163, 1)') // Темный индиго
    gradient.addColorStop(0.5, 'rgba(55, 48, 163, 0.8)')
    gradient.addColorStop(1, 'rgba(55, 48, 163, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      size: 0.25, // Увеличено с 0.1
      map: texture,
      transparent: true,
      blending: THREE.NormalBlending, // Обычное смешивание вместо AdditiveBlending
      depthWrite: true,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    particlesRef.current = particles

    // Анимация вращения
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      // Вращение
      particles.rotation.y += 0.005
      particles.rotation.x += 0.002

      renderer.render(scene, camera)
    }

    animate()

    // Обработка изменения размера
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full max-w-[750px]"
      style={{ minHeight: '600px' }} // Увеличена высота
    />
  )
}

