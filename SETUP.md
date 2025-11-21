# Инструкция по настройке проекта

## Шаг 1: Установка зависимостей системы

### PostgreSQL и Redis (через Docker)

```bash
# Запустить PostgreSQL и Redis
docker-compose up -d

# Проверить статус
docker-compose ps
```

Или установите PostgreSQL и Redis локально.

## Шаг 2: Backend Setup

```bash
cd core-backend

# Создать виртуальное окружение
python -m venv venv

# Активировать (Windows)
venv\Scripts\activate

# Активировать (Linux/Mac)
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Проверить .env файл (уже создан)
# При необходимости отредактируйте настройки БД

# Инициализировать Alembic (если еще не сделано)
alembic init alembic  # Только если папки alembic нет

# Создать первую миграцию
alembic revision --autogenerate -m "init"

# Применить миграции
alembic upgrade head

# Инициализировать тарифы (опционально)
python -m app.modules.billing.init_data

# Запустить сервер
python -m uvicorn app.main:app --reload
```

Backend будет доступен на:
- API: http://localhost:8000
- Документация: http://localhost:8000/docs
- Health: http://localhost:8000/health

## Шаг 3: Frontend Setup

```bash
cd core-frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Frontend будет доступен на: http://localhost:7000

## Шаг 4: Gateway Setup

```bash
cd gateway

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Gateway будет доступен на: http://localhost:3000

## Проверка работоспособности

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Gateway Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Проверка API документации:**
   Откройте в браузере: http://localhost:8000/docs

## Тестирование регистрации

1. Откройте http://localhost:7000
2. Введите номер телефона
3. Проверьте консоль backend - там будет OTP код
4. Введите код и завершите регистрацию

## Troubleshooting

### Ошибка подключения к БД
- Убедитесь, что PostgreSQL запущен: `docker-compose ps`
- Проверьте настройки в `.env` файле
- Проверьте, что БД `core_db` создана

### Ошибка импорта модулей
- Убедитесь, что виртуальное окружение активировано
- Проверьте, что все зависимости установлены: `pip list`

### Проблемы с миграциями
- Удалите папку `alembic/versions` (кроме .gitkeep)
- Создайте новую миграцию: `alembic revision --autogenerate -m "init"`
- Примените: `alembic upgrade head`



