'use client'

import { useEffect } from 'react'

export const ScrollHandler = () => {
  useEffect(() => {
    // Предотвращаем автоматический скролл к несуществующим якорям
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        // Небольшая задержка, чтобы DOM успел загрузиться
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (!element) {
            // Если элемент не найден, убираем hash из URL без скролла
            window.history.replaceState(null, '', window.location.pathname + window.location.search)
            // Возвращаем скролл наверх, если браузер уже проскроллил
            window.scrollTo(0, 0)
          }
        }, 100)
      } else {
        // Если нет hash, убеждаемся что страница наверху
        window.scrollTo(0, 0)
      }
    }

    // Проверяем при загрузке (с небольшой задержкой для полной загрузки DOM)
    setTimeout(() => {
      handleHashChange()
    }, 0)

    // Слушаем изменения hash
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return null
}

