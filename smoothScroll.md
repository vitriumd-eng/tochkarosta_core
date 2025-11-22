# Кастомный Smooth Scroll: Полный Гайд

Стандартный метод `element.scrollIntoView({ behavior: 'smooth' })` удобен, но имеет один недостаток: вы не можете контролировать скорость. Браузер сам решает, за сколько миллисекунд прокрутить страницу, основываясь на расстоянии.

Если вам нужно, чтобы скролл длился ровно 3 секунды (для кинематографичного эффекта) или 0.2 секунды (для мгновенной реакции), вам нужно написать свою функцию анимации.

## 1. Математика: Easing-функция

Чтобы анимация выглядела естественно, она не должна быть линейной (одинаковая скорость всё время). Она должна:

- Медленно разгоняться.
- Быстро ехать в середине.
- Медленно тормозить в конце.

Для этого используется математическая формула Ease-In-Out Quad.

```typescript
// t = current time (текущее время от начала)
// b = start value (начальная позиция скролла)
// c = change in value (дистанция: конечная - начальная)
// d = duration (общая длительность, которую мы задали)

const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}
```

## 2. Реализация на Vanilla JS (Чистый JavaScript)

Этот код можно скопировать и использовать на любом сайте без библиотек.

```typescript
/**
 * Плавный скролл к элементу с заданной длительностью.
 * @param {HTMLElement} element - Элемент, к которому скроллим.
 * @param {number} duration - Длительность в миллисекундах (например, 3000).
 * @param {HTMLElement | Window} container - Контейнер, который скроллится (обычно window).
 */
function smoothScrollTo(
  element: HTMLElement,
  duration: number = 3000,
  container: Window | HTMLElement = window
): void {
  if (typeof window === 'undefined') return

  // 1. Определяем начальную точку
  const startPos = container === window 
    ? window.scrollY 
    : (container as HTMLElement).scrollTop

  // 2. Определяем конечную точку (учитываем отступы, чтобы элемент был по центру)
  const rect = element.getBoundingClientRect()
  const containerHeight = container === window 
    ? window.innerHeight 
    : (container as HTMLElement).clientHeight
  
  const targetPos = rect.top + startPos - containerHeight / 2 + element.clientHeight / 2

  // 3. Вычисляем дистанцию
  const distance = targetPos - startPos

  // Если дистанция очень маленькая, не скроллим
  if (Math.abs(distance) < 1) return

  // 4. startTime будет установлен в первом кадре анимации
  let startTime: number | null = null

  // Easing функция (ускорение-торможение)
  const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }

  // 5. Функция анимации (вызывается каждый кадр)
  const animation = (currentTime: number) => {
    // Устанавливаем startTime только в первом кадре
    if (startTime === null) {
      startTime = currentTime
    }

    const timeElapsed = currentTime - startTime

    // Вычисляем новую позицию скролла с помощью easing-функции
    const run = easeInOutQuad(timeElapsed, startPos, distance, duration)

    // Двигаем скролл
    if (container === window) {
      window.scrollTo(0, run)
    } else {
      (container as HTMLElement).scrollTop = run
    }

    // Если время не вышло, запрашиваем следующий кадр
    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    } else {
      // Убеждаемся, что в конце мы точно в целевой точке (исправляем погрешности дробей)
      const finalPos = startPos + distance
      if (container === window) {
        window.scrollTo(0, finalPos)
      } else {
        (container as HTMLElement).scrollTop = finalPos
      }
    }
  }

  // Запуск анимации
  requestAnimationFrame(animation)
}
```

## 3. Реализация для React

В React мы используем useRef вместо прямых селекторов DOM.

```typescript
import { useRef } from 'react'

// targetRef: ref элемента, к которому едем
// duration: время в мс
const customDurationScroll = (
  targetRef: React.RefObject<HTMLElement>,
  duration: number = 3000,
  containerRef?: React.RefObject<HTMLElement>
) => {
  const target = targetRef.current
  const container = containerRef?.current || window

  // Защита от null (если элементы еще не прогрузились)
  if (!target) return

  // 1. Точка старта
  const startPos = container === window
    ? window.scrollY
    : (container as HTMLElement).scrollTop

  // 2. Вычисление позиции цели (чтобы она встала по центру контейнера)
  const rect = target.getBoundingClientRect()
  const containerHeight = container === window
    ? window.innerHeight
    : (container as HTMLElement).clientHeight

  const targetPos = rect.top + startPos - containerHeight / 2 + target.clientHeight / 2

  // 3. Дистанция пути
  const distance = targetPos - startPos

  if (Math.abs(distance) < 1) return

  let startTime: number | null = null

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime

    // Математика плавности
    const ease = (t: number, b: number, c: number, d: number): number => {
      t /= d / 2
      if (t < 1) return c / 2 * t * t + b
      t--
      return -c / 2 * (t * (t - 2) - 1) + b
    }

    // Получаем новую координату Y
    const nextScrollTop = ease(timeElapsed, startPos, distance, duration)

    // Применяем
    if (container === window) {
      window.scrollTo(0, nextScrollTop)
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop
    }

    // Если время меньше заданного, продолжаем цикл
    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    } else {
      // Финиш: жестко ставим конечную точку, чтобы не было микро-сдвигов
      const finalPos = startPos + distance
      if (container === window) {
        window.scrollTo(0, finalPos)
      } else {
        (container as HTMLElement).scrollTop = finalPos
      }
    }
  }

  requestAnimationFrame(animation)
}
```

