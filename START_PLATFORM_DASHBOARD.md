# 🚀 Запуск Platform Dashboard

## ✅ Серверы запущены

Backend и Frontend серверы запущены в фоновом режиме.

- **Backend API**: http://localhost:8000
- **Platform Dashboard**: http://localhost:7001/platform-dashboard/login

## 📋 Следующие шаги

### 1. Создать пользователя platform_master

**Важно:** База данных должна быть запущена и доступна.

#### Вариант 1: Через PostgreSQL CLI

```bash
psql -d modular_saas_core -f core-backend/scripts/create_platform_master.sql
```

#### Вариант 2: Через Python скрипт

```bash
cd core-backend
python scripts/create_platform_master.py
```

#### Вариант 3: Вручную через SQL

Подключитесь к PostgreSQL и выполните:

```sql
INSERT INTO users (id, phone, password_hash, role, phone_verified, tenant_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '89535574133',
    '$2b$12$/SSg7PUfMpMrY61dwG..c.uBu9YAQeXZ0jf7DVV8T2HUAIeXtS1q.',
    'platform_master',
    TRUE,
    NULL,
    now(),
    now()
)
ON CONFLICT (phone) DO UPDATE
SET 
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = now();
```

### 2. Войти в дашборд

Откройте браузер и перейдите по адресу:
**http://localhost:7001/platform-dashboard/login**

**Учетные данные:**
- **Login**: `89535574133`
- **Password**: `Tehnologick987`

## 🔧 Если серверы не запустились

### Запустить Backend вручную:

```bash
cd core-backend
uvicorn app.main:app --reload --port 8000
```

### Запустить Frontend вручную:

```bash
cd core-frontend
npm run dev:auth
```

Или:

```bash
cd core-frontend
next dev -p 7001
```

## 📚 Документация

- Подробная инструкция: `core-frontend/app/platform-dashboard/SETUP.md`
- Скрипты: `core-backend/scripts/README.md`


