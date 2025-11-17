# РУКОВОДСТВО ПО РАЗВЕРТЫВАНИЮ

## Требования

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Docker (опционально)

---

## Локальное развертывание

### 1. Настройка Backend

```bash
cd core-backend

# Создать виртуальное окружение
python -m venv venv

# Активировать venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/macOS

# Установить зависимости
pip install -r requirements.txt

# Настроить .env файл
# См. SETUP_DATABASE.md для деталей

# Применить миграции
alembic upgrade head

# Создать platform_master пользователя
python -m app.db.autoseed

# Запустить backend
python -m uvicorn app.main:app --reload
```

Backend будет доступен на: `http://localhost:8000`

### 2. Настройка Frontend

```bash
cd core-frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Frontend будет доступен на: `http://localhost:7000`

---

## Production развертывание

### Backend

1. **Настроить .env для production:**
   ```env
   ENVIRONMENT=production
   DATABASE_URL=postgresql+asyncpg://user:password@host:5432/modular_saas_core
   JWT_SECRET_KEY=<длинный-случайный-ключ-минимум-32-символа>
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   HOST=0.0.0.0
   PORT=8000
   ```

2. **Запустить через gunicorn/uvicorn:**
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

3. **Или использовать Docker:**
   ```bash
   docker build -t modular-saas-backend .
   docker run -p 8000:8000 --env-file .env modular-saas-backend
   ```

### Frontend

1. **Собрать production build:**
   ```bash
   npm run build
   ```

2. **Запустить production сервер:**
   ```bash
   npm start
   ```

3. **Или использовать Docker:**
   ```bash
   docker build -t modular-saas-frontend .
   docker run -p 7000:7000 modular-saas-frontend
   ```

---

## Переменные окружения

### Backend (.env)

Обязательные:
- `DATABASE_URL` - строка подключения к PostgreSQL (формат: `postgresql+asyncpg://`)
- `JWT_SECRET_KEY` - секретный ключ для JWT (минимум 32 символа)

Опциональные:
- `JWT_ALGORITHM` - алгоритм JWT (по умолчанию: HS256)
- `JWT_ACCESS_TOKEN_TTL_MINUTES` - время жизни access token (по умолчанию: 30)
- `HOST` - хост для запуска (по умолчанию: 0.0.0.0)
- `PORT` - порт для запуска (по умолчанию: 8000)
- `CORS_ORIGINS` - разрешенные источники для CORS (по умолчанию: localhost:7000,3000)
- `ENVIRONMENT` - окружение (development/production)
- `DB_POOL_MIN_SIZE` - минимальный размер пула БД (по умолчанию: 5)
- `DB_POOL_MAX_SIZE` - максимальный размер пула БД (по умолчанию: 10)

### Frontend

Frontend использует переменные окружения из Next.js (если нужны):
- `NEXT_PUBLIC_API_URL` - URL backend API (если отличается от localhost:8000)

---

## Проверка работоспособности

### Backend

```bash
# Health check
curl http://localhost:8000/health

# API info
curl http://localhost:8000/
```

### Frontend

Откройте в браузере:
- `http://localhost:7000` - главная страница
- `http://localhost:7000/platform-dashboard/login` - дашборд платформы

### Тесты

```bash
cd core-backend
pytest -v
```

---

## Мониторинг

### Логи

Логи backend пишутся в stdout/stderr. Для production рекомендуется:
- Настроить централизованное логирование (ELK, Splunk)
- Использовать структурированные логи (JSON)
- Настроить ротацию логов

### Метрики

Рекомендуется добавить:
- Prometheus для сбора метрик
- Grafana для визуализации
- Health check endpoints

---

## Безопасность

### Production Checklist

- [ ] DATABASE_URL использует реальные учетные данные
- [ ] JWT_SECRET_KEY длиной минимум 32 символа
- [ ] CORS_ORIGINS содержит только нужные домены (не `*`)
- [ ] HTTPS настроен для production
- [ ] .env файл не в Git (.gitignore)
- [ ] Rate limiting настроен
- [ ] Firewall настроен
- [ ] Регулярные обновления зависимостей

---

## Troubleshooting

### Backend не запускается

1. Проверьте, что PostgreSQL запущен
2. Проверьте DATABASE_URL в .env
3. Проверьте логи на наличие ошибок

### Frontend не подключается к backend

1. Проверьте, что backend запущен на порту 8000
2. Проверьте CORS настройки
3. Проверьте network tab в браузере на наличие ошибок

### Ошибка подключения к БД

1. Проверьте, что PostgreSQL доступен
2. Проверьте учетные данные в DATABASE_URL
3. Убедитесь, что база данных существует
4. См. SETUP_DATABASE.md для деталей





