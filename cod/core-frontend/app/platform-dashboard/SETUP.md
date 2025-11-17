# Platform Dashboard Setup

## 🚀 Быстрый старт

### 1. Создать пользователя platform_master

**Вариант 1: SQL скрипт (рекомендуется)**

После запуска PostgreSQL, выполните:

```bash
psql -d modular_saas_core -f core-backend/scripts/create_platform_master.sql
```

Или подключитесь к PostgreSQL и выполните:

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

**Вариант 2: Python скрипт**

```bash
cd core-backend
python -m scripts.create_platform_master
```

*Примечание: Требуется запущенная база данных*

### 2. Запустить backend сервер

```bash
cd core-backend
uvicorn app.main:app --reload --port 8000
```

### 3. Запустить frontend на порту 7001

```bash
cd core-frontend
npm run dev:auth
```

Или:

```bash
cd core-frontend
next dev -p 7001
```

### 4. Открыть дашборд

Перейдите по адресу: **http://localhost:7001/platform-dashboard/login**

**Учетные данные:**
- Login: `89535574133`
- Password: `Tehnologick987`

## 📋 Структура

```
core-frontend/app/platform-dashboard/
├── layout.tsx              # Layout для platform-dashboard
├── login/page.tsx          # Страница входа
├── page.tsx                # Главная страница дашборда
└── sections/[key]/page.tsx # Редактор секций контента
```

## 🔐 API Endpoints

- `POST /api/platform/login` - Вход в дашборд
- `GET /api/platform/content` - Получить весь контент
- `PUT /api/platform/content/{key}` - Обновить секцию контента

## ✅ Готово!

После выполнения всех шагов, дашборд будет доступен на **http://localhost:7001/platform-dashboard**


