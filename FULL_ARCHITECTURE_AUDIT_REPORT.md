# ПОЛНЫЙ АУДИТ АРХИТЕКТУРЫ: Соответствие `.cursor\sqlacad.md` и `.cursor\fixunicorn.md`

## Дата: 2025-11-16

## СТАТУС: ❌ КРИТИЧЕСКИЕ НАРУШЕНИЯ ОБНАРУЖЕНЫ

---

## РЕЗЮМЕ

**Проект НЕ соответствует архитектурным правилам из `.cursor\sqlacad.md`.**

**Критическое нарушение:** Большая часть кода использует `asyncpg` напрямую и `raw SQL` запросы вместо обязательного `SQLAlchemy ORM`.

---

## 1. ОБЯЗАТЕЛЬНОЕ ИСПОЛЬЗОВАНИЕ SQLALCHEMY ORM

### ❌ КРИТИЧЕСКОЕ НАРУШЕНИЕ

**Правило из `.cursor\sqlacad.md`:**
> Cursor обязан использовать только SQLAlchemy ORM (версия 2.0+) для всех операций с БД.

**Текущее состояние:**

#### ✅ Что соответствует:
1. **`app/services/user_service.py`** — использует SQLAlchemy ORM:
   - `select(User).where(User.phone == phone)`
   - `AsyncSession`
   - Правильная работа с ORM

2. **`app/api/platform.py`** (частично) — метод `platform_login()` использует ORM через `get_sqlalchemy_session()`

3. **`app/models/user.py`** — SQLAlchemy модель (после рефакторинга)

4. **`app/db/session.py`** — добавлена поддержка SQLAlchemy (`get_sqlalchemy_session()`)

#### ❌ Что нарушает правило:

**1. `app/db/session.py`** — все еще использует `asyncpg`:
```python
import asyncpg  # ❌ НАРУШЕНИЕ
_pool: Optional[asyncpg.Pool] = None  # ❌ НАРУШЕНИЕ
async def get_db() -> AsyncGenerator[asyncpg.Connection, None]:  # ❌ НАРУШЕНИЕ
    _pool = await asyncpg.create_pool(...)  # ❌ НАРУШЕНИЕ
```

**2. `app/services/auth.py`** — использует `get_db()` и raw SQL:
- `await db.fetchrow("SELECT * FROM users WHERE phone = $1")` — ❌
- `await db.execute("UPDATE users SET ...")` — ❌
- `await db.fetchrow("INSERT INTO ...")` — ❌

**3. `app/services/platform_content.py`** — использует `get_db()` и raw SQL:
- `await db.fetch("SELECT key, content FROM platform_content")` — ❌
- `await db.fetchrow("SELECT * FROM platform_content WHERE key = $1")` — ❌
- `UPDATE platform_content SET ...` — ❌
- `INSERT INTO platform_content ...` — ❌

**4. `app/services/subscription.py`** — использует `get_db()` и raw SQL:
- `SELECT trial_days FROM module_settings ...` — ❌
- `INSERT INTO subscriptions ...` — ❌
- `UPDATE tenants SET ...` — ❌

**5. `app/services/tenant.py`** — использует `get_db()` и raw SQL:
- `INSERT INTO tenants ...` — ❌
- `UPDATE users SET tenant_id = ...` — ❌
- `SELECT id FROM tenant_domains ...` — ❌

**6. `app/api/auth.py`** — использует `get_db()` и raw SQL:
- `SELECT id FROM users WHERE phone = $1` — ❌
- `SELECT deleted_at FROM deleted_accounts_history ...` — ❌
- `UPDATE tenants SET active_module = ...` — ❌

**7. `app/api/tenants.py`** — использует `get_db()` и raw SQL:
- `SELECT ... FROM tenant_domains ...` — ❌

**8. `app/api/modules.py`** — использует `get_db()` и raw SQL:
- `SELECT active_module FROM tenants ...` — ❌
- `UPDATE tenants SET active_module = ...` — ❌

**9. `app/middleware/tenant.py`** — использует `get_db()` и raw SQL:
- `SELECT td.tenant_id, t.active_module FROM tenant_domains ...` — ❌

**10. `app/modules/sdk.py`** — использует `asyncpg.connect()` напрямую:
```python
import asyncpg  # ❌ НАРУШЕНИЕ
conn = await asyncpg.connect(postgres_url)  # ❌ НАРУШЕНИЕ
await conn.fetchval("SELECT 1 FROM pg_database ...")  # ❌ НАРУШЕНИЕ
await conn.execute(f'CREATE DATABASE "{module_db_name}"')  # ❌ НАРУШЕНИЕ
```

**11. `app/api/platform.py`** (частично) — метод `health_check()` использует `get_db()`:
```python
async with get_db() as db:  # ❌ НАРУШЕНИЕ
    await db.fetchval("SELECT 1")  # ❌ НАРУШЕНИЕ
```

---

## 2. ЗАПРЕТ НА ПРЯМОЙ ДОСТУП К БД

### ❌ КРИТИЧЕСКОЕ НАРУШЕНИЕ

