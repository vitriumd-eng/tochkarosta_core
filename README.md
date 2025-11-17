# Modular SaaS Platform Core

Модульная SaaS-платформа с разделением на ядро (core) и автономные модули.

## Структура проекта

```
root/
  core-backend/      # FastAPI backend (порт 8000)
  core-frontend/     # Next.js frontend (порты 7000/7001/7002)
  modules/           # Автономные модули
  infra/             # Infrastructure (Terraform, K8s)
```

## Порты

- **7000** - Публичная часть платформы (лендинг)
- **7001** - Регистрация и дашборд подписчика
- **7002** - Супер-админ панель
- **8000** - Backend API

## Быстрый старт

### Backend

```bash
cd core-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd core-frontend
npm install
npm run dev          # Порт 7000 (public)
npm run dev:auth     # Порт 7001 (auth/dashboard)
npm run dev:admin    # Порт 7002 (admin)
```

## Архитектура

### Ядро (Core)

- Управление арендаторами (tenants)
- Подписки и биллинг
- Реестр модулей
- SDK для модулей
- Аутентификация (phone-only с OTP)

### Модули

- Автономные приложения (shop, events, crm и т.д.)
- Собственные backend и frontend
- Взаимодействие с ядром только через SDK
- Регистрация в `core-backend/app/modules/registry.yaml`

## SDK

### Backend SDK

Модули используют функции из `core-backend/app/modules/sdk.py`:
- `get_subscription_status(tenant_id)`
- `get_tenant_info(tenant_id)`
- `get_tenant_database_url(tenant_id, module_id)`
- `check_dependencies(module_id)`

### Frontend SDK

Модули используют функции из `core-frontend/lib/modules/index.ts`:
- `getSubscriptionStatus()`
- `getTenantInfo()`
- `switchActiveModule(moduleId)`

## Документация

Полная документация в `.cursor/rules.md` и файлах в `superprompt_package_final_v3/`:
- `SUPERPROMPT.md` - Полные правила архитектуры
- `SCHEMAS.md` - Database schemas
- `CODE_EXAMPLES.md` - Примеры кода SDK
- `MODULE_TEMPLATE.md` - Шаблон модуля

## Лицензия

Proprietary



