# ОТЧЕТ: Соответствие реализации требованиям `.cursor\register.md`

## Дата: 2025-11-16

## РЕЗЮМЕ

**Текущая реализация НЕ полностью соответствует требованиям документа.**

Текущая реализация работает, но не следует структуре, описанной в `.cursor\register.md`. Документ описывает архитектуру с SQLAlchemy ORM, сервисным слоем, enum ролями и централизованным хешированием, а текущая реализация использует asyncpg напрямую и Pydantic модели.

---

## ДЕТАЛЬНАЯ ПРОВЕРКА

### ✅ ЧТО СООТВЕТСТВУЕТ:

1. **Пользователь создается в `core_db`**
   - ✅ Скрипт использует `get_db()` из `app.db.session`
   - ✅ Данные сохраняются в таблицу `users` базы данных ядра

2. **Используется `bcrypt` для хеширования паролей**
   - ✅ В `scripts/create_platform_master.py` используется `bcrypt.hashpw()`
   - ✅ В `app/api/platform.py` используется `bcrypt.checkpw()` для проверки

3. **Роль `platform_master` поддерживается**
   - ✅ Роль сохраняется в БД как строка `"platform_master"`
   - ✅ Проверка роли реализована в `require_platform_master()` dependency

4. **Параметры пользователя соответствуют**
   - ✅ Логин: `89535574133`
   - ✅ Пароль: `Tehnologick987`
   - ✅ Роль: `platform_master`

---

### ❌ ЧТО НЕ СООТВЕТСТВУЕТ:

#### 1. **Отсутствует `app/services/user_service.py`**

**Требование из документа:**
```
app/services/user_service.py должен содержать метод:
async def create_platform_master(phone: str, password: str)
```

**Текущее состояние:**
- ❌ Файл `app/services/user_service.py` **не существует**
- ❌ Метод `create_platform_master()` находится в скрипте `scripts/create_platform_master.py`

**Несоответствие:**
- Логика создания пользователя находится в скрипте, а не в сервисном слое
- Нет возможности переиспользовать логику создания пользователя в API или других местах

---

#### 2. **Отсутствует `app/models/roles.py` с `UserRole` enum**

**Требование из документа:**
```
app/models/roles.py:
class UserRole(str, enum.Enum):
    platform_master = "platform_master"
    user = "user"
    admin = "admin"
```

**Текущее состояние:**
- ❌ Файл `app/models/roles.py` **не существует**
- ❌ Роль хранится как строка (`role: Optional[str]`) в модели `user.py`
- ❌ В БД роль хранится как `TEXT`, а не как enum

**Несоответствие:**
- Нет типизации ролей через enum
- Нет централизованного управления ролями
- Высокий риск ошибок из-за опечаток в строках

---

#### 3. **Отсутствует `app/security/hashing.py`**

**Требование из документа:**
```
app/security/hashing.py:
from passlib.context import CryptContext
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str):
    return pwd.hash(password)
```

**Текущее состояние:**
- ❌ Файл `app/security/hashing.py` **не существует**
- ❌ Хеширование выполняется напрямую через `bcrypt` в скрипте и API

**Несоответствие:**
- Хеширование паролей разбросано по разным файлам
- Используется `bcrypt` напрямую вместо `passlib` (как указано в документе)
- Нет централизованной функции `hash_password()`

---

#### 4. **Скрипт находится в неправильной директории**

**Требование из документа:**
```
core-backend/app/seed/create_platform_master.py
```

**Текущее состояние:**
- ❌ Скрипт находится в `core-backend/scripts/create_platform_master.py`
- ❌ Директория `app/seed/` **не существует**

**Несоответствие:**
- Неправильное расположение файла
- Команда запуска должна быть `python -m app.seed.create_platform_master`, но сейчас `python -m scripts.create_platform_master`

---

#### 5. **Отсутствует API endpoint `/api/platform/register-master`**

**Требование из документа:**
```
app/api/auth.py:
@router.post("/platform/register-master")
async def register_master(user: UserCreate):
    return await create_platform_master(...)
```

**Текущее состояние:**
- ❌ Endpoint `/api/platform/register-master` **не существует**
- ❌ Нет метода регистрации через API

**Несоответствие:**
- Невозможно создать `platform_master` через API
- Можно создать только через скрипт

---

#### 6. **Модель пользователя не соответствует требованиям**