**Правило из `.cursor\sqlacad.md`:**
> Cursor НЕ имеет права использовать: asyncpg напрямую, psycopg напрямую, raw SQL вне ORM

**Найдено нарушений:** 15+ файлов используют `asyncpg` или `raw SQL` напрямую.

**Список нарушений:**

| Файл | Тип нарушения | Пример |
|------|---------------|--------|
| `app/db/session.py` | asyncpg напрямую | `asyncpg.create_pool()` |
| `app/services/auth.py` | raw SQL | `await db.fetchrow("SELECT * FROM users...")` |
| `app/services/platform_content.py` | raw SQL | `await db.fetch("SELECT key...")` |
| `app/services/subscription.py` | raw SQL | `INSERT INTO subscriptions...` |
| `app/services/tenant.py` | raw SQL | `INSERT INTO tenants...` |
| `app/api/auth.py` | raw SQL | `SELECT id FROM users...` |
| `app/api/tenants.py` | raw SQL | `SELECT ... FROM tenant_domains...` |
| `app/api/modules.py` | raw SQL | `UPDATE tenants SET...` |
| `app/middleware/tenant.py` | raw SQL | `SELECT td.tenant_id...` |
| `app/modules/sdk.py` | asyncpg напрямую | `asyncpg.connect()` |
| `app/api/platform.py` | raw SQL (health_check) | `await db.fetchval("SELECT 1")` |

---

## 3. ИСПОЛЬЗОВАНИЕ ALEMBIC ДЛЯ МИГРАЦИЙ

### ⚠️ ЧАСТИЧНОЕ НАРУШЕНИЕ

**Правило из `.cursor\sqlacad.md`:**
> Cursor обязан генерировать миграции через Alembic, использовать ORM как источник схемы, НЕ писать raw SQL миграции вручную.

**Текущее состояние:**

✅ **Есть:**
- `core-backend/alembic.ini` — файл конфигурации Alembic существует

❌ **Отсутствует:**
- Директория `core-backend/alembic/` — НЕ НАЙДЕНА
- Файлы миграций `alembic/versions/*.py` — ОТСУТСТВУЮТ
- `alembic/env.py` — ОТСУТСТВУЕТ

**Проблема:** Alembic настроен, но миграции не созданы. Схема БД задана через `app/db/schemas.sql` (raw SQL), что нарушает правило.

---

## 4. МОДЕЛИ ДАННЫХ

### ❌ НАРУШЕНИЕ

**Текущее состояние:**

| Модель | Тип | Статус |
|--------|-----|--------|
| `app/models/user.py` | SQLAlchemy ORM | ✅ Соответствует |
| `app/models/tenant.py` | Pydantic | ❌ Должна быть SQLAlchemy |
| `app/models/subscription.py` | Pydantic | ❌ Должна быть SQLAlchemy |
| `app/models/platform_content.py` | Pydantic | ❌ Должна быть SQLAlchemy |

**Проблема:** Только модель `User` использует SQLAlchemy ORM. Остальные модели — Pydantic, что не соответствует архитектуре (Pydantic модели не могут использоваться с ORM для работы с БД).

---

## 5. РАЗРЕШЕННЫЕ ИНСТРУМЕНТЫ

### ✅ СООТВЕТСТВУЕТ

**Правило из `.cursor\sqlacad.md`:**
> Cursor может использовать: Python 3.10+, FastAPI, SQLAlchemy ORM, Alembic, Pydantic, passlib[bcrypt], httpx, pytest

**Текущее состояние:**
- ✅ Python 3.10+ — используется
- ✅ FastAPI — используется
- ✅ SQLAlchemy ORM — используется (частично)
- ✅ Alembic — настроен (но миграции отсутствуют)
- ✅ Pydantic — используется для схем
- ✅ passlib — используется в `app/security/hashing.py`
- ✅ pytest — может использоваться

---

## 6. СТРУКТУРА ПРОЕКТА

### ✅ СООТВЕТСТВУЕТ

**Структура проекта соответствует правилам:**
```
core-backend/
  app/
    models/      ✅
    schemas/     ✅
    services/    ✅
    api/         ✅
    db/          ✅
    security/    ✅
    seed/        ✅
```

---

## 7. ПРАВИЛО "ТОЛЬКО ВНУТРИ СТРУКТУРЫ"

### ✅ СООТВЕТСТВУЕТ

Все файлы находятся в правильных каталогах согласно структуре проекта.

---

## 8. ОБРАБОТКА UVICORN (`.cursor\fixunicorn.md`)

### ✅ СООТВЕТСТВУЕТ

**Правила из `.cursor\fixunicorn.md`:**
- Активация venv — может быть улучшена
- Использование полного пути `.\venv\Scripts\uvicorn.exe` — может быть добавлено

**Текущее состояние:**
- `start-backend.ps1` существует и использует правильные команды
- Возможно улучшить для использования полного пути при необходимости

---

## КРИТИЧЕСКИЕ ПРОБЛЕМЫ: СВОДКА

### ❌ Проблема 1: asyncpg используется напрямую

**Места:**
1. `app/db/session.py` — основной пул подключений
2. `app/modules/sdk.py` — создание БД для модулей

