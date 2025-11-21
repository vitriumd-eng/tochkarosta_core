# Модуль Shop - Интернет-магазин

Пример модуля для платформы "Точка Роста".

## Структура

- `backend/` - FastAPI backend (порт 8001)
- `frontend/` - Next.js frontend (порт 5001)

## Запуск

### Backend

```bash
cd modules/shop/backend
python -m venv venv
source venv/bin/activate  # или venv\Scripts\activate на Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8001
```

### Frontend

```bash
cd modules/shop/frontend
npm install
npm run dev
```

## Интеграция с Gateway

Модуль доступен через Gateway по поддомену tenant'а:
- `shop.tenant-domain.tochkarosta.online` → проксируется на порт 5001 (frontend)
- API запросы к `/api/*` проксируются на порт 8001 (backend)

## Особенности

- Полная изоляция данных по tenant_id
- Собственная БД модуля
- Взаимодействие с Ядром через SDK (только для проверки прав)



