# Детальный аудит кода и архитектуры проекта Tochka Rosta

**Дата аудита:** 2024-12-19  
**Версия проекта:** 1.0.0  
**Аудитор:** Системный инженер

---

## 📋 Оглавление

1. [Резюме](#резюме)
2. [Архитектура и структура](#архитектура-и-структура)
3. [Backend аудит](#backend-аудит)
4. [Frontend аудит](#frontend-аудит)
5. [Безопасность](#безопасность)
6. [Производительность](#производительность)
7. [Обработка ошибок](#обработка-ошибок)
8. [Tenant isolation](#tenant-isolation)
9. [Webhooks и интеграции](#webhooks-и-интеграции)
10. [Рекомендации](#рекомендации)

---

## 📊 Резюме

### Общая оценка: **B+ (Хорошо, с улучшениями)**

**Сильные стороны:**
- ✅ Четкая архитектура с разделением слоев
- ✅ Полная async/await реализация в backend
- ✅ Правильное использование SQLAlchemy ORM (защита от SQL injection)
- ✅ Pydantic для валидации данных
- ✅ TypeScript с strict mode
- ✅ Tenant-based архитектура реализована

**Критические проблемы:**
- ⚠️ Отсутствие транзакций в некоторых критических операциях
- ⚠️ Webhooks не идемпотентны
- ⚠️ In-memory storage для verification codes (должно быть Redis)
- ⚠️ Отсутствие retry логики для HTTP запросов между сервисами
- ⚠️ Некоторые операции не атомарны

**Средние проблемы:**
- ⚠️ Отсутствие Circuit Breaker паттерна
- ⚠️ Нет rate limiting
- ⚠️ Недостаточное логирование ошибок
- ⚠️ TODO в production коде

---

## 🏗️ Архитектура и структура

### ✅ Положительные моменты

1. **Четкое разделение слоев:**
   ```
   api (routes) → service → db (models) → utils
   ```
   - Routes только обрабатывают HTTP
   - Service содержит бизнес-логику
   - Models - ORM
   - Utils - вспомогательные функции

2. **Модульная архитектура:**
   - Модули независимы
   - Четкий SDK для взаимодействия
   - Webhooks для интеграций

3. **Tenant isolation:**
   - TenantMiddleware извлекает tenant_id
   - Корректная работа с tenant scope

### ⚠️ Проблемы

1. **Отсутствие repository слоя:**
   - Service напрямую работает с ORM
   - Нет абстракции для БД операций
   - **Рекомендация:** Добавить repository слой для лучшей тестируемости

2. **Смешение ответственности:**
   - В `modules.py` есть бизнес-логика активации модуля
   - Должно быть в Service слое
   - **Файл:** `core-backend/app/api/v1/routes/modules.py:110-315`

---

## 🔧 Backend аудит

### 1. Async/Await использование

#### ✅ Хорошо

Все endpoints используют `async def`:
```python
@router.post("/activate-module")
async def activate_module(...)
```

Все БД операции async:
```python
async with AsyncSessionLocal() as db:
    result = await db.execute(stmt)
```

#### ⚠️ Проблемы

**Нет явного управления пулом соединений:**
- `AsyncSessionLocal` создается глобально
- Нет проверки переполнения пула
- **Файл:** `core-backend/app/db/session.py:15-22`

**Рекомендация:**
```python
# Добавить мониторинг пула
@router.get("/health/db")
async def db_health():
    pool = engine.pool
    return {
        "size": pool.size(),
        "checked_in": pool.checkedin(),
        "checked_out": pool.checkedout(),
        "overflow": pool.overflow()
    }
```

### 2. Транзакции и атомарность

#### ✅ Хорошо

Некоторые операции используют транзакции:
```python
async with AsyncSessionLocal() as db:
    try:
        # operations
        await db.commit()
    except:
        await db.rollback()
```

#### ❌ Критические проблемы

**1. Активация модуля НЕ атомарна:**
```python
# core-backend/app/api/v1/routes/modules.py:220-235
# Проблема: Операции выполняются в разных транзакциях

async with AsyncSessionLocal() as db:
    tenant.active_module = activate_req.module
    await db.flush()  # ❌ Нет commit!

# Reserve subdomain - отдельная транзакция
await tenant_service.reserve_subdomain(...)  # ❌ Может упасть здесь

# Create subscription - отдельная транзакция
subscription = await subscription_service.create_trial_subscription(...)
```

**Последствия:**
- Если `reserve_subdomain` упадет, `active_module` уже установлен
- Если `create_trial_subscription` упадет, модуль активирован, но нет подписки
- **Race condition** при параллельных запросах

**Исправление:**
```python
async with AsyncSessionLocal() as db:
    try:
        # Все операции в одной транзакции
        tenant.active_module = activate_req.module
        await tenant_service.reserve_subdomain(...)  # Внутри транзакции
        subscription = await subscription_service.create_trial_subscription(...)
        await db.commit()
    except:
        await db.rollback()
        raise
```

**2. confirm_code создает user и tenant в одной транзакции, но без rollback при ошибке webhook:**
```python
# core-backend/app/api/v1/routes/auth.py:90-145
async with AsyncSessionLocal() as db:
    try:
        # Create user and tenant
        await db.commit()  # ✅ Хорошо
    except Exception as e:
        await db.rollback()  # ✅ Хорошо
        raise HTTPException(...)
```

**Проблема:** После commit может упасть webhook вызов, но user/tenant уже созданы.

### 3. Обработка ошибок

#### ✅ Хорошо

Большинство endpoints имеют try/except:
```python
try:
    # operation
except HTTPException:
    raise
except Exception as e:
    logger.error(...)
    raise HTTPException(...)
```

#### ⚠️ Проблемы

**1. Слишком широкий catch:**
```python
# core-backend/app/api/v1/routes/modules.py:311-315
except Exception as e:
    logger.error(f"Failed to activate module: {e}", exc_info=True)
    raise HTTPException(status_code=500, detail=f"Failed to activate module: {str(e)}")
```

**Проблема:** Ловит все исключения, включая KeyboardInterrupt, SystemExit

**Исправление:**
```python
except HTTPException:
    raise
except (ValueError, IntegrityError, DatabaseError) as e:
    logger.error(...)
    raise HTTPException(...)
except Exception as e:
    logger.critical(f"Unexpected error: {e}", exc_info=True)
    raise HTTPException(status_code=500, detail="Internal server error")
```

**2. Раскрытие внутренних ошибок клиенту:**
```python
# Плохо: Детали БД ошибок видны клиенту
raise HTTPException(status_code=500, detail=f"Failed to activate module: {str(e)}")
```

**Исправление:**
```python
# Хорошо: Общее сообщение, детали в логах
logger.error(f"Failed to activate module: {e}", exc_info=True)
raise HTTPException(status_code=500, detail="Failed to activate module")
```

### 4. Pydantic валидация

#### ✅ Хорошо

Все request schemas используют Pydantic:
```python
class RegisterRequest(BaseModel):
    phone: str = Field(..., description="User phone number")
    code: str = Field(..., description="OTP verification code")
```

FastAPI автоматически валидирует запросы.

#### ⚠️ Проблемы

**Нет кастомных валидаторов:**
```python
# Текущая реализация
channel: str = Field(..., description="Channel: 'telegram' or 'max'")

# Рекомендация: Добавить валидатор
from pydantic import validator

@validator('channel')
def validate_channel(cls, v):
    if v not in ['telegram', 'max']:
        raise ValueError('Channel must be telegram or max')
    return v
```

**Файл:** `core-backend/app/schemas/auth.py:47-50`

### 5. SQL Injection защита

#### ✅ Отлично

Все запросы используют SQLAlchemy ORM или параметризованные запросы:
```python
stmt = select(User).where(User.phone == phone)  # ✅ Безопасно
result = await db.execute(stmt)
```

**Нет raw SQL с пользовательским вводом** ✅

### 6. Database Connection Pooling

#### ✅ Хорошо

Пул настроен:
```python
engine = create_async_engine(
    async_database_url,
    pool_pre_ping=True,
    pool_size=settings.DB_POOL_MIN_SIZE,
    max_overflow=settings.DB_POOL_MAX_SIZE - settings.DB_POOL_MIN_SIZE,
    pool_recycle=3600,
)
```

#### ⚠️ Рекомендации

- Добавить мониторинг пула
- Настроить pool timeout
- Добавить метрики для алертов

---

## 🎨 Frontend аудит

### 1. TypeScript типизация

#### ✅ Хорошо

- `strict: true` в tsconfig.json
- Интерфейсы для API responses
- Типы для React state

#### ⚠️ Проблемы

**1. Использование `any`:**
```typescript
// core-frontend/app/register/page.tsx:35
catch (err: any) {
    setError(err.message || 'Не удалось отправить код')
}
```

**Исправление:**
```typescript
catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Не удалось отправить код'
    setError(message)
}
```

**2. Нет типов для API ошибок:**
```typescript
// Текущая реализация
const error = await response.json()
throw new Error(error.detail || error.error || 'Registration failed')
```

**Рекомендация:** Создать типы для API ошибок:
```typescript
interface APIError {
    detail?: string
    error?: string
    message?: string
}
```

### 2. Обработка ошибок на клиенте

#### ✅ Хорошо

Есть обработка ошибок в try/catch блоках.

#### ⚠️ Проблемы

**1. Нет retry логики для сетевых запросов:**
```typescript
// core-frontend/lib/api/register.ts:42-58
export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch('/api/auth/register', {
        // Нет retry при сетевых ошибках
    })
}
```

**Рекомендация:** Добавить retry с exponential backoff:
```typescript
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options)
            if (response.ok) return response
            if (response.status >= 500 && i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
                continue
            }
            return response
        } catch (error) {
            if (i === retries - 1) throw error
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
        }
    }
    throw new Error('Max retries exceeded')
}
```

**2. Нет обработки timeout:**
```typescript
// Текущая реализация
const response = await fetch('/api/auth/register', {...})

// Рекомендация
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout
try {
    const response = await fetch('/api/auth/register', {
        ...options,
        signal: controller.signal
    })
} finally {
    clearTimeout(timeoutId)
}
```

### 3. Tenant scope

#### ✅ Хорошо

- `tenant_id` извлекается из localStorage
- Передается в API запросы

#### ⚠️ Проблемы

**Нет валидации tenant_id на клиенте:**
```typescript
// core-frontend/app/select-module/page.tsx
const tenantId = typeof window !== 'undefined' 
    ? (localStorage.getItem('tenant_id') || searchParams.get('tenant'))
    : searchParams.get('tenant')
```

**Рекомендация:** Добавить валидацию UUID:
```typescript
function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
}
```

---

## 🔒 Безопасность

### 1. JWT токены

#### ✅ Хорошо

- HS256 алгоритм
- Secret key из env
- Валидация секретного ключа
- Token expiration

#### ⚠️ Проблемы

**1. Secret key валидация только при старте:**
```python
# core-backend/app/utils/jwt.py:32-33
is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"
validate_secret_key(SECRET_KEY, is_production)
```

**Проблема:** Если secret изменится в runtime, валидация не сработает.

**2. Нет refresh token rotation:**
```python
# Текущая реализация
def create_refresh_token(data: Dict) -> str:
    # Нет rotation логики
```

**Рекомендация:** Реализовать refresh token rotation для безопасности.

### 2. CORS

#### ✅ Хорошо

- Настройка через settings
- Предупреждение при wildcard в production
- Список разрешенных origins

#### ⚠️ Проблемы

**Allow headers "*" в production:**
```python
# core-backend/app/main.py:83-84
allow_methods=["*"],
allow_headers=["*"],  # ⚠️ Слишком широко
```

**Рекомендация:**
```python
allow_headers=[
    "Content-Type",
    "Authorization",
    "X-Request-ID",
    "X-Tenant-ID"
]
```

### 3. SQL Injection

#### ✅ Отлично

Все запросы через ORM - защита автоматическая ✅

### 4. Password hashing

#### ✅ Хорошо

- Используется bcrypt
- Passlib для работы с хешами

### 5. Verification Codes

#### ❌ Критическая проблема

**In-memory storage для verification codes:**
```python
# core-backend/app/services/verification.py:13
_verification_storage: dict = {}  # ❌ Не работает в multi-instance
```

**Проблемы:**
- Не работает при нескольких инстансах приложения
- Коды теряются при перезапуске
- Нет распределенного хранения

**Исправление:** Использовать Redis:
```python
import redis.asyncio as redis

redis_client = redis.from_url(settings.REDIS_URL)

async def generate_code(self, channel: str, identifier: str) -> str:
    code = str(random.randint(100000, 999999))
    key = f"verification:{channel}:{identifier}"
    await redis_client.setex(key, self.CODE_TTL, code)
    return code
```

---

## ⚡ Производительность

### 1. Database queries

#### ⚠️ Проблемы

**1. N+1 queries в некоторых местах:**
```python
# Пример потенциальной проблемы
for tenant in tenants:
    subscription = await get_subscription(tenant.id)  # N+1
```

**Рекомендация:** Использовать joinedload или selectinload:
```python
from sqlalchemy.orm import selectinload

stmt = select(Tenant).options(selectinload(Tenant.subscriptions))
```

**2. Нет индексов на часто используемых полях:**
- `User.phone` - есть unique constraint (автоматически создает индекс) ✅
- `TenantDomain.domain` - нужен индекс для быстрого поиска

**Рекомендация:** Добавить миграцию:
```python
# alembic/versions/xxx_add_indexes.py
def upgrade():
    op.create_index('idx_tenant_domain_domain', 'tenant_domains', ['domain'])
```

### 2. HTTP requests

#### ❌ Проблемы

**1. Нет timeout для HTTP запросов между сервисами:**
```python
# core-backend/app/api/v1/routes/modules.py:238
async with httpx.AsyncClient(timeout=10.0) as client:  # ✅ Есть timeout
    internal_response = await client.post(...)
```

**Хорошо:** Timeout установлен ✅

**2. Нет retry логики:**
```python
# Текущая реализация
try:
    response = await client.post(...)
except httpx.RequestError as e:
    # ❌ Нет retry, сразу падает
    logger.warning(f"Failed to call module backend: {e}")
```

**Рекомендация:** Добавить retry с exponential backoff:
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10)
)
async def call_module_backend(...):
    async with httpx.AsyncClient(timeout=10.0) as client:
        return await client.post(...)
```

**3. Нет Circuit Breaker:**
При падении модуля backend, core продолжает пытаться вызывать его.

**Рекомендация:** Использовать `pybreaker`:
```python
from pybreaker import CircuitBreaker

circuit_breaker = CircuitBreaker(fail_max=5, timeout_duration=60)

@circuit_breaker
async def call_module_backend(...):
    ...
```

### 3. Caching

#### ❌ Отсутствует

**Нет кэширования:**
- Module manifests читаются из файлов каждый раз
- Tenant info не кэшируется
- Subscription status не кэшируется

**Рекомендация:** Добавить Redis cache:
```python
from functools import wraps
import json

def cache_async(ttl=300):
    async def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{args}:{kwargs}"
            cached = await redis_client.get(key)
            if cached:
                return json.loads(cached)
            result = await func(*args, **kwargs)
            await redis_client.setex(key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator
```

---

## 🛡️ Обработка ошибок

### ✅ Хорошо

- Try/except блоки везде
- Логирование ошибок
- HTTPException для клиентских ошибок

### ⚠️ Проблемы

**1. Недостаточное логирование контекста:**
```python
# Текущая реализация
logger.error(f"Failed to activate module: {e}", exc_info=True)

# Рекомендация: Добавить контекст
logger.error(
    f"Failed to activate module: {e}",
    exc_info=True,
    extra={
        "tenant_id": tenant_id,
        "module_id": module_id,
        "subdomain": subdomain,
        "request_id": request.headers.get("X-Request-ID")
    }
)
```

**2. Нет structured logging:**
- Используется стандартный Python logging
- Нет JSON формата для парсинга

**Рекомендация:** Использовать `python-json-logger`:
```python
from pythonjsonlogger import jsonlogger

handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
handler.setFormatter(formatter)
logger.addHandler(handler)
```

**3. Нет alerting при критических ошибках:**
- Ошибки только в логах
- Нет интеграции с Sentry/Datadog

**Рекомендация:** Интегрировать Sentry:
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0
)
```

---

## 🏢 Tenant Isolation

### ✅ Хорошо

- TenantMiddleware извлекает tenant_id
- Корректная передача tenant в запросах
- Tenant scope в JWT токенах

### ⚠️ Проблемы

**1. Нет проверки доступа к tenant ресурсам:**
```python
# Потенциальная проблема: user может запросить чужой tenant_id
tenant_id = data.tenant_id  # Нет проверки, что это tenant пользователя
```

**Рекомендация:** Добавить проверку:
```python
async def verify_tenant_access(tenant_id: uuid.UUID, user_id: uuid.UUID):
    async with AsyncSessionLocal() as db:
        user_stmt = select(User).where(User.id == user_id)
        user_result = await db.execute(user_stmt)
        user = user_result.scalar_one_or_none()
        
        if not user or user.tenant_id != tenant_id:
            raise HTTPException(status_code=403, detail="Access denied to tenant")
```

**2. Нет RLS (Row Level Security) в PostgreSQL:**
- При прямых SQL запросах можно получить доступ к чужим данным
- Защита только на уровне приложения

**Рекомендация:** Реализовать RLS на уровне БД:
```sql
-- Пример для tenants таблицы
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tenants
    FOR ALL
    USING (id = current_setting('app.current_tenant', true)::uuid);
```

---

## 🔗 Webhooks и интеграции

### ⚠️ Проблемы

**1. Webhooks не идемпотентны:**
```python
# modules/shop/app/api/v1/webhooks/__init__.py:10-36
@router.post("/license.updated")
async def license_updated(request: Request):
    # ❌ Нет проверки, был ли webhook уже обработан
    data = await request.json()
    # Process update
```

**Проблема:** При повторной доставке webhook выполнится дважды.

**Исправление:** Добавить idempotency key:
```python
@router.post("/license.updated")
async def license_updated(request: Request):
    data = await request.json()
    webhook_id = data.get("id")  # Уникальный ID webhook
    tenant_id = data.get("tenant_id")
    
    # Проверить, был ли уже обработан
    key = f"webhook:license.updated:{webhook_id}"
    if await redis_client.exists(key):
        return {"status": "ok", "duplicate": True}
    
    # Обработать webhook
    # ...
    
    # Сохранить ID
    await redis_client.setex(key, 86400, "processed")  # 24 часа
```

**2. Нет retry для webhooks:**
- Если webhook упадет, нет механизма повтора
- Модуль не узнает об обновлении лицензии

**Рекомендация:** Использовать очередь (Celery/RQ):
```python
from celery import Celery

celery_app = Celery('webhooks')

@celery_app.task(bind=True, max_retries=3)
def send_webhook(self, url, payload):
    try:
        response = httpx.post(url, json=payload, timeout=10.0)
        response.raise_for_status()
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
```

**3. Нет валидации подписи webhook:**
- Любой может отправить webhook
- Нет проверки, что webhook от core

**Рекомендация:** Добавить HMAC подпись:
```python
import hmac
import hashlib

def sign_webhook(payload: dict, secret: str) -> str:
    message = json.dumps(payload, sort_keys=True)
    return hmac.new(
        secret.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()

# В core при отправке
signature = sign_webhook(payload, settings.WEBHOOK_SECRET)
headers = {"X-Webhook-Signature": signature}

# В модуле при получении
received_signature = request.headers.get("X-Webhook-Signature")
expected_signature = sign_webhook(await request.json(), settings.WEBHOOK_SECRET)
if not hmac.compare_digest(received_signature, expected_signature):
    raise HTTPException(status_code=401, detail="Invalid webhook signature")
```

---

## 📝 Рекомендации

### Критические (срочно исправить)

1. **Атомарность активации модуля:**
   - Обернуть все операции в одну транзакцию
   - Добавить rollback при ошибках

2. **Verification codes в Redis:**
   - Заменить in-memory storage на Redis
   - Добавить distributed locking

3. **Idempotency для webhooks:**
   - Добавить проверку обработанных webhook IDs
   - Использовать Redis для хранения

### Важные (исправить в ближайшее время)

4. **Retry логика:**
   - Добавить retry для HTTP запросов между сервисами
   - Exponential backoff
   - Circuit Breaker

5. **Обработка ошибок:**
   - Не раскрывать внутренние ошибки клиенту
   - Structured logging с контекстом
   - Интеграция с Sentry

6. **Tenant access control:**
   - Проверка доступа к tenant ресурсам
   - RLS на уровне БД

7. **Webhook security:**
   - HMAC подпись для webhooks
   - Валидация отправителя

### Улучшения (можно сделать позже)

8. **Repository слой:**
   - Абстракция для БД операций
   - Легче тестировать

9. **Caching:**
   - Redis для кэширования частых запросов
   - Cache invalidation стратегия

10. **Monitoring:**
    - Метрики для пула БД
    - Health checks
    - Alerting

11. **Type safety:**
    - Убрать `any` из TypeScript
    - Типы для API ошибок

12. **Rate limiting:**
    - Защита от DDoS
    - Ограничение по IP/tenant

---

## 📊 Статистика проблем

- **Критических:** 3
- **Важных:** 4
- **Улучшений:** 5
- **Всего:** 12

---

## ✅ Чек-лист исправлений

- [ ] Атомарность активации модуля
- [ ] Redis для verification codes
- [ ] Idempotency для webhooks
- [ ] Retry логика для HTTP
- [ ] Circuit Breaker
- [ ] Улучшение обработки ошибок
- [ ] Tenant access control
- [ ] Webhook security (HMAC)
- [ ] Repository слой
- [ ] Caching
- [ ] Monitoring и метрики
- [ ] Type safety улучшения

---

**Документ создан автоматически на основе детального анализа кодовой базы.**


