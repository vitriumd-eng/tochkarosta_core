# Tests

## Структура тестов

- `conftest.py` - Pytest конфигурация и фикстуры
- `test_models.py` - Тесты для SQLAlchemy моделей
- `test_auth.py` - Тесты для API аутентификации
- `test_user_service.py` - Тесты для сервисов пользователей

## Запуск тестов

### Установка зависимостей

```bash
pip install -r requirements.txt
```

### Запуск всех тестов

```bash
pytest
```

### Запуск конкретного файла тестов

```bash
pytest tests/test_models.py
pytest tests/test_auth.py
pytest tests/test_user_service.py
```

### Запуск с выводом

```bash
pytest -v
```

### Запуск с покрытием кода (если установлен pytest-cov)

```bash
pytest --cov=app --cov-report=html
```

## Конфигурация

### База данных для тестов

По умолчанию используется SQLite в памяти (`:memory:`). Можно переопределить через переменную окружения:

```bash
TEST_DATABASE_URL=postgresql+asyncpg://user:pass@localhost/test_db pytest
```

### Фикстуры

- `test_engine` - тестовый движок БД
- `test_session` - тестовая сессия БД
- `client` - HTTP клиент для тестирования API

## Примечания

- Тесты используют изолированную БД (SQLite в памяти по умолчанию)
- Каждый тест получает чистую БД
- Фикстуры автоматически создают и удаляют таблицы





