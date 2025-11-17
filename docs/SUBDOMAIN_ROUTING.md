# Subdomain Routing для Модулей

## Как работает роутинг модулей по поддоменам

### Архитектура

Система позволяет открывать модули (например, магазин) на поддоменах:
- `shop.localhost:7000` - публичный сайт магазина
- `shop.example.com` - в production

### Компоненты системы

#### 1. Backend Middleware (`core-backend/app/middleware/tenant.py`)

Определяет `tenant_id` и `active_module` по поддомену:
- Извлекает поддомен из заголовка `Host`
- Запрашивает БД таблицу `tenant_domains` для получения `tenant_id`
- Получает `active_module` из таблицы `tenants`

#### 2. Backend API (`core-backend/app/api/tenants.py`)

**GET `/api/tenants/by-subdomain/{subdomain}`**
- Возвращает информацию о тенанте и активном модуле
- Включает `module_info` из `manifest.json`

#### 3. Frontend Middleware (`core-frontend/middleware.ts`)

- Извлекает поддомен из заголовка `Host`
- Сохраняет в заголовке `X-Tenant-Subdomain` для использования в серверных компонентах

#### 4. Dynamic Router (`core-frontend/app/[...slug]/page.tsx`)

- Перехватывает все маршруты для модулей
- Получает информацию о модуле по поддомену из backend API
- Проверяет, соответствует ли маршрут `publicRoutes` или `dashboardRoutes` модуля
- Загружает страницу модуля

### Как это работает

1. Пользователь открывает `shop.localhost:7000`
2. Frontend middleware извлекает поддомен `shop`
3. Dynamic router вызывает `/api/tenants/by-subdomain/shop`
4. Backend возвращает:
   - `tenant_id`
   - `active_module` (например, `"shop"`)
   - `module_info` с маршрутами из `manifest.json`
5. Router проверяет маршрут и загружает соответствующую страницу модуля

### Настройка для localhost

Для работы `shop.localhost:7000` нужно настроить hosts файл:

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
```
127.0.0.1 shop.localhost
```

**Linux/Mac:** `/etc/hosts`
```
127.0.0.1 shop.localhost
```

### Примеры маршрутов

Для модуля `shop` с `manifest.json`:
```json
{
  "publicRoutes": ["/", "/catalog", "/product/:id"],
  "dashboardRoutes": ["/admin/products"]
}
```

- `shop.localhost:7000/` → модуль shop, публичная страница `/`
- `shop.localhost:7000/catalog` → модуль shop, публичная страница `/catalog`
- `shop.localhost:7000/admin/products` → модуль shop, dashboard страница

### Регистрация поддомена

При регистрации через `/api/auth/register`:
1. Создается tenant
2. Резервируется поддомен в таблице `tenant_domains`
3. Устанавливается `active_module` в таблице `tenants`

### Следующие шаги

Для полной интеграции нужно:
1. Реализовать динамическую загрузку модулей в `app/[...slug]/page.tsx`
2. Настроить проксирование API запросов модулей
3. Реализовать систему тем модулей



