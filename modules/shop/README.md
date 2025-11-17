# Shop Module

Модуль интернет-магазина для платформы "точка роста".

## Структура

Модуль следует обязательной структуре согласно `module_rul.md`:

- `app/api/v1/` - API endpoints (public, account, dashboard, webhooks)
- `app/core/` - Конфигурация и SDK интеграция
- `app/domain/` - Бизнес-логика (entities, services, exceptions)
- `app/application/` - Use cases, commands, queries
- `app/infrastructure/` - DB, cache, payments, email
- `app/ai/` - AI генерация контента
- `app/seo/` - SEO оптимизация
- `app/licensing/` - Лицензирование
- `app/security/` - Аутентификация и безопасность
- `app/workers/` - Фоновые воркеры
- `tests/` - Тесты
- `docker/` - Docker конфигурация

## Локальная разработка

```bash
# Установка зависимостей
pip install -r requirements.txt

# Запуск локально
uvicorn app.main:app --reload --port 8001
```

## Docker

```bash
docker-compose -f docker/docker-compose.local.yml up
```

## Правила копирования

Правила копирования: только дизайн (UI), без логики и взаимосвязей



