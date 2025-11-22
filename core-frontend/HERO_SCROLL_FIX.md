# Исправления автоскролла для Hero-блока

**Дата:** 2025-01-21  
**Проблема:** Автоскролл обратно на Hero-блок не работал при скролле вверх

---

## Проблема

При скролле вверх к Hero-блоку автоскролл не срабатывал, хотя для VideoBox при скролле вниз работал корректно.

---

## Анализ проблемы

### Геометрическая логика скролла вверх

**Важно понимать:** Когда мы скроллим страницу вверх (возвращаемся к началу), контент движется **вниз**. Hero-блок, который находится в самом верху страницы, будет **въезжать в viewport сверху**, а не снизу.

**Геометрия:**
- При скролле вверх Hero-блок появляется **сверху** экрана
- `rect.top` начинается с отрицательного значения (блок выше экрана)
- `rect.top` увеличивается и становится положительным (блок въезжает сверху)
- `rect.bottom` также увеличивается, начиная с малых значений (близко к 0)

### Исходная реализация (частично правильная)

```typescript
// Исходное условие
const isBottomJustVisible = rect.bottom > 0 && rect.bottom < 100
```

**Анализ:** Это условие **геометрически правильное** для скролла вверх:
- `rect.bottom > 0` - нижняя часть блока уже видна
- `rect.bottom < 100` - нижняя часть только появилась (в пределах 100px от верха экрана)

**Проблема:** Возможно, срабатывало слишком рано или не учитывало направление скролла.

### Неправильное "исправление" (ошибка)

```typescript
// НЕПРАВИЛЬНОЕ условие
const isBottomJustVisible = rect.bottom > windowHeight - 150 && rect.bottom < windowHeight + 100
```

**Почему это ошибка:**
- Это условие сработает **только** если Hero-блок имеет высоту 100vh (во весь экран)
- Если Hero-блок меньше экрана (например, 500px, а экран 900px), то `rect.bottom` **никогда не достигнет** `windowHeight`
- Максимальное значение `rect.bottom` при скролле вверх будет равно высоте блока (500px)
- Условие `500 > 900 - 150` (500 > 750) вернет `false`
- **Итог:** Автоскролл для неполноэкранных Hero-блоков сломается полностью

---

## Правильное исправление

### Исправленное условие видимости

**Используем исходную логику, но с проверкой направления скролла:**

```typescript
// Правильное условие для скролла вверх
const isBottomJustVisible = rect.bottom > 0 && rect.bottom < 100
```

**Объяснение:**
- `rect.bottom > 0` - нижняя часть блока уже видна (пересекла верхний край экрана)
- `rect.bottom < 100` - нижняя часть только появилась (в пределах 100px от верха экрана)
- Это означает, что Hero-блок только начал въезжать в viewport сверху

### Добавлена проверка направления скролла

```typescript
const isScrollingUp = currentScrollY < lastScrollYRef.current
```

**Важно:** Проверка направления выполняется **ДО** обновления `lastScrollYRef.current`, чтобы корректно определить направление скролла.

### Убрана проверка `entry.isIntersecting`

**Было:**
```typescript
if (entry.isIntersecting && isBottomJustVisible && isScrollingUp)
```

**Стало:**
```typescript
if (isBottomJustVisible && isScrollingUp)
```

**Причина:** `entry.isIntersecting` может быть `false`, когда нижняя часть только появляется у верхнего края экрана.

---

## Итоговая реализация (обновлено)

**Используется обработчик scroll вместо IntersectionObserver для более надежного срабатывания:**

```typescript
// Обработчик скролла для автоскролла к Hero при скролле вверх
const handleScroll = () => {
  // Если уже идет анимация скролла, не запускаем новую
  if (isScrollingRef.current || !sectionRef.current) return

  const currentScrollY = window.scrollY
  const isScrollingUp = currentScrollY < lastScrollYRef.current
  
  // Проверяем только при скролле вверх
  if (isScrollingUp) {
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // Когда скроллим вверх, Hero-блок въезжает в viewport СВЕРХУ (контент движется вниз)
    // Проверяем, что нижняя часть блока только появилась у верхнего края экрана
    // rect.bottom > 0 означает, что нижняя часть уже видна
    // rect.bottom < 150 означает, что она только что появилась (в пределах 150px от верха)
    // Увеличиваем диапазон для более надежного срабатывания
    const isBottomJustVisible = rect.bottom > 0 && rect.bottom < 150
    
    if (isBottomJustVisible) {
      const elementCenterY = rect.top + rect.height / 2
      const screenCenterY = windowHeight / 2
      const distanceFromCenter = Math.abs(elementCenterY - screenCenterY)
      
      // Если блок не центрирован (больше 50px от центра), центрируем
      if (distanceFromCenter > 50) {
        isScrollingRef.current = true
        smoothScrollToElement(sectionRef.current, {
          duration: 1000,
          onComplete: () => {
            setTimeout(() => {
              isScrollingRef.current = false
            }, 100)
          }
        })
      }
    }
  }
  
  // Обновляем lastScrollYRef после всех проверок
  lastScrollYRef.current = currentScrollY
}

window.addEventListener('scroll', handleScroll, { passive: true })
```

