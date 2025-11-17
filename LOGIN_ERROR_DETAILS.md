# ДЕТАЛЬНЫЙ АНАЛИЗ ОШИБКИ ВХОДА

## Дата: 2025-11-16

## ПРОБЛЕМА

**Ошибка:** `500 Internal Server Error` при запросе к `/api/platform/login`

## СТАТУС

- ✅ Пользователь `platform_master` создан в БД (ID: 0fb0ea7e-1c47-425e-a2ee-fda61a17ee11)
- ✅ Бэкенд доступен (health check возвращает 200)
- ❌ Эндпоинт `/api/platform/login` возвращает 500

## ВОЗМОЖНЫЕ ПРИЧИНЫ

### 1. Проблема с подключением к базе данных
- Функция `get_db()` может не работать корректно
- Пул подключений может быть не инициализирован

### 2. Проблема с запросом к БД
- SQL запрос может быть неправильным
- Пользователь может не существовать или иметь неправильный формат

### 3. Проблема с проверкой пароля
- `bcrypt.checkpw()` может работать неправильно
- Формат `password_hash` в БД может быть некорректным

### 4. Проблема с созданием JWT токена
- `create_access_token()` может вызывать ошибку
- JWT_SECRET_KEY может быть не установлен

## ДИАГНОСТИКА

### Код эндпоинта `/api/platform/login`:

```python
@router.post("/login", response_model=LoginResponse)
async def platform_login(data: LoginRequest):
    try:
        async with get_db() as db:
            # Find user by phone
            query = "SELECT id, phone, password_hash, role FROM users WHERE phone = $1"
            user = await db.fetchrow(query, data.login)
            
            if not user:
                raise HTTPException(status_code=401, detail="Invalid login or password")
            
            # Check role
            if not user["role"] or user["role"] != "platform_master":
                raise HTTPException(status_code=403, detail="Access denied.")
            
            # Verify password
            password_valid = bcrypt.checkpw(
                data.password.encode('utf-8'),
                user["password_hash"].encode('utf-8') if isinstance(user["password_hash"], str) else user["password_hash"]
            )
            
            if not password_valid:
                raise HTTPException(status_code=401, detail="Invalid login or password")
            
            # Create JWT token
            token = create_access_token({
                "sub": str(user["id"]),
                "role": user["role"]
            })
            
            return LoginResponse(token=token, role=user["role"])
    except HTTPException:
        raise
    except Exception as e:
        logger.error("===== UNEXPECTED ERROR =====", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
```

## СЛЕДУЮЩИЕ ШАГИ

1. Проверить логи бэкенда в консоли, где запущен uvicorn
2. Проверить подключение к БД через health check
3. Проверить тестовый эндпоинт `/api/platform/test-login`
4. Проверить, что пользователь существует в БД с правильным форматом password_hash

## РЕШЕНИЕ

Нужно увидеть детальную ошибку из логов бэкенда, чтобы определить точную причину.

