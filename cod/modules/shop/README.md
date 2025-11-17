# Shop Module

Модуль интернет-магазина для платформы. Управление товарами, заказами, корзиной.

## Структура

- `backend/` - FastAPI приложение
- `frontend/` - Next.js приложение
- `manifest.json` - Метаданные модуля

## Установка

### Backend

```bash
cd modules/shop/backend
pip install -r requirements.txt
```

### Frontend

```bash
cd modules/shop/frontend
npm install
```

## Использование SDK

Модуль использует SDK для взаимодействия с ядром:

### Backend

```python
from core_backend.app.modules.sdk import (
    get_subscription_status,
    get_tenant_info,
    get_tenant_database_url
)

# Проверить подписку и лимиты
subscription = await get_subscription_status(tenant_id)
max_products = subscription.get("limits", {}).get("products", 50)
```

### Frontend

```typescript
import { getSubscriptionStatus, getTenantInfo } from '@/lib/modules'

// Проверить подписку
const subscription = await getSubscriptionStatus()
const maxProducts = subscription.limits?.products || 50
```

## API Endpoints

- `GET /api/products` - Список товаров
- `GET /api/products/{id}` - Товар по ID
- `POST /api/products` - Создать товар
- `GET /api/orders` - Список заказов
- `POST /api/cart/add` - Добавить в корзину

## Роуты

### Публичные

- `/` - Главная страница каталога
- `/catalog` - Каталог товаров
- `/product/:id` - Страница товара
- `/cart` - Корзина

### Dashboard

- `/admin/products` - Управление товарами
- `/admin/orders` - Управление заказами
- `/admin/settings` - Настройки магазина

## Лимиты

Модуль проверяет лимиты подписки через SDK:
- `start`: 50 товаров
- `growth`: 500 товаров
- `premium`: безлимитно (-1)

## База данных

Каждый тенант получает свою БД модуля через `get_tenant_database_url()`.