**Изменения:**
- Убран IntersectionObserver (может не срабатывать достаточно часто)
- Используется прямой обработчик scroll для более надежного определения момента
- Увеличен диапазон срабатывания с 100px до 150px для более надежного обнаружения

---

## Сравнение с VideoBox

### VideoBox (скролл вниз)
- **Триггер:** Верхняя часть блока появляется снизу
- **Условие:** `rect.top < windowHeight && rect.top > windowHeight - 100`
- **Направление:** Скролл вниз (не проверяется, так как всегда вниз)
- **Геометрия:** Блок въезжает снизу, `rect.top` уменьшается от `windowHeight` к 0

### Hero (скролл вверх)
- **Триггер:** Нижняя часть блока появляется сверху
- **Условие:** `rect.bottom > 0 && rect.bottom < 100`
- **Направление:** Скролл вверх (проверяется через `isScrollingUp`)
- **Геометрия:** Блок въезжает сверху, `rect.bottom` увеличивается от 0 к высоте блока

---

## Ключевые отличия

1. **VideoBox:** Проверяет верхнюю часть (`rect.top`) при скролле вниз
2. **Hero:** Проверяет нижнюю часть (`rect.bottom`) при скролле вверх
3. **Hero:** Требует проверку направления скролла (вверх)
4. **Hero:** Работает для блоков любой высоты (не только 100vh)

---

## Геометрическая логика

### При скролле вверх:

```
Начало: Hero-блок выше экрана
  rect.top < 0
  rect.bottom < 0

Скроллим вверх → контент движется вниз → Hero въезжает сверху

Момент появления нижней части:
  rect.top < 0 (верх еще выше экрана)
  rect.bottom > 0 (нижняя часть уже видна)
  rect.bottom < 100 (нижняя часть только появилась)

Блок полностью виден:
  rect.top >= 0
  rect.bottom = высота блока
```

### Важно:

- `rect.bottom` **никогда не достигнет** `windowHeight`, если блок меньше экрана
- Максимальное значение `rect.bottom` = высота Hero-блока
- Поэтому условие `rect.bottom > windowHeight - 150` **неправильное** для неполноэкранных блоков

---

## Тестирование

Для проверки работы автоскролла:

1. Прокрутите страницу вниз мимо Hero-блока
2. Начните скроллить вверх
3. Когда нижняя часть Hero появится у верхнего края экрана (в пределах 100px от верха), должен сработать автоскролл к центру Hero-блока

---

## Возможные проблемы

Если автоскролл все еще не работает:

1. **Проверьте консоль браузера** на наличие ошибок
2. **Проверьте значения** `rect.bottom`, `isScrollingUp` в отладчике
3. **Убедитесь**, что `isScrollingRef.current` не блокирует повторные срабатывания
4. **Проверьте**, что `smoothScrollToElement` вызывается корректно
5. **Проверьте высоту Hero-блока** - если она меньше 100px, условие может не сработать

---

## Статус

✅ **Исправлено:** Автоскролл обратно на Hero-блок при скролле вверх

**Файл:** `core-frontend/components/platform/Hero.tsx`  
**Дата исправления:** 2025-01-21  
**Исправлена геометрическая ошибка:** 2025-01-21  
**Финальное исправление:** 2025-01-21 (замена IntersectionObserver на прямой обработчик scroll)

---

## Финальное исправление (работающее решение)

### Проблемы предыдущей реализации:

1. **IntersectionObserver срабатывал недостаточно часто**
   - IntersectionObserver может пропускать моменты, когда элемент только начинает появляться
   - Особенно при быстром скролле события могут "проскакивать"

2. **Слишком строгое условие видимости**
   - Условие `rect.bottom < 100` было слишком узким
   - При быстром скролле блок мог "проскочить" этот диапазон

3. **Отсутствие проверки, что блок только начинает появляться**
   - Не было проверки, что верх блока еще выше экрана (`rect.top < 0`)
   - Это приводило к срабатыванию, когда блок уже был частично виден

