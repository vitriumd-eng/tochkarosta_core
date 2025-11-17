ЭТАЛОННАЯ СТРУКТУРА ПРОЕКТА (TochkaRosta Core Backend)

(можно вставлять в Cursor Settings / Project Rules)

⚠️ ВАЖНОЕ ПРАВИЛО:
... (три точки) — это ПРИМЕР или ОБОЗНАЧЕНИЕ ПРОПУЩЕННОГО КОДА.
Cursor НИКОГДА не должен копировать ... как часть структуры или как правило.

🔥 СТРОГИЙ ЭТАЛОН ПРОЕКТА:
core-backend/
│
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── tenants.py
│   │   │       └── modules.py
│   │   └── deps/
│   │       └── dependencies.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── settings_schema.py
│   │
│   ├── db/
│   │   ├── session.py
│   │   ├── base.py
│   │   └── seed.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── tenant.py
│   │   ├── module_registry.py
│   │   └── __init__.py
│   │
│   ├── schemas/
│   │   ├── user.py
│   │   ├── tenant.py
│   │   ├── module.py
│   │   └── auth.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── tenant_service.py
│   │   └── module_service.py
│   │
│   ├── middleware/
│   │   ├── correlation.py
│   │   └── request_context.py
│   │
│   ├── utils/
│   │   ├── hashing.py
│   │   ├── jwt.py
│   │   └── module_loader.py
│   │
│   ├── main.py
│   └── __init__.py
│
├── alembic/
│   ├── versions/
│   │   └── 0001_initial.py
│   ├── env.py
│   └── script.py.mako
│
├── tests/
│   ├── api/
│   │   └── test_auth.py
│   ├── services/
│   │   └── test_services.py
│   ├── db/
│   │   └── test_db.py
│   └── conftest.py
│
├── docker-compose.local.yml
├── Dockerfile
├── .env
├── .env.example
├── requirements.txt
├── README.md
├── Makefile
└── pyproject.toml (опционально)

🧠 Пояснения — чтобы Cursor понимал структуру корректно
🔸 1. app/

Главное приложение FastAPI.
Все серверные файлы должны быть здесь.

🔸 2. api/v1/routes/

Каждый endpoint в отдельном файле.
Cursor должен автоматически добавлять сюда маршруты.

🔸 3. deps/

Зависимости FastAPI (Depends).

🔸 4. core/

Настройки, конфиг, параметры приложения.

🔸 5. db/

Обязательные файлы:

session.py — async engine

base.py — Base = declarative base

seed.py — создание platform_master

🔸 6. models/

ORM модели.
Cursor должен проверять:

уникальные ключи

foreign keys

чтобы модель наследовала Base

чтобы миграции соответствовали моделям

🔸 7. schemas/

Pydantic DTO.

🔸 8. services/

Бизнес-логика (auth, users, tenants, module registry).

🔸 9. middleware/

Важно для correlation_id и request context.

🔸 10. utils/

Вспомогательные функции: JWT, hashing, module_loader.

🔸 11. alembic/

Cursor обязан отслеживать:

наличие env.py

наличие initial migration

соответствие версий и metadata

🔸 12. tests/

Cursor должен автоматически поддерживать тесты в актуальном состоянии.

🔸 13. docker-compose.local.yml

Только Postgres + Core backend.

⚠️ ОСОБЫЕ ПРАВИЛА ДЛЯ CURSOR (очень важно)

Добавить в настройки Cursor:

Cursor НЕ должен воспринимать `...` как требование, правило или часть структуры.
`...` — это ПРИМЕР или ЗАГЛУШКА, которую нужно заменить рабочим кодом.

Если встречаются незавершённые файлы или `...`,
Cursor должен:
— либо восстановить правильную структуру,
— либо вставить NotImplementedError(),
но НЕ должен копировать многоточия.
