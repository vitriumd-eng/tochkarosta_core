# Stub-сервисы для тестирования регистрации

Два минимальных FastAPI-сервиса для локального тестирования полного flow регистрации.

## Установка

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Запуск

### 1. Запустить module_service (порт 8000)

```bash
uvicorn module_service.main:app --reload --port 8000
```

Проверить: http://localhost:8000/health

### 2. Запустить core_stub (порт 8001)

```bash
uvicorn core_stub.main:app --reload --port 8001
```

Проверить: http://localhost:8001/health

**Важно:** Порядок запуска не критичен, но module_service должен быть доступен на http://localhost:8000 чтобы core_stub смог успешно вызвать /api/v1/internal/register.

## Тестирование

### Шаг 1: Запрос кода

```bash
POST http://localhost:8001/auth/request_code
{
  "channel": "telegram",
  "identifier": "@tester"
}
```

**Код будет выведен в консоль сервера!** Ищите строку вида:
```
[VERIFICATION] Code for telegram @tester: 123456
```

### Шаг 2: Подтверждение кода

```bash
POST http://localhost:8001/auth/confirm_code
{
  "channel": "telegram",
  "identifier": "@tester",
  "code": "123456"
}
```

Ответ содержит `tenant_id`:
```json
{
  "confirmed": true,
  "tenant_id": "uuid-here"
}
```

### Шаг 3: Альтернатива - Dev-login (быстрый вход)

Можно войти без регистрации через код:
```bash
POST http://localhost:8001/auth/dev_login
{
  "email": "local@test.dev",
  "role": "owner"
}
```

Ответ содержит `tenant_id` и `access_token`.

### Шаг 4: Сохранить tenant_id

Добавьте в `.env.local` фронтенда:
```
NEXT_PUBLIC_DEV_TENANT_ID="полученный-uuid"
```

### Шаг 5: Активация модуля

```bash
POST http://localhost:8001/modules/activate
{
  "tenant_id": "uuid-from-step-2",
  "module": "shop",
  "plan": "basic",
  "subdomain": "test-shop"
}
```

core_stub автоматически:
1. Вызовет `/api/v1/internal/register` в module_service
2. Отправит webhook `/api/v1/webhooks/license.updated`

### Шаг 6: Проверить регистрацию в модуле

```bash
GET http://localhost:8000/admin/tenants
```

Ожидается отображение арендатора с его данными.

## Endpoints

### core_stub (порт 8001)

- `POST /auth/request_code` - запрос кода
- `POST /auth/confirm_code` - подтверждение кода
- `POST /auth/dev_login` - быстрый вход разработчика (без регистрации)
- `POST /modules/activate` - активация модуля
- `GET /health` - проверка здоровья

### module_service (порт 8000)

- `POST /api/v1/internal/register` - регистрация tenant в модуле
- `POST /api/v1/webhooks/license.updated` - webhook обновления лицензии
- `GET /admin/tenants` - список зарегистрированных tenants
- `GET /health` - проверка здоровья

## Базы данных

Сервисы используют SQLite:
- `core_stub.db` - для core_stub (коды и tenants)
- `module_service.db` - для module_service (tenants модуля)

Базы создаются автоматически при первом запуске.

## Полный flow

### Вариант 1: Регистрация через код
```
1. request_code → код в логах
2. confirm_code → tenant_id
3. activate module → 
   → module/internal/register →
   → module/webhooks/license.updated →
4. admin/tenants → проверка регистрации
```

### Вариант 2: Dev-login (быстрый вход)
```
1. dev_login → tenant_id + access_token
2. activate module → 
   → module/internal/register →
   → module/webhooks/license.updated →
3. admin/tenants → проверка регистрации
```

## Примечания

- Вся логика хранится в памяти/SQLite (dev only)
- Коды печатаются в консоль (dev mode)
- Для production потребуется: PostgreSQL, Redis, реальная отправка кодов, HMAC для webhooks и т.д.

