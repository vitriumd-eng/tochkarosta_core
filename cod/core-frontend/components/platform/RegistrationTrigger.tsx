'use client'

import { useState, useEffect } from 'react'
import { RegistrationModal } from './RegistrationModal'

type Tariff = 'start' | 'growth' | 'premium'

export const RegistrationTrigger = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [initialTariff, setInitialTariff] = useState<Tariff | null>(null)

  // Обработчик клика для кнопок регистрации
  useEffect(() => {
    const handleRegistrationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      
      // Проверяем клик по кнопке с data-tariff
      const tariffButton = target.closest('button[data-tariff]') as HTMLButtonElement | null
      if (tariffButton) {
        const tariff = tariffButton.getAttribute('data-tariff') as Tariff
        if (tariff && ['start', 'growth', 'premium'].includes(tariff)) {
          e.preventDefault()
          e.stopPropagation()
          setInitialTariff(tariff)
          setIsOpen(true)
          return
        }
      }
      
      // Проверяем клик по другим кнопкам регистрации
      const registrationBtn = target.closest('#start-registration-btn') || target.closest('#cta-register-btn')
      if (
        target.id === 'start-registration-btn' ||
        target.id === 'cta-register-btn' ||
        registrationBtn
      ) {
        e.preventDefault()
        e.stopPropagation()
        setInitialTariff(null)
        setIsOpen(true)
        return
      }
    }

    document.addEventListener('click', handleRegistrationClick, false)
    return () => {
      document.removeEventListener('click', handleRegistrationClick, false)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setInitialTariff(null)
  }

  return (
    <>
      <RegistrationModal 
        isOpen={isOpen} 
        onClose={handleClose}
        initialTariff={initialTariff}
      />
    </>
  )
}