**Последствия:**
- Нарушение архитектурного правила
- Смешивание подходов (asyncpg + SQLAlchemy)
- Невозможность использования преимуществ ORM

---

### ❌ Проблема 2: Raw SQL используется вместо ORM

**Места:** 10+ файлов с raw SQL запросами

**Последствия:**
- Отсутствие типобезопасности
- Сложность поддержки и рефакторинга
- Невозможность использования relationships, lazy loading
- Риск SQL injection (хотя используются параметризованные запросы)

---

### ❌ Проблема 3: Модели не соответствуют ORM

**Проблема:**
- Только `User` — SQLAlchemy модель
- `Tenant`, `Subscription`, `PlatformContent` — Pydantic модели

**Последствия:**
- Невозможность использовать ORM для этих сущностей
- Дублирование логики (Pydantic для валидации + raw SQL для БД)

---

### ❌ Проблема 4: Alembic не используется

**Проблема:**
- Схема БД задана через `app/db/schemas.sql` (raw SQL)
- Миграции Alembic отсутствуют
- Нет версионирования схемы БД

**Последствия:**
- Сложность управления изменениями схемы
- Невозможность отката изменений
- Ручное управление миграциями

---

## ПЛАН ИСПРАВЛЕНИЯ

### Приоритет 1: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ

1. **Заменить все использования `get_db()` на `get_sqlalchemy_session()`**
   - Обновить все сервисы
   - Обновить все API endpoints
   - Обновить middleware

2. **Преобразовать Pydantic модели в SQLAlchemy ORM модели:**
   - `app/models/tenant.py` → SQLAlchemy модель
   - `app/models/subscription.py` → SQLAlchemy модель
   - `app/models/platform_content.py` → SQLAlchemy модель

3. **Переписать все raw SQL запросы на SQLAlchemy ORM:**
   - Использовать `select()`, `insert()`, `update()`, `delete()`
   - Использовать `session.scalar()`, `session.execute()`

4. **Создать Alembic миграции:**
   - Создать директорию `alembic/`
   - Создать `alembic/env.py`
   - Создать начальную миграцию на основе ORM моделей
   - Удалить или преобразовать `app/db/schemas.sql`

5. **Рефакторинг `app/db/session.py`:**
   - Убрать `asyncpg` из основного кода
   - Оставить только SQLAlchemy ORM
   - `get_db()` оставить только для обратной совместимости (deprecated)

6. **Рефакторинг `app/modules/sdk.py`:**
   - Использовать SQLAlchemy для проверки существования БД
   - Или использовать специальный метод для создания БД через ORM

---

### Приоритет 2: ВАЖНЫЕ УЛУЧШЕНИЯ

1. **Настроить Alembic правильно:**
   - Обновить `alembic.ini` для использования DATABASE_URL
   - Настроить `alembic/env.py` для async SQLAlchemy

2. **Добавить relationships в ORM модели:**
   - `User.tenant` → `relationship("Tenant")`
   - `Tenant.users` → `relationship("User", back_populates="tenant")`
   - `Tenant.subscriptions` → `relationship("Subscription")`

3. **Улучшить структуру сервисов:**
   - Все сервисы должны работать только с ORM
   - Убрать любые упоминания asyncpg

---

## СТАТИСТИКА НАРУШЕНИЙ

| Категория | Количество нарушений | Приоритет |
|-----------|---------------------|-----------|
| Использование asyncpg | 2 файла | КРИТИЧЕСКИЙ |
| Использование raw SQL | 10+ файлов | КРИТИЧЕСКИЙ |
| Pydantic вместо ORM моделей | 3 модели | КРИТИЧЕСКИЙ |
| Отсутствие Alembic миграций | 1 проблема | ВАЖНЫЙ |
| Всего критических нарушений | 16+ | - |

---

## ЗАКЛЮЧЕНИЕ

**Проект требует полного рефакторинга для соответствия архитектурным правилам.**

**Критический статус:** ❌ НЕ СООТВЕТСТВУЕТ

**Рекомендация:** Провести полный рефакторинг всех сервисов, API endpoints, моделей и middleware для использования только SQLAlchemy ORM согласно правилам `.cursor\sqlacad.md`.

---

## ФАЙЛЫ ДЛЯ ИСПРАВЛЕНИЯ

### Критические (использование asyncpg/raw SQL):
1. `app/db/session.py`
2. `app/services/auth.py`
3. `app/services/platform_content.py`
4. `app/services/subscription.py`
5. `app/services/tenant.py`
6. `app/api/auth.py`
7. `app/api/tenants.py`
8. `app/api/modules.py`
9. `app/api/platform.py` (health_check)
10. `app/middleware/tenant.py`
11. `app/modules/sdk.py`

### Модели (Pydantic → SQLAlchemy):
1. `app/models/tenant.py`
2. `app/models/subscription.py`
3. `app/models/platform_content.py`

### Миграции:
1. Создать `alembic/` директорию
2. Создать `alembic/env.py`
3. Создать начальную миграцию

---

**Отчет создан:** 2025-11-16  
**Следующий шаг:** Начать рефакторинг согласно плану исправления.

