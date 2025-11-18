# СВОДКА ПРАВИЛ ИЗ .cursor

## ОБЩИЕ ПРИНЦИПЫ
1. **Все файлы в .cursor - ПРИМЕРЫ** - должны быть адаптированы к проекту
2. **Не запускать в production без ревью**
3. **Обновлять OpenAPI и генерировать SDK/types после изменений**

## OAUTH РЕГИСТРАЦИЯ (Telegram/MAX)

### 1. OpenAPI Спецификация
- Endpoint: `/api/v1/auth/oauth/{provider}`
- Provider: `telegram` или `max`
- Обязательные поля: `provider`, `external_id`, `signature`
- Опциональные: `username`, `first_name`, `last_name`

### 2. FastAPI Route
- Файл: `app/api/v1/routes/auth_oauth.py`
- Проверка соответствия `provider` в path и body
- Вызов `auth_oauth_handler` из сервиса
- Валидация подписи перед созданием пользователя

### 3. Service Layer
- Файл: `app/services/auth_service.py`
- Функция `verify_telegram_signature` для проверки подписи
- Dev-режим: разрешить `signature == 'DEV'`
- Функция `auth_oauth_handler` для обработки OAuth запросов
- Создание/поиск пользователя и tenant

### 4. Pydantic Models
- `ExternalAuthRequest`: запрос OAuth
- `AuthResponse`: ответ с токенами и ID

### 5. Database Migration
- Таблица `user_external_accounts`:
  - `id` (UUID)
  - `user_id` (UUID, FK to users)
  - `provider` (VARCHAR)
  - `external_id` (VARCHAR)
  - `created_at` (TIMESTAMP)
  - UNIQUE(provider, external_id)

### 6. Gateway (Frontend API Route)
- Нормализация payload: `external_id` как строка
- Проверка существования endpoint в OpenAPI перед форвардингом
- Форвардинг на `/api/v1/auth/oauth/{provider}`

### 7. Frontend (Next.js)
- Использование Telegram WebApp API
- Получение `initData` от Telegram
- Отправка на gateway с подписью

## ОБЯЗАТЕЛЬНЫЕ ПРОВЕРКИ ПЕРЕД ИЗМЕНЕНИЯМИ

1. ✅ Проверить OpenAPI схему
2. ✅ Убедиться в уникальности summary для endpoints
3. ✅ Проверить наличие requestBody для POST/PUT/PATCH
4. ✅ Проверить наличие response_model для всех endpoints
5. ✅ Правильная работа с tenant_id
6. ✅ Совместимость с генераторами SDK
7. ✅ Запустить миграции локально
8. ✅ Протестировать локально перед коммитом

## GATEWAY ENFORCEMENT
- Gateways ДОЛЖНЫ валидировать существование endpoint в core OpenAPI перед форвардингом
- Gateways ДОЛЖНЫ нормализовать payload: `external_id` как строка, `signature` присутствует
- Cursor ДОЛЖЕН запрещать создание новых endpoints; использовать только OpenAPI контракт

