# Проверка соответствия проекта эталонной структуре

Дата проверки: $(date)
Файл эталона: `.cursor/rules_arh.md`

## Общее состояние

Проект **НЕ полностью соответствует** эталонной структуре из `rules_arh.md`.

## Детальный анализ несоответствий

### ✅ Соответствует эталону

1. **app/api/v1/routes/** — частично соответствует
   - ✅ `auth.py` — есть
   - ✅ `tenants.py` — есть
   - ✅ `modules.py` — есть
   - ⚠️ `users.py` — **ОТСУТСТВУЕТ** (должен быть отдельный файл)
   - ➕ `platform.py` — дополнительный файл (не в эталоне, но используется)
   - ➕ `subscriptions.py` — дополнительный файл (не в эталоне, но используется)

2. **app/core/** — частично соответствует
   - ✅ `config.py` — есть
   - ✅ `security.py` — есть
   - ❌ `settings_schema.py` — **ОТСУТСТВУЕТ**

3. **app/db/** — соответствует
   - ✅ `session.py` — есть
   - ✅ `base.py` — есть
   - ✅ `seed.py` — есть
   - ➕ `autoseed.py` — дополнительный файл
   - ➕ `schemas.sql` — дополнительный файл

4. **app/models/** — соответствует (с дополнительными моделями)
   - ✅ `user.py` — есть
   - ✅ `tenant.py` — есть
   - ✅ `module_registry.py` — есть
   - ✅ `__init__.py` — есть
   - ➕ Дополнительные модели: `deleted_accounts_history.py`, `module_settings.py`, `platform_content.py`, `roles.py`, `subscription.py`, `tenant_domain.py`

5. **app/services/** — частично соответствует
   - ✅ `auth_service.py` → `auth.py` — есть (название отличается)
   - ✅ `user_service.py` — есть
   - ✅ `tenant_service.py` → `tenant.py` — есть (название отличается)
   - ❌ `module_service.py` — **ОТСУТСТВУЕТ** (есть `module_loader.py`, но это другая логика)

6. **app/middleware/** — частично соответствует
   - ✅ `correlation.py` — есть
   - ❌ `request_context.py` — **ОТСУТСТВУЕТ**
   - ➕ `tenant.py` — дополнительный файл (TenantMiddleware)

7. **app/main.py** — ✅ есть
8. **app/__init__.py** — ✅ есть

### ❌ Критические несоответствия

1. **app/api/deps/** — **ОТСУТСТВУЕТ ПОЛНОСТЬЮ**
   - ❌ `dependencies.py` — нет папки и файла
   - **Влияние**: FastAPI зависимости (Depends) не организованы согласно эталону
   - **Текущее состояние**: Зависимости разбросаны по разным файлам (auth.py, routes и т.д.)

2. **app/schemas/** — **НЕ СООТВЕТСТВУЕТ СТРУКТУРЕ**
   - ❌ Должны быть отдельные файлы: `user.py`, `tenant.py`, `module.py`, `auth.py`
   - ⚠️ Фактически: только `user_schema.py` (объединенный файл)
   - **Влияние**: Нарушена модульность схем

3. **app/utils/** — **ОТСУТСТВУЕТ ПОЛНОСТЬЮ**
   - ❌ `hashing.py` — нет папки utils
   - ❌ `jwt.py` — нет папки utils
   - ❌ `module_loader.py` — нет папки utils
   - **Текущее состояние**: 
     - `hashing.py` находится в `app/security/`
     - `jwt.py` находится в `app/security/`
     - `module_loader.py` находится в `app/services/`

4. **app/api/v1/routes/users.py** — **ОТСУТСТВУЕТ**
   - **Влияние**: API endpoints для управления пользователями могут быть в других файлах

5. **app/core/settings_schema.py** — **ОТСУТСТВУЕТ**
   - **Влияние**: Pydantic Settings схема может отсутствовать или быть в другом месте

6. **app/middleware/request_context.py** — **ОТСУТСТВУЕТ**
   - **Влияние**: Request context middleware может отсутствовать

### ⚠️ Замечания и рекомендации

1. **Структура utils vs security**: 
   - Эталон требует `app/utils/` для хеширования, JWT и module_loader
   - Фактически используется `app/security/` для hashing и jwt
   - Рекомендация: Переместить в `app/utils/` или обновить эталон

2. **Схемы**: 
   - Эталон требует разделения по файлам (`user.py`, `tenant.py`, `module.py`, `auth.py`)
   - Фактически используется объединенный `user_schema.py`
   - Рекомендация: Разделить на отдельные файлы или обновить эталон

3. **API routes**:
   - Отсутствует `users.py` в routes
   - Рекомендация: Создать отдельный файл или перенести логику из auth.py

4. **Dependencies**:
   - Отсутствует папка `app/api/deps/`
   - Рекомендация: Создать и вынести общие зависимости FastAPI

## Рекомендуемые действия

### Приоритет 1 (Критические)

1. ✅ Создать `app/api/deps/dependencies.py` и вынести общие зависимости
2. ✅ Переместить `app/security/hashing.py` → `app/utils/hashing.py`
3. ✅ Переместить `app/security/jwt.py` → `app/utils/jwt.py`
4. ✅ Переместить `app/services/module_loader.py` → `app/utils/module_loader.py`

### Приоритет 2 (Важные)

5. ✅ Разделить `app/schemas/user_schema.py` на:
   - `app/schemas/user.py`
   - `app/schemas/tenant.py`
   - `app/schemas/module.py`
   - `app/schemas/auth.py`

6. ✅ Создать `app/api/v1/routes/users.py` для управления пользователями

7. ✅ Создать `app/core/settings_schema.py` для Pydantic Settings

8. ✅ Создать `app/middleware/request_context.py` для request context

### Приоритет 3 (Опциональные)

9. ⚠️ Рассмотреть переименование `auth.py` → `auth_service.py` в services
10. ⚠️ Рассмотреть переименование `tenant.py` → `tenant_service.py` в services

## Заключение

Проект имеет **хорошую базовую структуру**, но **не полностью соответствует** эталонной структуре из `rules_arh.md`. 

Основные проблемы:
- Отсутствует `app/api/deps/`
- Неправильная организация `app/utils/` (функции в `app/security/`)
- Не разделены схемы по файлам
- Отсутствуют некоторые файлы (users.py в routes, settings_schema.py, request_context.py)

**Рекомендация**: Выполнить рефакторинг согласно приоритетам выше для полного соответствия эталону.





