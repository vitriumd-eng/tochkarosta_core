/**
 * Утилита для плавного автоскролла к элементу
 * Используется в Hero.tsx и VideoBox.tsx
 * Реализация на основе 2.txt - чистый JavaScript
 */

/**
 * Easing-функция (Ease-In-Out Quad)
 * Обеспечивает плавный разгон и торможение анимации.
 * @param {number} t - текущее время от начала
 * @param {number} b - начальная позиция скролла
 * @param {number} c - изменение позиции (дистанция)
 * @param {number} d - общая длительность
 * @returns {number} новая позиция скролла
 */
const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

/**
 * Опции для функции плавного скролла
 */
interface ScrollOptions {
  duration?: number       // Длительность в мс (по умолчанию 1000)
  offset?: number         // Смещение от центра (опционально)
  container?: HTMLElement | Window | null // Контейнер скролла (по умолчанию window)
  onComplete?: () => void // Коллбек после завершения
}

/**
 * Универсальная функция плавного скролла.
 * @param {HTMLElement|null} target - Целевой элемент (DOM узел), к которому нужно прокрутить.
 * @param {ScrollOptions} [options={}] - Настройки скролла.
 */
export const smoothScrollTo = (
  target: HTMLElement | null,
  options: ScrollOptions = {}
) => {
  // Настройки по умолчанию
  const {
    duration = 1000,
    offset = 0,
    container = typeof window !== 'undefined' ? window : null,
    onComplete
  } = options

  if (!target || !container) return

  // 1. Определяем, скроллим мы окно или отдельный блок
  const isWindow = container === window || container === document.documentElement || container === document.body
  const containerEl: HTMLElement = isWindow ? document.documentElement : (container as HTMLElement)

  // 2. --- FIX: Временно отключаем CSS scroll-behavior ---
  // Это предотвращает конфликты и "дергания", если в CSS задана плавная прокрутка.
  const originalScrollBehavior = containerEl.style.scrollBehavior
  containerEl.style.scrollBehavior = 'auto'

  // 3. Начальная позиция
  const startPos = isWindow ? window.scrollY : containerEl.scrollTop

  // 4. --- FIX: Правильная математика координат ---
  const targetRect = target.getBoundingClientRect()
  // Для window отступ сверху всегда 0, для div берем его реальную позицию
  const containerRectTop = isWindow ? 0 : containerEl.getBoundingClientRect().top
  const containerHeight = isWindow ? window.innerHeight : containerEl.clientHeight

  // Смещение элемента относительно верха контейнера
  const relativeTargetTop = targetRect.top - containerRectTop

  // Формула центрирования:
  // (Координата элемента) + (Половина элемента) - (Половина экрана) + (Доп. смещение)
  const distance = relativeTargetTop + (target.clientHeight / 2) - (containerHeight / 2) + offset

  // Если скроллить некуда (дистанция < 1px), завершаем сразу
  if (Math.abs(distance) < 1) {
    containerEl.style.scrollBehavior = originalScrollBehavior
    if (onComplete) onComplete()
    return
  }

  let startTime: number | null = null

  // 5. Анимационный цикл
  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime

    // Вычисляем новую позицию
    const nextScrollTop = easeInOutQuad(timeElapsed, startPos, distance, duration)

    // Двигаем
    if (isWindow) {
      window.scrollTo(0, nextScrollTop)
    } else {
      containerEl.scrollTop = nextScrollTop
    }

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    } else {
      // Финиш: ставим точную конечную точку
      const finalPos = startPos + distance
      if (isWindow) window.scrollTo(0, finalPos)
      else containerEl.scrollTop = finalPos

      // --- FIX: Возвращаем исходный CSS стиль ---
      containerEl.style.scrollBehavior = originalScrollBehavior || ''
      
      if (onComplete) onComplete()
    }
  }

  requestAnimationFrame(animation)
}

/**
 * Опции для функции smoothScrollToElement (совместимость с текущим кодом)
 */
export interface SmoothScrollOptions {
  duration?: number
  onComplete?: () => void
}

/**
 * Плавный скролл к элементу с заданной длительностью
 * Обертка для совместимости с текущим кодом (Hero.tsx, VideoBox.tsx)
 * @param {HTMLElement} element - Элемент, к которому скроллим
 * @param {SmoothScrollOptions} [options={}] - Опции (длительность, callback при завершении)
 */
export function smoothScrollToElement(
  element: HTMLElement,
  options: SmoothScrollOptions = {}
) {
  if (typeof window === 'undefined') return
  
  const { duration = 1000, onComplete } = options
  
  smoothScrollTo(element, {
    duration,
    onComplete,
    container: window
  })
}
