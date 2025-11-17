# 🐘 Запуск PostgreSQL локально

## Вариант 1: Через Docker (рекомендуется для разработки)

### 1. Установите Docker Desktop
Если Docker Desktop не установлен:
- Скачайте с https://www.docker.com/products/docker-desktop
- Установите и запустите Docker Desktop

### 2. Запустите PostgreSQL в Docker

```bash
docker run -d \
  --name postgres-platform \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=modular_saas_core \
  -p 5432:5432 \
  postgres:15
```

### 3. Проверьте, что контейнер запущен

```bash
docker ps
```

### 4. Подключитесь к базе данных

```bash
docker exec -it postgres-platform psql -U user -d modular_saas_core
```

---

## Вариант 2: Установка PostgreSQL на Windows

### 1. Скачайте PostgreSQL
- Перейдите на https://www.postgresql.org/download/windows/
- Скачайте установщик PostgreSQL

### 2. Установите PostgreSQL
- Запустите установщик
- Укажите пароль для пользователя `postgres`
- Порт по умолчанию: 5432
- Установите компоненты по умолчанию

### 3. Запустите службу PostgreSQL

Через PowerShell (от администратора):
```powershell
Start-Service postgresql-x64-15
```

Или через Services:
1. Откройте `services.msc`
2. Найдите службу PostgreSQL
3. Правой кнопкой → Start

### 4. Создайте базу данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE modular_saas_core;

# Создайте пользователя (если нужно)
CREATE USER "user" WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE modular_saas_core TO "user";

# Выйдите
\q
```

---

## Вариант 3: Использовать существующую установку

Если PostgreSQL уже установлен, но не запущен:

### Через PowerShell (от администратора):
```powershell
# Найти службу PostgreSQL
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# Запустить службу
Start-Service postgresql-x64-15
# или другое имя службы, если отличается
```

### Через командную строку (от администратора):
```cmd
net start postgresql-x64-15
```

---

## Проверка подключения

После запуска PostgreSQL проверьте подключение:

```bash
# Используя psql
psql -h localhost -U user -d modular_saas_core

# Или через Python скрипт
python core-backend/scripts/create_platform_master.py
```

---

## Настройка DATABASE_URL

Убедитесь, что переменная окружения `DATABASE_URL` настроена правильно:

**Для Docker:**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/modular_saas_core
```

**Для локальной установки:**
```bash
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/modular_saas_core
```

Или установите в `.env` файле в `core-backend/`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/modular_saas_core
```

---

## Быстрый старт (Docker)

```bash
# Запустить PostgreSQL
docker run -d --name postgres-platform -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=modular_saas_core -p 5432:5432 postgres:15

# Применить схему базы данных
psql -h localhost -U user -d modular_saas_core -f core-backend/app/db/schemas.sql

# Создать пользователя platform_master
psql -h localhost -U user -d modular_saas_core -f core-backend/scripts/create_platform_master.sql
```

---

## Остановка PostgreSQL

### Docker:
```bash
docker stop postgres-platform
docker rm postgres-platform
```

### Windows Service:
```powershell
Stop-Service postgresql-x64-15
```


