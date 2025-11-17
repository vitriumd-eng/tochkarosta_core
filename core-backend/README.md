# TochkaRosta Core Backend

**Версия:** 1.0.0  
**Технологии:** FastAPI + async SQLAlchemy + PostgreSQL

---

## Описание

Ядро платформы TochkaRosta - модульная SaaS платформа с мультитенантностью и системой модулей.

---

## Быстрый старт

### 1. Установка зависимостей

```bash
cd core-backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
```

### 2. Настройка базы данных

Скопируйте `.env.example` в `.env` и настройте:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/modular_saas_core
JWT_SECRET_KEY=your-secret-key-here-minimum-32-characters-long
```

Подробнее см. `SETUP_DATABASE.md`.

### 3. Применение миграций

```bash
alembic upgrade head
```

### 4. Создание пользователя platform_master

```bash
python -m app.db.autoseed
```

### 5. Запуск backend

```bash
python -m uvicorn app.main:app --reload
```

Или используйте Makefile:

```bash
make run
```

Backend будет доступен на `http://localhost:8000`

---

## Структура проекта

```
core-backend/
├── app/
│   ├── api/v1/routes/    # API endpoints
│   ├── core/             # Конфигурация и безопасность
│   ├── db/               # База данных и сессии
│   ├── models/           # SQLAlchemy модели
│   ├── schemas/          # Pydantic схемы
│   ├── services/         # Бизнес-логика
│   ├── middleware/       # Middleware
│   └── modules/          # Система модулей
├── alembic/              # Миграции базы данных
├── tests/                # Тесты
├── Dockerfile            # Docker образ
├── docker-compose.local.yml  # Docker Compose для локальной разработки
└── requirements.txt      # Python зависимости
```

---

## API Endpoints

- `/api/v1/auth` - Аутентификация
- `/api/v1/tenants` - Управление тенантами
- `/api/v1/subscriptions` - Управление подписками
- `/api/v1/modules` - Управление модулями
- `/api/v1/platform` - Платформенный дашборд

Swagger документация: `http://localhost:8000/docs`

---

## Команды Makefile

```bash
make install    # Установить зависимости
make test       # Запустить тесты
make run        # Запустить сервер разработки
make migrate    # Создать новую миграцию
make upgrade    # Применить миграции
make seed       # Заполнить БД начальными данными
make clean      # Очистить кэш и временные файлы
```

---

## Docker

### Локальная разработка

```bash
docker-compose -f docker-compose.local.yml up
```

Это запустит:
- PostgreSQL на порту 5432
- Backend на порту 8000

---

## Тестирование

```bash
pytest -v
```

Или через Makefile:

```bash
make test
```

---

## Документация

- `START.md` - Инструкция по запуску
- `SETUP_DATABASE.md` - Настройка базы данных
- `DEPLOYMENT.md` - Развертывание
- `FULL_CODE_AUDIT.md` - Полный аудит проекта
- `COMPLIANCE_REPORT.md` - Отчет о соответствии правилам

---

## Лицензия

Проприетарная лицензия