## Как это работает пошагово

1. **requestAnimationFrame** — сообщает браузеру, что мы хотим выполнить анимацию перед следующей перерисовкой экрана (обычно 60 раз в секунду).

2. Мы запоминаем `startTime` в первом кадре анимации.

3. В каждом кадре вычисляем `timeElapsed` (прошло времени).

4. Подставляем время в формулу `ease`. Она возвращает нам точное число пикселей, где должен находиться скролл в данный момент времени.

5. Присваиваем это значение `container.scrollTop` или `window.scrollTo()`.

## Использование

```typescript
// Медленно (3 секунды)
const element = document.getElementById('my-section')
smoothScrollTo(element, 3000)

// Быстро (0.5 секунды)
smoothScrollTo(element, 500)

// В React
const sectionRef = useRef<HTMLElement>(null)
customDurationScroll(sectionRef, 3000)
```

## Параметры

- **element** / **targetRef**: Элемент, к которому нужно прокрутить
- **duration**: Длительность анимации в миллисекундах (по умолчанию 3000ms = 3 секунды)
- **container** / **containerRef**: Контейнер для скролла (по умолчанию `window`)

---

## 4. Реализация в проекте (2025-01-21)

### 4.1. Утилита smoothScroll.ts

Создана общая утилита для устранения дублирования кода между компонентами `Hero.tsx` и `VideoBox.tsx`.

**Файл:** `core-frontend/utils/smoothScroll.ts`

```typescript
/**
 * Утилита для плавного автоскролла к элементу
 * Используется в Hero.tsx и VideoBox.tsx
 */

// Easing функция ease-in-out quad (из файла 2.txt)
const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

export interface SmoothScrollOptions {
  duration?: number
  onComplete?: () => void
}

/**
 * Плавный скролл к элементу с заданной длительностью
 * @param element - Элемент, к которому скроллим
 * @param options - Опции (длительность, callback при завершении)
 */
export function smoothScrollToElement(
  element: HTMLElement,
  options: SmoothScrollOptions = {}
): void {
  if (typeof window === 'undefined') return

  const { duration = 1000, onComplete } = options

  // === FIX 1: Отключаем CSS Smooth Scroll ===
  const originalScrollBehavior = document.documentElement.style.scrollBehavior
  document.documentElement.style.scrollBehavior = 'auto'

  // === FIX 2: Правильный расчет дистанции ===
  const targetRect = element.getBoundingClientRect()
  const containerRect = { top: 0, height: window.innerHeight }
  
  // Вычисляем позицию цели относительно верха контейнера
  const relativeTargetTop = targetRect.top - containerRect.top
  
  // Центрируем элемент: позиция + половина высоты элемента - половина высоты экрана
  const distance = relativeTargetTop + (element.clientHeight / 2) - (containerRect.height / 2)

  // Если скроллить некуда
  if (Math.abs(distance) < 1) {
    document.documentElement.style.scrollBehavior = originalScrollBehavior
    onComplete?.()
    return
  }

  const startPos = window.scrollY
  let startTime: number | null = null

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime

    const nextScrollTop = easeInOutQuad(timeElapsed, startPos, distance, duration)
    window.scrollTo(0, nextScrollTop)

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    } else {
      // Финиш: Убеждаемся, что мы в точной позиции
      const finalPos = startPos + distance
      window.scrollTo(0, finalPos)

      // === FIX 1 (End): Возвращаем CSS Smooth Scroll ===
      document.documentElement.style.scrollBehavior = originalScrollBehavior || ''
      
      onComplete?.()
    }
  }

  requestAnimationFrame(animation)
}
```

### 4.2. Критические исправления

#### FIX 1: Отключение CSS `scroll-behavior: smooth`

**Проблема:** CSS `scroll-behavior: smooth` конфликтует с JS-анимацией, вызывая "залипание" скролла.

**Решение:** Временно отключаем CSS перед анимацией и возвращаем после завершения:

```typescript
const originalScrollBehavior = document.documentElement.style.scrollBehavior
document.documentElement.style.scrollBehavior = 'auto'
// ... анимация ...
document.documentElement.style.scrollBehavior = originalScrollBehavior || ''
```