**Требование из документа:**
```
app/models/user.py:
from sqlalchemy import Column, Integer, String, Boolean, Enum
from .roles import UserRole
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    phone = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)
    is_active = Column(Boolean, default=True)
```

**Текущее состояние:**
- ❌ Модель пользователя - это **Pydantic модель**, а не SQLAlchemy
- ❌ Нет SQLAlchemy модели `User` с правильными типами колонок
- ❌ Роль хранится как `Optional[str]`, а не как `Enum(UserRole)`

**Несоответствие:**
- Текущая модель не может использоваться с SQLAlchemy ORM
- Нет связи с базой данных через ORM
- Используется asyncpg напрямую вместо ORM

---

#### 7. **Отсутствует `app/schemas/user_schema.py` с `UserCreate`**

**Требование из документа:**
```
app/schemas/user_schema.py:
class UserCreate(BaseModel):
    phone: str
    password: str
```

**Текущее состояние:**
- ❌ Файл `app/schemas/user_schema.py` **не существует**
- ❌ Директория `app/schemas/` существует, но **пустая**

**Несоответствие:**
- Нет Pydantic схемы для создания пользователя
- Нельзя валидировать данные при регистрации через API

---

#### 8. **Используется asyncpg напрямую вместо SQLAlchemy ORM**

**Требование из документа:**
```
Использование SQLAlchemy ORM:
db.add(user)
db.commit()
db.refresh(user)
```

**Текущее состояние:**
- ❌ Используется `asyncpg` напрямую через сырые SQL запросы
- ❌ Нет использования SQLAlchemy ORM для работы с БД

**Несоответствие:**
- Документ описывает архитектуру с ORM, но реализация использует прямой SQL
- Это кардинальное различие в подходе к работе с БД

---

## ВЫВОДЫ

### Критические несоответствия:

1. **Архитектурное несоответствие**: Документ описывает архитектуру с **SQLAlchemy ORM** и **сервисным слоем**, а текущая реализация использует **asyncpg напрямую** и **Pydantic модели**.

2. **Отсутствие структуры сервисного слоя**: Нет `user_service.py` с методом `create_platform_master()`, логика находится в скрипте.

3. **Отсутствие типизации ролей**: Нет enum для ролей, используются строки.

4. **Отсутствие централизованного хеширования**: Нет `hashing.py`, хеширование разбросано.

5. **Неправильное расположение файлов**: Скрипт в `scripts/`, а не `app/seed/`.

6. **Отсутствие API endpoint**: Нет возможности создать пользователя через API.

---

## РЕКОМЕНДАЦИИ

### Вариант 1: Привести к требованиям документа (рефакторинг)

1. Создать `app/models/roles.py` с `UserRole` enum
2. Создать SQLAlchemy модель `User` в `app/models/user.py`
3. Создать `app/security/hashing.py` с функцией `hash_password()`
4. Создать `app/services/user_service.py` с методом `create_platform_master()`
5. Переместить скрипт в `app/seed/create_platform_master.py`
6. Создать `app/schemas/user_schema.py` с `UserCreate`
7. Добавить API endpoint `/api/platform/register-master`
8. Рефакторить использование asyncpg на SQLAlchemy ORM

**Сложность**: Высокая (требует изменения архитектуры работы с БД)

---

### Вариант 2: Обновить документ под текущую реализацию

Обновить `.cursor\register.md`, чтобы описать текущую архитектуру с asyncpg и Pydantic моделями.

**Сложность**: Низкая (только обновление документации)

---

### Вариант 3: Гибридный подход

Сохранить текущую реализацию с asyncpg, но добавить недостающие элементы структуры:
- `app/services/user_service.py` (но с использованием asyncpg)
- `app/models/roles.py` с enum (для валидации)
- `app/security/hashing.py` с функцией `hash_password()`
- `app/schemas/user_schema.py` с `UserCreate`
- API endpoint `/api/platform/register-master`
- Переместить скрипт в `app/seed/`

**Сложность**: Средняя (добавление структуры без изменения БД слоя)

---

## ЗАКЛЮЧЕНИЕ

**Текущая реализация функциональна и работает**, но **не соответствует структуре**, описанной в `.cursor\register.md`. Документ описывает архитектуру с SQLAlchemy ORM, а текущая реализация использует asyncpg напрямую.

**Рекомендуется**: Вариант 3 (гибридный подход) для добавления структуры без кардинального изменения архитектуры БД слоя.

