# Development Setup Guide

## Быстрый старт для локальной разработки

### 1. Backend (Core)

1. Перейдите в директорию backend:
   ```bash
   cd core-backend
   ```

2. Создайте виртуальное окружение:
   ```bash
   python -m venv venv
   ```

3. Активируйте виртуальное окружение:
   - Windows PowerShell: `.\venv\Scripts\Activate.ps1`
   - Windows CMD: `venv\Scripts\activate.bat`
   - Linux/Mac: `source venv/bin/activate`

4. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

5. Настройте переменные окружения:
   - Скопируйте `.env.example` в `.env`:
     ```bash
     cp .env.example .env
     ```
   - Отредактируйте `.env` и укажите свои значения для `DATABASE_URL`

6. Запустите PostgreSQL базу данных (если еще не запущена)

7. Выполните миграции:
   ```bash
   alembic upgrade head
   ```

8. Запустите сервер:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Или используйте:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

### 2. Frontend (Core)

1. Перейдите в директорию frontend:
   ```bash
   cd core-frontend
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Настройте переменные окружения:
   - Скопируйте `.env.example` в `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Убедитесь, что `BACKEND_URL` указывает на `http://localhost:8000`

4. Запустите dev-сервер:
   - Публичная платформа (порт 7000):
     ```bash
     npm run dev
     ```
   - Авторизация и дашборд (порт 7001):
     ```bash
     npm run dev:auth
     ```
   - Super-admin (порт 7002):
     ```bash
     npm run dev:admin
     ```

### 3. Модуль Shop (опционально)

#### Backend модуля:

1. Перейдите в директорию:
   ```bash
   cd modules/shop/backend
   ```

2. Создайте виртуальное окружение:
   ```bash
   python -m venv venv
   ```

3. Активируйте виртуальное окружение

4. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

5. Настройте `.env` (скопируйте из `.env.example`)

6. Запустите сервер:
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```

#### Frontend модуля:

1. Перейдите в директорию:
   ```bash
   cd modules/shop/frontend
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Настройте `.env.local` (скопируйте из `.env.example`)

4. Запустите dev-сервер:
   ```bash
   npm run dev
   ```

## Переменные окружения

### Core Backend (.env)

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/tochkarosta_core
JWT_SECRET_KEY=your-secret-key-at-least-32-characters-long
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:7000,http://localhost:7001,http://localhost:7002
```

### Core Frontend (.env.local)

```bash
BACKEND_URL=http://localhost:8000
```

## Dev-режим

### Dev-login

Для быстрого входа в dev-режиме используйте:
- Endpoint: `POST /api/v1/auth/dev-login`
- Возвращает временный JWT токен с `tenant_id`

### Сохранение tenant_id

После регистрации `tenant_id` автоматически сохраняется в `.env.local` через:
- Endpoint: `POST /api/dev/save-tenant-id`

## Порты

- **7000**: Публичная платформа (core-frontend)
- **7001**: Авторизация и дашборд (core-frontend)
- **7002**: Super-admin (core-frontend)
- **8000**: Core Backend API
- **8001**: Shop Module Backend
- **5000**: Shop Module Frontend

## Troubleshooting

### Backend не запускается

1. Проверьте, что PostgreSQL запущен
2. Проверьте `DATABASE_URL` в `.env`
3. Убедитесь, что порт 8000 свободен

### Frontend не запускается

1. Проверьте, что Node.js установлен
2. Убедитесь, что порты 7000/7001/7002 свободны
3. Проверьте `BACKEND_URL` в `.env.local`

### API routes возвращают 404

1. Перезапустите Next.js dev-сервер
2. Проверьте, что backend запущен на порту 8000
3. Проверьте `BACKEND_URL` в `.env.local`

## Дополнительно

- Для Redis (опционально): установите `REDIS_URL` в `.env`
- Для production: установите `ENVIRONMENT=production` и используйте сильный `JWT_SECRET_KEY`


