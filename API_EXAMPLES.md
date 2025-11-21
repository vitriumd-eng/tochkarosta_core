# Примеры использования API

## 🔐 Аутентификация

### Регистрация нового пользователя

```bash
# 1. Проверка телефона
curl -X POST http://localhost:8000/api/auth/check-phone \
  -H "Content-Type: application/json" \
  -d '{"phone": "+79991234567"}'

# 2. Отправка кода (в DEV режиме код выводится в консоль backend)
curl -X POST http://localhost:8000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+79991234567"}'

# 3. Полная регистрация (используйте код из консоли)
curl -X POST http://localhost:8000/api/auth/register-full \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+79991234567",
    "code": "123456",
    "password": "secure_password",
    "first_name": "Иван",
    "last_name": "Иванов",
    "employment_type": "individual"
  }'
```

### Вход существующего пользователя

```bash
curl -X POST http://localhost:8000/api/auth/login-password \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+79991234567",
    "password": "secure_password"
  }'
```

## 👤 Tenants

### Получить текущий tenant

```bash
curl -X GET http://localhost:8000/api/tenants/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Получить tenant по ID

```bash
curl -X GET http://localhost:8000/api/tenants/{tenant_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 💰 Billing

### Получить список тарифов

```bash
curl -X GET http://localhost:8000/api/billing/tariffs
```

### Получить тариф по ID

```bash
curl -X GET http://localhost:8000/api/billing/tariffs/{tariff_id}
```

### Получить подписку tenant

```bash
curl -X GET http://localhost:8000/api/billing/subscriptions/{tenant_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Создать подписку

```bash
curl -X POST http://localhost:8000/api/billing/subscriptions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "uuid",
    "tariff_id": "uuid"
  }'
```

## 🏥 Health Checks

### Базовый health check

```bash
curl http://localhost:8000/health
```

### Детальный health check

```bash
curl http://localhost:8000/health/detailed
```

## 📝 Python примеры

См. `core-backend/app/modules/auth/examples.py` для примеров использования API через Python.

## 🔗 Swagger UI

Интерактивная документация API доступна по адресу:
- http://localhost:8000/docs

## ⚠️ Важные замечания

1. Все защищенные endpoints требуют заголовок `Authorization: Bearer TOKEN`
2. В DEV режиме OTP коды выводятся в консоль backend
3. Используйте правильный формат телефона: `+79991234567`
4. Все UUID должны быть в правильном формате



