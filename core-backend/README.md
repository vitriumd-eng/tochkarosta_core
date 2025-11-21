# Core Backend - Tochka Rosta

Ядро платформы "Точка Роста" - управление пользователями, tenants, тарифами и подписками.

## Технологии

- **FastAPI** 0.109.0 - Асинхронный веб-фреймворк
- **SQLAlchemy** 2.0.25 - ORM с поддержкой async
- **PostgreSQL** - База данных (AsyncPG)
- **Alembic** - Миграции БД
- **Pydantic** 2.6.0 - Валидация данных
- **JWT** - Аутентификация

## Структура модулей

### `app/core/`
- `config.py` - Настройки приложения
- `db.py` - Базовые классы моделей
- `database.py` - Сессия БД

### `app/models/`
- `user.py` - Модель пользователя
- `tenant.py` - Модель tenant (бизнес-единицы)

### `app/modules/auth/`
- Аутентификация и регистрация
- JWT токены
- OTP коды (в DEV режиме выводятся в консоль)

### `app/modules/tenants/`
- Управление tenants
- Получение информации о текущем tenant

### `app/modules/billing/`
- Тарифы (Tariff)
- Подписки (Subscription)

## Переменные окружения

Создайте файл `.env` в корне `core-backend/`:

```env
PROJECT_NAME="Tochka Rosta Core"
VERSION="2.0.0"
ENVIRONMENT="local"
DEV_MODE=True

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=core_db
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/core_db

REDIS_URL=redis://localhost:6379/0

SECRET_KEY=DEV_SECRET_CHANGE_IN_PROD_12345
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ALGORITHM=HS256
```

## Запуск

```bash
# Установка зависимостей
pip install -r requirements.txt

# Применение миграций
alembic upgrade head

# Запуск сервера
python -m uvicorn app.main:app --reload
```

Сервер будет доступен на `http://localhost:8000`

API документация: `http://localhost:8000/docs`



