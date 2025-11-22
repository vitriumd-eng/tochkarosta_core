# Production Deployment Guide

## 🚀 Подготовка к продакшену

### 1. Переменные окружения

#### Backend (.env)
```env
ENVIRONMENT=production
DEV_MODE=False

# Безопасность
SECRET_KEY=<generate_strong_secret_key>
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 часа

# Database (используйте внешний PostgreSQL)
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/core_db

# Redis (используйте внешний Redis)
REDIS_URL=redis://host:6379/0

# CORS (укажите ваши домены)
BACKEND_CORS_ORIGINS=["https://yourdomain.com", "https://api.yourdomain.com"]
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GATEWAY_URL=https://yourdomain.com
```

### 2. Docker Compose для Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Сборка и запуск

#### Backend
```bash
cd core-backend
pip install -r requirements.txt --no-cache-dir
alembic upgrade head
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend
```bash
cd core-frontend
npm install --production
npm run build
npm start
```

#### Gateway
```bash
cd gateway
npm install --production
npm run build
npm start
```

### 4. Nginx конфигурация (пример)

```nginx
# Gateway (основной домен)
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. SSL сертификаты

Используйте Let's Encrypt:
```bash
certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### 6. Мониторинг

- Настройте логирование (ELK, Loki, etc.)
- Добавьте метрики (Prometheus, Grafana)
- Настройте алерты

### 7. Резервное копирование

```bash
# Backup БД
pg_dump -U postgres core_db > backup_$(date +%Y%m%d).sql

# Автоматизация через cron
0 2 * * * pg_dump -U postgres core_db > /backups/backup_$(date +\%Y\%m\%d).sql
```

## 🔒 Безопасность

1. **Секретные ключи**: Никогда не коммитьте .env файлы
2. **HTTPS**: Обязательно используйте SSL
3. **CORS**: Ограничьте разрешенные домены
4. **Rate Limiting**: Добавьте ограничение запросов
5. **Firewall**: Настройте правила доступа

## 📊 Производительность

1. **Кэширование**: Используйте Redis для кэша
2. **CDN**: Для статических файлов
3. **Балансировка**: Nginx или HAProxy
4. **Масштабирование**: Горизонтальное масштабирование сервисов

## ✅ Чеклист перед запуском

- [ ] Все секретные ключи изменены
- [ ] DEV_MODE=False
- [ ] HTTPS настроен
- [ ] CORS ограничен
- [ ] Резервное копирование настроено
- [ ] Мониторинг работает
- [ ] Логирование настроено
- [ ] Тесты пройдены







