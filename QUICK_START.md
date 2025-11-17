# Быстрый запуск системы

## Архитектура

Система состоит из трех независимых компонентов:
1. **PostgreSQL** (в Docker) - база данных
2. **Бэкенд** (FastAPI) - API сервер на Python
3. **Фронтенд** (Next.js) - веб-интерфейс на Node.js

## Автоматический запуск

### Вариант 1: Полная настройка (рекомендуется)
```powershell
.\setup-postgres.ps1
```

Затем в **отдельных терминалах**:
```powershell
# Терминал 1: Бэкенд
.\start-backend.ps1

# Терминал 2: Фронтенд
.\start-frontend.ps1
```

### Вариант 2: Все в одном (только настройка)
```powershell
.\start-all.ps1
```

После выполнения скрипта запустите бэкенд и фронтенд вручную в отдельных терминалах.

## Ручной запуск

### 1. PostgreSQL (Docker)

```powershell
# Запустить контейнер
docker run -d --name postgres-platform `
  -e POSTGRES_USER=user `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=modular_saas_core `
  -p 5432:5432 `
  postgres:15

# Применить схему
$env:PGPASSWORD = "password"
psql -h localhost -U user -d modular_saas_core -f core-backend\app\db\schemas.sql

# Создать platform_master пользователя
psql -h localhost -U user -d modular_saas_core -f core-backend\scripts\create_platform_master.sql
```

### 2. Бэкенд (FastAPI)

```powershell
cd core-backend

# Создать виртуальное окружение (если нужно)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Установить зависимости
pip install -r requirements.txt

# Запустить сервер
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

Бэкенд будет доступен на: http://localhost:8000
API документация: http://localhost:8000/docs

### 3. Фронтенд (Next.js)

```powershell
cd core-frontend

# Установить зависимости (если нужно)
npm install

# Запустить dev сервер
npm run dev
```

Фронтенд будет доступен на: http://localhost:3000
Dashboard: http://localhost:3000/platform-dashboard/login

## Учетные данные для входа

**Platform Master:**
- Логин: `89535574133`
- Пароль: `Tehnologick987`

## Проверка работы

1. PostgreSQL: `docker ps` - должен быть запущен контейнер `postgres-platform`
2. Бэкенд: откройте http://localhost:8000/docs - должна открыться документация API
3. Фронтенд: откройте http://localhost:3000 - должна открыться главная страница

## Остановка

```powershell
# Остановить PostgreSQL
docker stop postgres-platform

# Остановить бэкенд: нажмите Ctrl+C в терминале
# Остановить фронтенд: нажмите Ctrl+C в терминале
```

## Устранение проблем

### PostgreSQL не запускается
- Убедитесь, что Docker Desktop запущен
- Проверьте, что порт 5432 не занят: `netstat -ano | findstr :5432`

### Бэкенд не может подключиться к БД
- Проверьте, что PostgreSQL контейнер запущен: `docker ps`
- Проверьте подключение: `psql -h localhost -U user -d modular_saas_core`

### Ошибки при установке зависимостей
- Бэкенд: убедитесь, что используете Python 3.8+
- Фронтенд: убедитесь, что используете Node.js 18+

