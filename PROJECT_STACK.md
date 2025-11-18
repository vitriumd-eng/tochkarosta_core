# Tochka Rosta - Технологический стек проекта

## Среда разработки PowerShell
- **ОС**: Windows 10 (build 26100)
- **Shell**: PowerShell 7 (`C:\Program Files\PowerShell\7\pwsh.exe`)
- **Рабочая директория**: `D:\tochkarosta_core`

## Языки программирования

### Backend
- **Python 3.11+** - основной язык backend
- **SQL** - запросы к БД, миграции Alembic

### Frontend
- **TypeScript** - основной язык frontend
- **TSX/JSX** - React компоненты

### Gateway
- **TypeScript** - gateway service

### Скрипты
- **PowerShell (.ps1)** - скрипты для запуска и настройки
- **Bash (.sh)** - скрипты для миграций и тестов

## Расширения файлов

### Backend
- `.py` - Python модули и скрипты
- `.sql` - SQL запросы и схемы
- `.yaml/.yml` - конфигурации (Alembic, OpenAPI)
- `.ini` - конфигурации (alembic.ini, pytest.ini)
- `.md` - документация

### Frontend
- `.ts` - TypeScript файлы
- `.tsx` - TypeScript React компоненты
- `.js` - JavaScript файлы (конфиги)
- `.json` - конфигурации (package.json, tsconfig.json)
- `.css` - стили (Tailwind)
- `.svg` - иконки и графика

### Gateway
- `.ts` - TypeScript файлы
- `.json` - конфигурации

### Скрипты
- `.ps1` - PowerShell скрипты
- `.sh` - Bash скрипты

## Технологический стек

### Backend (core-backend/)
- **FastAPI 0.104.1** - веб-фреймворк
- **Uvicorn 0.24.0** - ASGI сервер
- **SQLAlchemy 2.0.23** (async) - ORM
- **Alembic 1.12.1** - миграции БД
- **PostgreSQL** - основная БД (asyncpg 0.29.0)
- **Pydantic 2.5.0** - валидация данных
- **Pydantic Settings 2.1.0** - настройки приложения
- **JWT** (python-jose 3.3.0, PyJWT 2.8.0) - аутентификация
- **httpx 0.24.1** - асинхронный HTTP клиент
- **bcrypt 4.0.1** - хеширование паролей
- **python-dotenv 1.2.1** - переменные окружения
- **cryptography 41.0.7** - криптография
- **passlib 1.7.4** - управление паролями
- **psycopg2-binary 2.9.9** - драйвер PostgreSQL
- **pyyaml 6.0.1** - работа с YAML
- **python-multipart 0.0.6** - обработка multipart данных
- **aiosqlite 0.19.0** - SQLite для тестов

### Frontend (core-frontend/)
- **Next.js 14.0.4** - React фреймворк
- **React 18.2.0** - UI библиотека
- **React DOM 18.2.0** - рендеринг React
- **TypeScript 5.3.3** - типизация
- **Tailwind CSS 3.4.18** - стилизация
- **Swiper 11.0.5** - слайдеры
- **PostCSS 8.5.6** - обработка CSS
- **Autoprefixer 10.4.22** - автопрефиксы CSS
- **cross-env 10.1.0** - кроссплатформенные переменные окружения
- **ESLint 8.56.0** - линтинг кода
- **eslint-config-next 14.0.4** - конфигурация ESLint для Next.js

### Gateway (gateway/)
- **Node.js 18**
- **Express** - веб-сервер
- **TypeScript**

### База данных
- **PostgreSQL** - основная БД
- **Redis** (опционально) - кэш, верификация кодов

### Инфраструктура
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация
- **Alembic** - миграции БД

### Инструменты разработки
- **Git** - контроль версий
- **PowerShell 7** - скрипты автоматизации
- **pytest 7.4.0** - тестирование Python
- **pytest-asyncio 0.22.0** - асинхронное тестирование
- **ESLint 8.56.0** - линтинг TypeScript
- **TypeScript Compiler (tsc)** - компиляция TypeScript
- **Node.js** - runtime для frontend и gateway
- **npm** - менеджер пакетов Node.js
- **pip** - менеджер пакетов Python

### Внешние сервисы
- **Telegram Bot API** - отправка OTP кодов
- **VK OAuth** - авторизация через VK
- **MAX API** - отправка OTP кодов (планируется)

## Модули и библиотеки

### Backend модули (core-backend/app/)