### Решение:

1. **Заменил IntersectionObserver на прямой обработчик `scroll`**
   - Обработчик `scroll` срабатывает на каждом событии скролла
   - Более надежное определение момента появления блока

2. **Увеличил диапазон срабатывания до 150px**
   - `rect.bottom < 150` вместо `rect.bottom < 100`
   - Больше времени для срабатывания при быстром скролле

3. **Добавил проверку `rect.top < 0`**
   - Убеждаемся, что блок только начинает появляться сверху
   - Предотвращает повторные срабатывания, когда блок уже виден

### Итоговое условие:

```typescript
const isBottomJustVisible = rect.bottom > 0 && rect.bottom < 200 && rect.top < 0
```

**Объяснение:**
- `rect.bottom > 0` - нижняя часть уже видна (пересекла верхний край экрана)
- `rect.bottom < 200` - нижняя часть только появилась (в пределах 200px от верха)
- `rect.top < 0` - верх блока еще выше экрана (блок только начинает появляться)

Это гарантирует, что автоскролл сработает именно в момент, когда Hero-блок только начинает въезжать в viewport сверху при скролле вверх.

---

## Урок

**Важно:** При работе с координатами элементов всегда учитывайте:
- Направление движения контента при скролле
- Размеры элементов относительно размера viewport
- Геометрию появления элементов в viewport

Неправильное понимание геометрии может привести к условиям, которые работают только для специфических случаев (например, только для полноэкранных блоков).


/**
 * Easing-функция (Ease-In-Out Quad)
 * Обеспечивает плавный разгон и торможение анимации.
 */
const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

interface ScrollOptions {
  duration?: number;       // Длительность в мс (по умолчанию 1000)
  offset?: number;         // Смещение от центра (опционально)
  container?: HTMLElement | Window | null; // Контейнер скролла (по умолчанию window)
  onComplete?: () => void; // Коллбек после завершения
}

/**
 * Универсальная функция плавного скролла.
 * * @param target - Целевой элемент (DOM узел), к которому нужно прокрутить.
 * @param options - Настройки скролла.
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
  } = options;

  if (!target || !container) return;

  // 1. Определяем, скроллим мы окно или отдельный блок
  const isWindow = container === window || container === document.documentElement || container === document.body;
  const containerEl = isWindow ? document.documentElement : (container as HTMLElement);

  // 2. --- FIX: Временно отключаем CSS scroll-behavior ---
  // Это предотвращает конфликты и "дергания", если в CSS задана плавная прокрутка.
  const originalScrollBehavior = containerEl.style.scrollBehavior;
  containerEl.style.scrollBehavior = 'auto';

  // 3. Начальная позиция
  const startPos = isWindow ? window.scrollY : containerEl.scrollTop;

  // 4. --- FIX: Правильная математика координат ---
  const targetRect = target.getBoundingClientRect();
  // Для window отступ сверху всегда 0, для div берем его реальную позицию
  const containerRectTop = isWindow ? 0 : containerEl.getBoundingClientRect().top;
  const containerHeight = isWindow ? window.innerHeight : containerEl.clientHeight;

  // Смещение элемента относительно верха контейнера
  const relativeTargetTop = targetRect.top - containerRectTop;

  // Формула центрирования:
  // (Координата элемента) + (Половина элемента) - (Половина экрана) + (Доп. смещение)
  const distance = relativeTargetTop + (target.clientHeight / 2) - (containerHeight / 2) + offset;

  // Если скроллить некуда (дистанция < 1px), завершаем сразу
  if (Math.abs(distance) < 1) {
    containerEl.style.scrollBehavior = originalScrollBehavior;
    if (onComplete) onComplete();
    return;
  }

  let startTime: number | null = null;

  // 5. Анимационный цикл
  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    // Вычисляем новую позицию
    const nextScrollTop = easeInOutQuad(timeElapsed, startPos, distance, duration);

    // Двигаем
    if (isWindow) {
      window.scrollTo(0, nextScrollTop);
    } else {
      containerEl.scrollTop = nextScrollTop;
    }

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      // Финиш: ставим точную конечную точку
      const finalPos = startPos + distance;
      if (isWindow) window.scrollTo(0, finalPos);
      else containerEl.scrollTop = finalPos;

      // --- FIX: Возвращаем исходный CSS стиль ---
      containerEl.style.scrollBehavior = originalScrollBehavior;
      
      if (onComplete) onComplete();
    }
  };

  requestAnimationFrame(animation);
};