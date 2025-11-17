# Детальный анализ технологического стека проекта tochkarosta_core

**Дата анализа:** 2024-12-19  
**Версия проекта:** 1.0.0

---

## 📋 Оглавление

1. [Архитектура проекта](#архитектура-проекта)
2. [Языки программирования](#языки-программирования)
3. [Backend стек](#backend-стек)
4. [Frontend стек](#frontend-стек)
5. [Базы данных](#базы-данных)
6. [Инструменты разработки](#инструменты-разработки)
7. [DevOps и развертывание](#devops-и-развертывание)
8. [Безопасность](#безопасность)
9. [Тестирование](#тестирование)
10. [Мониторинг и логирование](#мониторинг-и-логирование)

---

## 🏗️ Архитектура проекта

### Тип архитектуры
**Модульная SaaS-платформа** с разделением на:
- **Core Backend** - ядро платформы (FastAPI)
- **Core Frontend** - фронтенд ядра (Next.js 14)
- **Modules** - отдельные модули (shop и др.)
- **Test Services** - заглушки для тестирования

### Архитектурные паттерны
- **Модульная архитектура** - каждый модуль независим
- **Multi-tenant** - поддержка нескольких клиентов
- **API-first** - RESTful API для всех взаимодействий
- **Server-Side Rendering (SSR)** - Next.js App Router
- **Async/Await** - асинхронная обработка запросов

---

## 💻 Языки программирования

### 1. **Python 3.11+**

#### Версии и использование:
- **Версия:** Python 3.11+ (рекомендуется)
- **Использование:**
  - Core Backend (`core-backend/`)
  - Shop Module Backend (`modules/shop/app/`)
  - Test Services (`test_services/`)
  - Скрипты миграций и утилиты

#### Особенности использования:
- **Асинхронное программирование:** `async/await`
- **Type hints:** полная типизация с использованием `typing`
- **Duck typing:** минимальное использование (предпочтение строгой типизации)

#### Ключевые библиотеки:
```python
# Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0

# Validation & Settings
pydantic==2.5.0
pydantic-settings==2.1.0

# Database ORM
sqlalchemy==2.0.23
alembic==1.12.1

# Async Database Drivers
asyncpg==0.29.0  # PostgreSQL async
psycopg2-binary==2.9.9  # PostgreSQL sync (для миграций)
aiosqlite==0.19.0  # SQLite async

# Security
python-jose[cryptography]==3.3.0
PyJWT==2.8.0
cryptography==41.0.7
bcrypt>=4.0.1,<4.1.0
passlib==1.7.4

# HTTP Client
httpx==0.24.1

# Utilities
python-dotenv==1.2.1
python-multipart==0.0.6
pyyaml==6.0.1
```

---

### 2. **TypeScript 5.3.3**

#### Версии и использование:
- **Версия:** TypeScript 5.3.3 (core-frontend), 5.2.2 (shop module)
- **Использование:**
  - Core Frontend (`core-frontend/`)
  - Shop Module Frontend (`modules/shop/frontend/`)
  - API Routes (Next.js)
  - React Components

#### Конфигурация TypeScript:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "incremental": true
  }
}
```

#### Особенности:
- **Строгая типизация:** `strict: true`
- **Incremental compilation:** для ускорения сборки
- **Module resolution:** bundler mode для Next.js
- **Isolation:** модули исключены из проверки типов ядра

---

### 3. **JavaScript (ES2020+)**

#### Использование:
- Конфигурационные файлы (Next.js config, Tailwind config)
- Build scripts в `package.json`
- Минимальное использование в runtime (только конфиги)

---

### 4. **SQL**

#### Диалекты:
- **PostgreSQL** - основная БД для production
- **SQLite** - для разработки и тестирования

#### Использование:
- Миграции Alembic
- Raw SQL в некоторых местах
- SQLAlchemy ORM (генерирует SQL автоматически)

---

### 5. **CSS / Tailwind CSS**

#### Использование:
- **Tailwind CSS 3.4.18** (core-frontend)
- **Tailwind CSS 4.1.17** (shop module frontend)
- **PostCSS 8.5.6**
- **Autoprefixer 10.4.22**

#### Особенности:
- Utility-first CSS
- Custom animations (`@keyframes`)
- Responsive design
- Dark mode support (потенциально)

---

### 6. **YAML**

#### Использование:
- Конфигурация модулей (`registry.yaml`)
- CI/CD конфигурации (потенциально)
- Docker Compose конфигурации

---

### 7. **JSON**

#### Использование:
- Package.json (Node.js зависимости)
- Module manifests (`module.json`)
- API responses
- Configuration files

---

### 8. **PowerShell**

#### Использование:
- Скрипты запуска (`start-*.ps1`)
- Скрипты развертывания
- Автоматизация задач

---

## 🔧 Backend стек

### 1. **Web Framework: FastAPI 0.104.1**

#### Описание:
Современный, быстрый веб-фреймворк для построения API на основе стандартов Python

#### Использование:
```python
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
```

#### Особенности:
- **Автоматическая документация:** OpenAPI/Swagger
- **Валидация данных:** Pydantic
- **Асинхронная поддержка:** нативная async/await
- **Dependency Injection:** система зависимостей
- **Типизация:** полная поддержка type hints

#### Структура API:
```
/api/v1/
  ├── auth/          # Аутентификация и регистрация
  ├── platform/      # Платформенные функции
  ├── modules/       # Управление модулями
  ├── dev/           # Dev-only endpoints
  └── ...
```

---

### 2. **ASGI Server: Uvicorn 0.24.0**

#### Описание:
Высокопроизводительный ASGI сервер на основе uvloop

#### Конфигурация:
```bash
uvicorn app.main:app --port 8000 --host 0.0.0.0 --reload
```

#### Особенности:
- **Hot reload:** автоматическая перезагрузка при изменениях
- **Production-ready:** с [standard] extras (включает uvloop)
- **Async support:** полная поддержка async/await
- **HTTP/1.1 и WebSocket:** поддержка обоих протоколов

---

### 3. **ORM: SQLAlchemy 2.0.23**

#### Описание:
Мощный Python SQL toolkit и ORM

#### Версия:
**SQLAlchemy 2.0** - современная версия с новым синтаксисом

#### Использование:
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
```

#### Особенности:
- **Async support:** `AsyncSession`, `create_async_engine`
- **Type hints:** полная поддержка типизации
- **New syntax:** `select(table)` вместо `select([table])`
- **Connection pooling:** автоматический пул соединений
- **Migrations:** интеграция с Alembic

#### Пример модели:
```python
class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True)
    phone = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
```

---

### 4. **Migrations: Alembic 1.12.1**

#### Описание:
Инструмент миграций БД для SQLAlchemy

#### Конфигурация:
- `alembic.ini` - основная конфигурация
- `alembic/versions/` - директория миграций
- `alembic/env.py` - конфигурация окружения

#### Использование:
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1
```

---

### 5. **Validation: Pydantic 2.5.0**

#### Описание:
Валидация данных с использованием Python type annotations

#### Использование:
```python
from pydantic import BaseModel, Field
from typing import Optional

class RegisterRequest(BaseModel):
    phone: str = Field(..., description="User phone number")
    code: str = Field(..., description="OTP verification code")
```

#### Особенности:
- **Type validation:** автоматическая валидация типов
- **JSON serialization:** автоматическая сериализация/десериализация
- **Settings management:** `pydantic-settings` для конфигурации
- **FastAPI integration:** нативная интеграция

---

### 6. **JWT Authentication: PyJWT 2.8.0**

#### Описание:
Реализация JSON Web Tokens для аутентификации

#### Использование:
```python
from app.utils.jwt import create_access_token, verify_token

token = create_access_token({"sub": str(user.id), "tenant": str(tenant.id)})
payload = verify_token(token)
```

#### Алгоритм:
- **HS256** - HMAC SHA-256
- **Access tokens:** короткое время жизни (15-30 минут)
- **Refresh tokens:** долгое время жизни (30 дней)

---

### 7. **Password Hashing: bcrypt & passlib**

#### Библиотеки:
- `bcrypt>=4.0.1,<4.1.0` - хеширование паролей
- `passlib==1.7.4` - библиотека для работы с хешами

#### Использование:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash(password)
is_valid = pwd_context.verify(password, hashed)
```

---

### 8. **HTTP Client: httpx 0.24.1**

#### Описание:
Асинхронный HTTP клиент для Python

#### Использование:
```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(url, json=data)
```

#### Особенности:
- **Async/await:** полностью асинхронный
- **HTTP/2 support:** поддержка HTTP/2
- **Connection pooling:** автоматический пул соединений
- **Timeouts:** встроенная поддержка таймаутов

---

### 9. **CORS: FastAPI CORS Middleware**

#### Конфигурация:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 10. **Custom Middleware**

#### Реализованные middleware:
1. **TenantMiddleware** - извлечение tenant_id из токена
2. **CorrelationIdMiddleware** - генерация correlation ID для запросов
3. **RequestContextMiddleware** - контекст запросов

---

## 🎨 Frontend стек

### 1. **Framework: Next.js 14.0.4**

#### Описание:
React-фреймворк для production с встроенным SSR и оптимизацией

#### Версия:
**Next.js 14** с App Router (новая архитектура)

#### Особенности:
- **App Router:** файловая система роутинга (`app/`)
- **Server Components:** серверные компоненты по умолчанию
- **Client Components:** `'use client'` директивы
- **API Routes:** встроенные API endpoints
- **Image Optimization:** автоматическая оптимизация изображений
- **Font Optimization:** оптимизация шрифтов

#### Структура:
```
app/
  ├── page.tsx              # Главная страница
  ├── layout.tsx            # Корневой layout
  ├── api/                  # API routes
  │   ├── auth/
  │   ├── modules/
  │   └── platform/
  ├── register/             # Страница регистрации
  ├── dashboard/            # Дашборд
  └── ...
```

---

### 2. **UI Library: React 18.2.0**

#### Описание:
Библиотека для построения пользовательских интерфейсов

#### Версия:
**React 18** с поддержкой:
- Concurrent features
- Server Components
- Automatic batching

#### Использование:
```typescript
'use client'

import { useState, useEffect } from 'react'

export default function Component() {
  const [state, setState] = useState()
  useEffect(() => { ... }, [])
  return <div>...</div>
}
```

---

### 3. **Styling: Tailwind CSS**

#### Версии:
- **Core Frontend:** Tailwind CSS 3.4.18
- **Shop Module:** Tailwind CSS 4.1.17 (более новая версия)

#### Конфигурация:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#00C742', dark: '#00B36C' },
        secondary: { DEFAULT: '#0082D6', light: '#007DE3' }
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'fade-in-up': 'fade-in-up 1s ease-out'
      }
    }
  }
}
```

#### Особенности:
- **Utility-first:** классы для стилизации
- **Responsive:** встроенная поддержка breakpoints
- **Custom animations:** кастомные keyframes
- **JIT mode:** Just-In-Time компиляция

---

### 4. **CSS Processing: PostCSS 8.5.6**

#### Конфигурация:
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### Плагины:
- **Tailwind CSS** - обработка Tailwind директив
- **Autoprefixer** - автоматическое добавление vendor prefixes

---

### 5. **Image/Slider: Swiper 11.0.5**

#### Описание:
Современный слайдер для React/Next.js

#### Использование:
```typescript
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
```

---

### 6. **Webpack Configuration**

#### Кастомная конфигурация:
```javascript
// next.config.js
webpack: (config, { isServer }) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@modules': path.resolve(__dirname, '../modules'),
  }
  return config
}
```

#### Особенности:
- **Module aliases:** `@modules` для динамических импортов
- **Runtime resolution:** модули загружаются в runtime
- **Type checking:** модули исключены из проверки типов

---

## 🗄️ Базы данных

### 1. **PostgreSQL (Production)**

#### Драйверы:
- **asyncpg 0.29.0** - асинхронный драйвер (основной)
- **psycopg2-binary 2.9.9** - синхронный драйвер (для миграций)

#### Использование:
```python
# Async connection
DATABASE_URL = "postgresql+asyncpg://user:pass@host/db"
engine = create_async_engine(DATABASE_URL)
```

#### Особенности:
- **Connection pooling:** автоматический пул соединений
- **Async support:** полностью асинхронный доступ
- **UUID support:** использование UUID для первичных ключей
- **JSON support:** хранение JSON данных

---

### 2. **SQLite (Development/Testing)**

#### Использование:
- **Test Services:** `test_services/core_stub/`, `test_services/module_service/`
- **Development:** альтернатива PostgreSQL для локальной разработки

#### Драйверы:
- **aiosqlite 0.19.0** - асинхронный драйвер SQLite
- **databases** - библиотека-обертка для работы с БД

#### Пример:
```python
DATABASE_URL = "sqlite:///./core_stub.db"
database = Database(DATABASE_URL)
```

---

### 3. **Database Models (SQLAlchemy)**

#### Основные модели:
1. **User** - пользователи системы
2. **Tenant** - арендаторы (клиенты)
3. **Subscription** - подписки на модули
4. **ModuleRegistry** - регистр модулей
5. **PlatformContent** - контент платформы
6. **DeletedAccountsHistory** - история удаленных аккаунтов

---

## 🛠️ Инструменты разработки

### 1. **Type Checking: TypeScript**

#### Конфигурация:
- `tsconfig.json` - конфигурация компилятора
- Строгий режим включен
- Исключение модулей из проверки типов

---

### 2. **Linting: ESLint**

#### Конфигурация:
```json
{
  "extends": ["next/core-web-vitals", "eslint:recommended"]
}
```

---

### 3. **Package Management: npm**

#### Использование:
- `package.json` - зависимости и скрипты
- `package-lock.json` - зафиксированные версии
- npm scripts для запуска и сборки

---

### 4. **Python Package Management: pip**

#### Использование:
- `requirements.txt` - зависимости Python
- `venv/` - виртуальные окружения
- pip для установки пакетов

---

### 5. **Environment Variables: python-dotenv**

#### Использование:
```python
from dotenv import load_dotenv
load_dotenv()
```

#### Переменные:
- `.env` - локальные переменные
- `.env.local` - локальные переменные (git-ignored)
- Pydantic Settings для валидации

---

### 6. **Version Control: Git**

#### Структура:
- Монorepo структура
- Модули как отдельные подпроекты

---

## 🚀 DevOps и развертывание

### 1. **Docker**

#### Файлы:
- `Dockerfile` - для core-backend и core-frontend
- `docker-compose.local.yml` - для локальной разработки

---

### 2. **Process Management**

#### Скрипты:
- `start-all.ps1` - запуск всех сервисов
- `start-backend.ps1` - запуск backend
- `start-frontend.ps1` - запуск frontend

---

### 3. **Ports Configuration**

#### Используемые порты:
- **8000** - Core Backend (FastAPI)
- **8001** - Shop Module Backend (FastAPI)
- **7000** - Core Frontend (Next.js) - Platform
- **7001** - Core Frontend (Next.js) - Auth/Dashboard
- **7002** - Core Frontend (Next.js) - Super Admin
- **5000** - Shop Module Frontend (Next.js)

---

## 🔒 Безопасность

### 1. **Authentication**

#### Методы:
- **JWT tokens** - основной метод аутентификации
- **OAuth2** - через FastAPI Security (потенциально)
- **Phone verification** - через OTP коды

---

### 2. **Password Security**

#### Хеширование:
- **bcrypt** - хеширование паролей
- **passlib** - обертка для работы с хешами

---

### 3. **JWT Security**

#### Реализация:
- **HS256** алгоритм
- **Secret key** из переменных окружения
- **Token expiration** - короткое время жизни access tokens
- **Refresh tokens** - для обновления access tokens

---

### 4. **CORS**

#### Конфигурация:
- Разрешенные origins из настроек
- Credentials включены
- Методы и заголовки настраиваемые

---

### 5. **SQL Injection Protection**

#### Защита:
- **SQLAlchemy ORM** - параметризованные запросы
- **No raw SQL** - использование ORM везде где возможно

---

## 🧪 Тестирование

### 1. **Python Testing: pytest**

#### Библиотеки:
- `pytest==7.4.0` - фреймворк тестирования
- `pytest-asyncio==0.22.0` - поддержка async тестов

#### Структура:
```
tests/
  ├── test_auth.py
  ├── test_tenant.py
  └── ...
```

---

### 2. **Test Services**

#### Реализация:
- **core_stub** - заглушка core backend для тестирования
- **module_service** - заглушка модуля для тестирования

#### Технологии:
- FastAPI
- SQLite (in-memory)
- httpx для межсервисного взаимодействия

---

## 📊 Мониторинг и логирование

### 1. **Logging: Python logging**

#### Конфигурация:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s [%(name)s] %(message)s'
)
logger = logging.getLogger(__name__)
```

---

### 2. **Metrics (Potential)**

#### Библиотеки:
- `prometheus-client==0.19.0` (в shop module requirements)
- `opentelemetry-api==1.21.0`
- `opentelemetry-sdk==1.21.0`

---

## 📦 Дополнительные технологии

### 1. **Background Jobs (Shop Module)**

#### Библиотеки:
- `celery==5.3.4` - распределенная очередь задач
- `redis==5.0.1` - брокер сообщений для Celery

---

### 2. **HTTP Clients**

#### Frontend:
- **Native Fetch API** - для HTTP запросов
- **Next.js API Routes** - прокси для backend

#### Backend:
- **httpx** - асинхронный HTTP клиент
- **aiohttp** - альтернативный async HTTP клиент (в shop module)

---

### 3. **YAML Processing**

#### Библиотека:
- `pyyaml==6.0.1` - парсинг YAML файлов

#### Использование:
- Конфигурация модулей (`registry.yaml`)
- Module manifests

---

### 4. **Multipart Form Data**

#### Библиотека:
- `python-multipart==0.0.6` - обработка multipart/form-data

---

## 🎯 Резюме технологического стека

### Backend:
- **Python 3.11+**
- **FastAPI 0.104.1** - веб-фреймворк
- **SQLAlchemy 2.0.23** - ORM
- **Alembic 1.12.1** - миграции
- **PostgreSQL** (production) / **SQLite** (dev/test)
- **Pydantic 2.5.0** - валидация
- **PyJWT 2.8.0** - аутентификация

### Frontend:
- **TypeScript 5.3.3**
- **Next.js 14.0.4** - React фреймворк
- **React 18.2.0** - UI библиотека
- **Tailwind CSS 3.4.18/4.1.17** - стилизация
- **Swiper 11.0.5** - слайдеры

### Инфраструктура:
- **Docker** - контейнеризация
- **Git** - контроль версий
- **npm** - менеджер пакетов Node.js
- **pip** - менеджер пакетов Python
- **PowerShell** - скрипты автоматизации

### Безопасность:
- **JWT** - токены
- **bcrypt** - хеширование паролей
- **CORS** - защита от межсайтовых запросов
- **SQL Injection Protection** - через ORM

### Тестирование:
- **pytest** - Python тесты
- **Test Services** - заглушки для интеграционного тестирования

---

## 📝 Версии ключевых зависимостей

### Python (Backend):
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
asyncpg==0.29.0
PyJWT==2.8.0
alembic==1.12.1
```

### Node.js (Frontend):
```
next@14.0.4
react@^18.2.0
typescript@^5.3.3
tailwindcss@^3.4.18
```

---

## 🔄 Интеграции

### Модульная система:
- **Module Registry** - регистрация модулей
- **SDK** - SDK для модулей
- **Webhooks** - взаимодействие между core и модулями
- **Internal API** - внутренние API для активации модулей

### Внешние сервисы (потенциально):
- **Telegram Bot API** - для регистрации через Telegram
- **SMS Service** - для отправки OTP кодов
- **Payment Gateway** - для платежей (будущее)

---

## 🎓 Заключение

Проект использует современный технологический стек с акцентом на:
- **Производительность** - async/await везде
- **Типизацию** - TypeScript и Python type hints
- **Модульность** - независимые модули
- **Безопасность** - JWT, bcrypt, CORS
- **Developer Experience** - hot reload, автоматическая документация API

Стек выбран для обеспечения масштабируемости, поддерживаемости и производительности SaaS-платформы.

---

**Документ создан автоматически на основе анализа кодовой базы проекта.**


