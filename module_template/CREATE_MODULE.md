# Создание нового модуля из шаблона

## Шаг 1: Копирование шаблона

```bash
# Скопируйте шаблон в папку modules
cp -r module_template modules/your_module_name
# или на Windows
xcopy /E /I module_template modules\your_module_name
```

## Шаг 2: Настройка Backend

### 2.1. Обновите `backend/app/main.py`:

1. Замените `MODULE_NAME` на название вашего модуля
2. Замените `MODULE_PORT` на уникальный порт (8001, 8002, 8003...)
3. Замените `MODULE_DESCRIPTION` на описание

### 2.2. Создайте `.env` файл:

```bash
cd modules/your_module_name/backend
cp .env.example .env
```

Отредактируйте `.env`:
- `MODULE_DATABASE_URL` - укажите БД для модуля (ОТДЕЛЬНАЯ от Core!)
- `MODULE_PORT` - порт backend
- `MODULE_NAME` - название модуля

### 2.3. Настройте модели (`backend/app/models.py`):

Раскомментируйте и адаптируйте модели под ваши нужды.

**ВАЖНО**: Все модели должны содержать `tenant_id` для изоляции данных!

### 2.4. Установите зависимости:

```bash
cd modules/your_module_name/backend
python -m venv venv
source venv/bin/activate  # или venv\Scripts\activate на Windows
pip install -r requirements.txt
```

## Шаг 3: Настройка Frontend

### 3.1. Обновите `frontend/app/page.tsx`:

1. Замените `MODULE_NAME` на название модуля
2. Замените `MODULE_PORT` на порт frontend (5001, 5002, 5003...)

### 3.2. Обновите `frontend/next.config.js`:

Измените порт в `rewrites` на порт вашего backend модуля.

### 3.3. Обновите `frontend/package.json`:

Измените порт в скриптах на ваш порт frontend.

### 3.4. Установите зависимости:

```bash
cd modules/your_module_name/frontend
npm install
```

## Шаг 4: Настройка Gateway

Обновите `gateway/src/index.ts`:

```typescript
const moduleMap: { [key: string]: number } = {
  'shop': 5001,
  'your_module': 5002,  // Добавьте ваш модуль
  // ...
};
```

## Шаг 5: Создание БД для модуля

```bash
# Создайте БД для модуля (ОТДЕЛЬНУЮ от core_db!)
createdb your_module_db

# Или через psql
psql -U postgres -c "CREATE DATABASE your_module_db;"
```

## Шаг 6: Настройка миграций (если используете Alembic)

```bash
cd modules/your_module_name/backend
alembic init alembic
# Настройте alembic.ini и alembic/env.py
alembic revision --autogenerate -m "init"
alembic upgrade head
```

## Шаг 7: Запуск модуля

### Backend:
```bash
cd modules/your_module_name/backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --port 8001
```

### Frontend:
```bash
cd modules/your_module_name/frontend
npm run dev
```

## Важные принципы

### ✅ Изоляция данных

**ВСЕГДА** фильтруйте данные по `tenant_id`:

```python
# ✅ ПРАВИЛЬНО
result = await db.execute(
    select(ModuleModel).where(
        ModuleModel.tenant_id == tenant_id
    )
)

# ❌ НЕПРАВИЛЬНО - показываете данные всех tenants!
result = await db.execute(select(ModuleModel))
```

### ✅ Использование SDK

Когда SDK будет доступен как пакет:

```python
from tochkarosta_sdk import CoreSDK

sdk = CoreSDK()
payload = await sdk.verify_token(token)
tenant_id = payload.get("tenant")
has_access = await sdk.check_module_access(tenant_id, "module_name", token)
```

### ✅ Собственная БД

Каждый модуль имеет свою БД. Никогда не используйте `core_db` для данных модуля!

## Структура готового модуля

```
modules/your_module/
├── backend/
│   ├── app/
│   │   ├── main.py          # Точка входа
│   │   ├── models.py        # Модели данных
│   │   ├── database.py      # Настройка БД
│   │   └── routes.py        # API роуты (опционально)
│   ├── alembic/             # Миграции (опционально)
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── app/
    │   ├── page.tsx         # Главная страница
    │   ├── layout.tsx
    │   └── globals.css
    ├── package.json
    └── next.config.js
```

## Готово!

Ваш модуль готов к разработке. Не забудьте:
- ✅ Всегда фильтровать по tenant_id
- ✅ Использовать отдельную БД
- ✅ Проверять права через SDK
- ✅ Тестировать изоляцию данных



