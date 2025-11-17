# НАСТРОЙКА БАЗЫ ДАННЫХ

## Критическая настройка: DATABASE_URL

### Проблема

В файле `core-backend/.env` параметр `DATABASE_URL` содержит placeholder значения:
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/modular_saas_core
```

Это **НЕ РАБОТАЕТ** для реального подключения к PostgreSQL.

---

## Решение

### 1. Убедитесь, что PostgreSQL запущен

```bash
# Windows (PowerShell)
Get-Service -Name postgresql*

# Linux/macOS
sudo systemctl status postgresql
```

### 2. Узнайте учетные данные PostgreSQL

**Если PostgreSQL установлен локально:**
- **Пользователь:** обычно `postgres` или ваш системный пользователь
- **Пароль:** пароль, который вы установили при установке PostgreSQL
- **Порт:** обычно `5432`
- **База данных:** `modular_saas_core` (нужно создать)

### 3. Создайте базу данных

**Вариант A: Через psql (командная строка)**
```bash
# Подключитесь к PostgreSQL
psql -U postgres

# В psql выполните:
CREATE DATABASE modular_saas_core;
\q
```

**Вариант B: Через Python скрипт**
```python
# scripts/create_database.py
import asyncio
import asyncpg

async def create_database():
    # Подключитесь к базе postgres для создания новой БД
    conn = await asyncpg.connect(
        host='localhost',
        port=5432,
        user='postgres',
        password='ВАШ_ПАРОЛЬ',
        database='postgres'
    )
    
    # Проверьте, существует ли база
    exists = await conn.fetchval(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        'modular_saas_core'
    )
    
    if not exists:
        # Создайте базу данных
        await conn.execute('CREATE DATABASE modular_saas_core')
        print("Database 'modular_saas_core' created successfully!")
    else:
        print("Database 'modular_saas_core' already exists!")
    
    await conn.close()

if __name__ == "__main__":
    asyncio.run(create_database())
```

### 4. Обновите .env файл

Откройте `core-backend/.env` и замените строку:

**БЫЛО:**
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/modular_saas_core
```

**СТАЛО:**
```env
DATABASE_URL=postgresql+asyncpg://postgres:ВАШ_РЕАЛЬНЫЙ_ПАРОЛЬ@localhost:5432/modular_saas_core
```

**Важно:**
- Замените `postgres` на вашего пользователя PostgreSQL (если другой)
- Замените `ВАШ_РЕАЛЬНЫЙ_ПАРОЛЬ` на реальный пароль
- Убедитесь, что формат: `postgresql+asyncpg://` (не просто `postgresql://`)

### 5. Примените миграции

```bash
cd core-backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/macOS

# Применить миграции
alembic upgrade head

# Создать platform_master пользователя
python -m app.db.autoseed
```

### 6. Проверьте подключение

```bash
# Запустите backend
python -m uvicorn app.main:app --reload

# Проверьте health endpoint
curl http://localhost:8000/health
```

---

## Альтернатива: Использование Docker

Если у вас установлен Docker, можно использовать готовый контейнер PostgreSQL:

```bash
# Запустить PostgreSQL в Docker
docker run -d \
  --name modular-saas-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=modular_saas_core \
  -p 5432:5432 \
  postgres:15

# Обновить .env
DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/modular_saas_core
```

---

## Проверка настроек

### Тест подключения к БД

```python
# test_db_connection.py
import asyncio
from app.db.session import AsyncSessionLocal
from sqlalchemy import text

async def test_connection():
    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
```

```bash
python test_db_connection.py
```

---

## Безопасность

⚠️ **ВАЖНО:** Файл `.env` содержит секретные данные. Убедитесь, что:
1. `.env` находится в `.gitignore`
2. Не коммитьте `.env` в Git
3. В production используйте переменные окружения или secrets manager

---

## После исправления

1. Перезапустите backend
2. Проверьте логи на наличие ошибок подключения к БД
3. Попробуйте войти в дашборд: `http://localhost:7000/platform-dashboard/login`