#### API Routes (`app/api/v1/routes/`)
- `auth.py` - аутентификация (send-code, verify, dev-login, request_code, confirm_code)
- `auth_oauth.py` - OAuth (Telegram, MAX, VK)
- `tenants.py` - управление тенантами
- `modules.py` - управление модулями
- `subscriptions.py` - подписки
- `platform.py` - платформенный контент
- `users.py` - управление пользователями
- `super_admin.py` - супер-админ панель
- `dev.py` - dev-инструменты

#### Services (`app/services/`)
- `auth.py` - сервис аутентификации
- `auth_service.py` - OAuth сервис
- `tenant.py` - сервис тенантов
- `subscription.py` - сервис подписок
- `verification.py` - верификация кодов (OTP)
- `telegram_service.py` - отправка через Telegram Bot API
- `sms.py` - SMS сервис
- `user_service.py` - сервис пользователей
- `platform_content.py` - контент платформы
- `module_loader.py` - загрузка модулей

#### Models (`app/models/`)
- `user.py` - модель пользователя
- `tenant.py` - модель тенанта
- `subscription.py` - модель подписки
- `module_registry.py` - реестр модулей
- `module_settings.py` - настройки модулей
- `tenant_domain.py` - домены тенантов
- `platform_content.py` - контент платформы
- `deleted_accounts_history.py` - история удаленных аккаунтов
- `user_external_account.py` - внешние аккаунты (OAuth)
- `roles.py` - роли пользователей

#### Schemas (`app/schemas/`)
- `auth.py` - схемы аутентификации
- `user.py` - схемы пользователя
- `tenant.py` - схемы тенанта
- `module.py` - схемы модулей

#### Middleware (`app/middleware/`)
- `tenant.py` - middleware для тенантов
- `correlation.py` - correlation ID
- `request_context.py` - контекст запроса

#### Utils (`app/utils/`)
- `jwt.py` - работа с JWT токенами
- `hashing.py` - хеширование
- `module_loader.py` - загрузка модулей
- `retry.py` - повторные попытки
- `webhook_idempotency.py` - идемпотентность webhooks

#### Core (`app/core/`)
- `config.py` - конфигурация приложения
- `security.py` - безопасность
- `settings_schema.py` - схема настроек

#### Modules (`app/modules/`)
- `registry.py` - реестр модулей
- `sdk.py` - SDK для модулей
- `registry.yaml` - конфигурация реестра

### Frontend модули (core-frontend/)

#### API Routes (`app/api/`)
- `auth/*` - аутентификация (request-code, send-code, verify, oauth, dev-login)
- `modules/*` - модули (list, subscription, switch, tenant-info)
- `platform/*` - платформа (content, login, logout)
- `super-admin/*` - супер-админ (login, logout, tariffs, users)

#### Components (`app/components/`)
- `platform/*` - компоненты платформы (Hero, Stats, Features, Pricing, CTA, etc.)
- `PlatformDashboardSidebar.tsx` - сайдбар дашборда

#### Lib (`lib/`)
- `api/register.ts` - клиент регистрации
- `modules/*` - загрузка модулей
- `dtos/*` - типы данных

### Gateway модули (gateway/)
- `src/index.ts` - Express сервер (forwarding запросов к core)

## Стандартные библиотеки Python
- `asyncio` - асинхронное программирование
- `logging` - логирование
- `os` - работа с ОС
- `uuid` - генерация UUID
- `datetime` - работа с датами
- `typing` - типизация
- `pathlib` - работа с путями
- `json` - работа с JSON
- `hashlib` - хеширование
- `time` - работа со временем
- `random` - генерация случайных чисел

## Стандартные библиотеки TypeScript/Node.js
- `fs` - файловая система
- `path` - работа с путями
- `http` / `https` - HTTP клиент
- `url` - работа с URL
- `crypto` - криптография

## Структура проекта
```
tochkarosta_core/
├── core-backend/     # Python FastAPI backend
│   ├── app/          # Приложение
│   ├── alembic/      # Миграции БД
│   ├── tests/        # Тесты
│   └── scripts/      # Скрипты
├── core-frontend/    # Next.js frontend
│   ├── app/          # Next.js App Router
│   ├── components/   # React компоненты
│   └── lib/          # Утилиты и клиенты
├── gateway/          # Node.js Express gateway
├── modules/          # Модули проекта (shop, etc.)
├── module_template/ # Шаблон модуля
├── scripts/         # Bash скрипты
├── docs/            # Документация
└── .cursor/         # Правила для Cursor AI
```

