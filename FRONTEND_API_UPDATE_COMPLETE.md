# Отчет: Обновление Frontend API путей

## Дата: 2025-11-16

## СТАТУС: ✅ ОБНОВЛЕНИЕ ЗАВЕРШЕНО

Все пути API во frontend обновлены на использование новых версионированных путей `/api/v1/*`.

---

## ВЫПОЛНЕННЫЕ ЗАДАЧИ

### ✅ 1. Обновлены Next.js API Routes (прокси к backend)

**Обновленные файлы:**

1. **`app/api/platform/login/route.ts`**
   - ✅ `/api/platform/login` → `/api/v1/platform/login`

2. **`app/api/platform/content/route.ts`**
   - ✅ `/api/platform/content` → `/api/v1/platform/content`

3. **`app/api/platform/content/[key]/route.ts`**
   - ✅ `/api/platform/content/${key}` → `/api/v1/platform/content/${key}`

4. **`app/api/auth/register/route.ts`**
   - ✅ `/api/auth/register` → `/api/v1/auth/register`

5. **`app/api/auth/send-code/route.ts`**
   - ✅ `/api/auth/send-code` → `/api/v1/auth/send-code`

6. **`app/api/auth/check-subdomain/[subdomain]/route.ts`**
   - ✅ `/api/auth/check-subdomain/${subdomain}` → `/api/v1/auth/check-subdomain/${subdomain}`

7. **`app/api/modules/list/route.ts`**
   - ✅ `/api/modules/list` → `/api/v1/modules/list`

8. **`app/api/modules/switch/route.ts`**
   - ✅ `/api/modules/switch` → `/api/v1/modules/switch`

9. **`app/api/modules/subscription/route.ts`**
   - ✅ `/api/modules/subscription` → `/api/v1/modules/subscription`

10. **`app/api/modules/tenant-info/route.ts`**
    - ✅ `/api/modules/tenant-info` → `/api/v1/modules/tenant-info`

---

### ✅ 2. Обновлены компоненты с прямыми вызовами к backend

**Обновленные файлы:**

1. **`app/[...slug]/page.tsx`**
   - ✅ `/api/tenants/by-subdomain/${extractedSubdomain}` → `/api/v1/tenants/by-subdomain/${extractedSubdomain}`
   - ✅ `/api/tenants/by-subdomain/${subdomain}` → `/api/v1/tenants/by-subdomain/${subdomain}`

---

## НЕ ИЗМЕНЕНЫ (правильно)

Следующие файлы используют внутренние пути Next.js API routes и **не требуют изменений**:

1. **`app/platform-dashboard/page.tsx`**
   - Использует `/api/platform/content` (внутренний Next.js route)
   - ✅ Правильно - не требует изменений

2. **`app/platform-dashboard/sections/[key]/page.tsx`**
   - Использует `/api/platform/content` и `/api/platform/content/${key}` (внутренние Next.js routes)
   - ✅ Правильно - не требует изменений

3. **`lib/api/register.ts`**
   - Использует `/api/auth/register`, `/api/auth/check-subdomain/`, `/api/auth/send-code` (внутренние Next.js routes)
   - ✅ Правильно - не требует изменений

**Примечание:** Внутренние пути Next.js API routes (`/api/*`) остаются без изменений, так как они проксируют запросы к backend через обновленные Next.js routes.

---

## СТРУКТУРА ЗАПРОСОВ

### До обновления:
```
Frontend Component
  ↓
Next.js API Route (/api/platform/login)
  ↓
Backend API (/api/platform/login) ❌
```

### После обновления:
```
Frontend Component
  ↓
Next.js API Route (/api/platform/login) - без изменений
  ↓
Backend API (/api/v1/platform/login) ✅
```

---

## ПРОВЕРКА

### ✅ Все пути к backend обновлены:
- Platform API: `/api/v1/platform/*`
- Auth API: `/api/v1/auth/*`
- Tenants API: `/api/v1/tenants/*`
- Modules API: `/api/v1/modules/*`

### ✅ Внутренние Next.js routes остались без изменений:
- Frontend компоненты используют `/api/*` (внутренние пути)
- Next.js API routes проксируют к `/api/v1/*` (backend)

---

## СОВМЕСТИМОСТЬ

- ✅ Frontend компоненты работают как прежде (используют внутренние Next.js routes)
- ✅ Next.js API routes обновлены для проксирования к новым backend путям
- ✅ Прямые вызовы к backend обновлены на `/api/v1/*`

---

## СЛЕДУЮЩИЕ ШАГИ

1. ✅ Протестировать все API endpoints
2. ✅ Проверить работу регистрации
3. ✅ Проверить работу platform dashboard
4. ✅ Проверить работу модулей

---

**Отчет создан:** 2025-11-16  
**Статус:** ✅ Обновление завершено  
**Все пути API обновлены на `/api/v1/*`**