#### FIX 2: Правильный расчет дистанции

**Проблема:** Старая формула расчета `distance` не всегда корректно работала.

**Решение:** Используем формулу из `2.txt`:

```typescript
const relativeTargetTop = targetRect.top - containerRect.top
const distance = relativeTargetTop + (element.clientHeight / 2) - (containerRect.height / 2)
```

Это обеспечивает точное центрирование элемента.

### 4.3. Использование в Hero.tsx (скролл вверх)

**Триггер:** Когда нижняя часть Hero появляется при скролле вверх.

**Условие видимости:**
```typescript
// Нижняя часть блока в пределах 100px от низа экрана
const isBottomJustVisible = rect.bottom > windowHeight - 100 && rect.bottom < windowHeight
```

**Проверка направления:**
```typescript
// Проверяем направление скролла ДО обновления lastScrollYRef
const isScrollingUp = currentScrollY < lastScrollYRef.current
// Обновляем lastScrollYRef ПОСЛЕ всех проверок
lastScrollYRef.current = currentScrollY
```

**Полный код:**
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (isScrollingRef.current) return

      const rect = entry.boundingClientRect
      const windowHeight = window.innerHeight
      const currentScrollY = window.scrollY
      
      // Проверяем направление скролла ДО обновления lastScrollYRef
      const isScrollingUp = currentScrollY < lastScrollYRef.current
      
      // Нижняя часть в пределах 100px от низа экрана
      const isBottomJustVisible = rect.bottom > windowHeight - 100 && rect.bottom < windowHeight
      
      if (entry.isIntersecting && isBottomJustVisible && isScrollingUp) {
        const elementCenterY = rect.top + rect.height / 2
        const screenCenterY = windowHeight / 2
        const distanceFromCenter = Math.abs(elementCenterY - screenCenterY)
        
        if (distanceFromCenter > 50) {
          isScrollingRef.current = true
          smoothScrollToElement(entry.target as HTMLElement, {
            duration: 1000,
            onComplete: () => {
              setTimeout(() => {
                isScrollingRef.current = false
              }, 100)
            }
          })
        }
      }
      
      // Обновляем lastScrollYRef после всех проверок
      lastScrollYRef.current = currentScrollY
    })
  },
  { threshold: 0, rootMargin: '0px' }
)
```

### 4.4. Использование в VideoBox.tsx (скролл вниз)

**Триггер:** Когда верхняя часть VideoBox появляется при скролле вниз.

**Условие видимости:**
```typescript
// Верх блока в пределах 100px от низа экрана (только появился)
const isTopJustVisible = rect.top < windowHeight && rect.top > windowHeight - 100
```

**Полный код:**
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (isScrollingRef.current) return

      const rect = entry.boundingClientRect
      const windowHeight = window.innerHeight
      
      const isTopJustVisible = rect.top < windowHeight && rect.top > windowHeight - 100
      
      if (entry.isIntersecting && isTopJustVisible) {
        const elementCenterY = rect.top + rect.height / 2
        const screenCenterY = windowHeight / 2
        const distanceFromCenter = Math.abs(elementCenterY - screenCenterY)
        
        if (distanceFromCenter > 50) {
          isScrollingRef.current = true
          smoothScrollToElement(entry.target as HTMLElement, {
            duration: 1000,
            onComplete: () => {
              setTimeout(() => {
                isScrollingRef.current = false
              }, 100)
            }
          })
        }
      }
    })
  },
  { threshold: 0, rootMargin: '0px' }
)
```

### 4.5. Защита от множественных запусков

Используется флаг `isScrollingRef` для предотвращения одновременных анимаций:

```typescript
const isScrollingRef = useRef(false)

// В observer callback
if (isScrollingRef.current) return

// Перед запуском анимации
isScrollingRef.current = true

// После завершения
onComplete: () => {
  setTimeout(() => {
    isScrollingRef.current = false
  }, 100)
}
```

### 4.6. Отслеживание направления скролла

Для Hero требуется отслеживание направления скролла:

```typescript
const lastScrollYRef = useRef(0)

// Инициализация
lastScrollYRef.current = window.scrollY

// Обработчик скролла
const handleScroll = () => {
  lastScrollYRef.current = window.scrollY
}
window.addEventListener('scroll', handleScroll, { passive: true })

// В observer callback
const isScrollingUp = currentScrollY < lastScrollYRef.current
```

### 4.7. Итоговые параметры

- **Длительность анимации:** 1000ms (1 секунда)
- **Easing функция:** ease-in-out quad
- **Триггер для Hero:** Нижняя часть блока появляется снизу при скролле вверх
- **Триггер для VideoBox:** Верхняя часть блока появляется при скролле вниз
- **Минимальное расстояние для центрирования:** 50px от центра экрана
- **Зона срабатывания:** 100px от края экрана

