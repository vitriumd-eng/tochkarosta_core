# Шаблон backend для Tochka Rosta (полный)

Ниже — готовый **шаблон backend** (ядро), который можно скопировать как основу для проекта. Включены все основные файлы, структура директорий, примеры кода (async SQLAlchemy, FastAPI), alembic, Docker Compose и инструкции по запуску.

> Примечание: это шаблон для **ядра**. Модули имеют аналогичную структуру (копировать и адаптировать).

---

## Структура проекта

```
core-backend/
├─ app/
│  ├─ api/
│  │  ├─ v1/
│  │  │  ├─ routes/
│  │  │  │  ├─ auth.py
│  │  │  │  ├─ users.py
│  │  │  │  └─ modules.py
│  │  │  └─ __init__.py
│  │  └─ __init__.py
│  ├─ models/
│  │  ├─ __init__.py
│  │  ├─ user.py
│  │  ├─ tenant.py
│  │  ├─ module_registry.py
│  │  └─ subscription.py
│  ├─ schemas/
│  │  ├─ __init__.py
│  │  ├─ user.py
│  │  ├─ tenant.py
│  │  └─ module_registry.py
│  ├─ services/
│  │  ├─ __init__.py
│  │  ├─ user_service.py
│  │  └─ tenant_service.py
│  ├─ db/
│  │  ├─ __init__.py
│  │  ├─ base.py
│  │  ├─ session.py
│  │  └─ init_db.py
│  ├─ core/
│  │  ├─ config.py
│  │  ├─ security.py
│  │  └─ exceptions.py
│  ├─ middleware/
│  │  └─ tenant.py
│  ├─ utils/
│  │  └─ logger.py
│  └─ main.py
├─ alembic/
│  ├─ env.py
│  └─ versions/
├─ alembic.ini
├─ Dockerfile
├─ docker-compose.yml
├─ requirements.txt
└─ .env.example
```

---

## requirements.txt

```
fastapi==0.95.2
uvicorn[standard]==0.22.0
SQLAlchemy==2.0.17
alembic==1.11.1
asyncpg==0.28.0
pydantic==1.10.7
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
httpx==0.24.1
pytest==7.4.0
```

> Примечание: asyncpg указан как драйвер для SQLAlchemy, но **нельзя** использовать asyncpg напрямую — только через SQLAlchemy `postgresql+asyncpg`.

---

## .env.example

```
DATABASE_URL=postgresql+asyncpg://core_user:password@db:5432/core_db
JWT_SECRET=change_me
HOST=0.0.0.0
PORT=8000
```

---

## app/core/config.py

```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## app/db/base.py

```python
from sqlalchemy.orm import declarative_base

Base = declarative_base()
```

---

## app/db/session.py

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False, future=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session():
    async with AsyncSessionLocal() as session:
        yield session
```

---

## app/db/init_db.py

```python
from app.db.session import engine
from app.db.base import Base

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
```

---

## app/models/user.py

```python
from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")
    is_active = Column(Boolean, default=True)
```

---

## app/models/tenant.py

```python
from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    domain = Column(String, unique=True, nullable=True)
```

---

## app/models/module_registry.py

```python
from sqlalchemy import Column, Integer, String, JSON
from app.db.base import Base

class ModuleRegistry(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    metadata = Column(JSON, nullable=True)
```

---

## app/schemas/user.py

```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    phone: str
    password: str

class UserOut(BaseModel):
    id: int
    phone: str
    role: str

    class Config:
        orm_mode = True
```

---

## app/services/user_service.py

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.core.security import hash_password

class UserService:

    @staticmethod
    async def create_user(session: AsyncSession, phone: str, password: str, role: str = "user"):
        hashed = hash_password(password)
        user = User(phone=phone, password_hash=hashed, role=role)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def get_by_phone(session: AsyncSession, phone: str):
        return await session.scalar(select(User).where(User.phone == phone))
```

---

## app/core/security.py

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

---

## app/api/v1/routes/auth.py

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_session
from app.schemas.user import UserCreate, UserOut
from app.services.user_service import UserService

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate, session: AsyncSession = Depends(get_session)):
    existing = await UserService.get_by_phone(session, user_in.phone)
    if existing:
        raise HTTPException(status_code=400, detail="User exists")
    user = await UserService.create_user(session, user_in.phone, user_in.password)
    return user
```

---

## app/api/v1/routes/users.py

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_session
from app.services.user_service import UserService

router = APIRouter()

@router.get("/me")
async def me():
    return {"msg": "implement auth"}
```

---

## app/middleware/tenant.py

```python
from starlette.types import ASGIApp, Scope, Receive, Send
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.tenant import Tenant
from sqlalchemy import select

class TenantMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        # Пример: определять tenant по заголовку X-Tenant
        headers = {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}
        tenant_name = headers.get("x-tenant")
        scope["tenant"] = None
        if tenant_name:
            async with AsyncSessionLocal() as session:
                res = await session.scalar(select(Tenant).where(Tenant.name == tenant_name))
                scope["tenant"] = res
        await self.app(scope, receive, send)
```

---

## app/utils/logger.py

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tochkarosta")
```

---

## app/main.py

```python
import uvicorn
from fastapi import FastAPI
from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.users import router as users_router
from app.middleware.tenant import TenantMiddleware
from app.core.config import settings

app = FastAPI(title="Tochka Rosta - Core")

app.add_middleware(TenantMiddleware)
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(users_router, prefix="/api/v1/users")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
```

---

## alembic/env.py (template)

```python
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

from app.db.base import Base
from app.core.config import settings

# this is the Alembic Config object, which provides access to the values within the .ini file in use.
config = context.config
fileConfig(config.config_file_name)

# set sqlalchemy.url dynamically from settings
config.set_main_option('sqlalchemy.url', settings.DATABASE_URL.replace('+asyncpg', ''))

target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

> Примечание: в `alembic.ini` укажи `sqlalchemy.url = driverless_placeholder` — env.py будет подставлять реальный URL.

---

## Dockerfile

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## docker-compose.yml (Postgres + app)

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: core_user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: core_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .
    env_file: .env
    volumes:
      - ./:/app
    ports:
      - "8000:8000"
    depends_on:
      - db

volumes:
  pgdata:
```

---

## Команды для работы

1. Поднять окружение:

```bash
docker-compose up -d --build
```

2. Установить зависимости локально (без Docker):

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .\.venv\Scripts\activate
pip install -r requirements.txt
```

3. Применить миграции:

```bash
alembic upgrade head
```

4. Запустить локально:

```bash
uvicorn app.main:app --reload
```

---

## Типичные ошибки и отладка

- **uvicorn не найден** — активируй venv и установи зависимости.
- **DATABASE_URL неверен** — проверь .env и формат `postgresql+asyncpg://user:pass@host:5432/db`.
- **Миграции не применились** — проверь alembic.env и target_metadata.
- **TestClient работает, реальный запрос — нет** — проверь middleware и инициализацию пулов.
- **Нельзя использовать asyncpg напрямую** — используйте SQLAlchemy.

---

## Заключение

Этот шаблон — рабочая отправная точка. Если хочешь, я могу:

- сгенерировать готовую zip-структуру с файлами и содержимым;
- добавить примеры тестов;
- создать seed-скрипты (platform_master);
- автоматически выполнить миграции и создать пользователя;
- или адаптировать шаблон под особенности твоего проекта.

Какая следующая задача — сгенерировать ZIP, добавить миграции, или создать seed-пользователя?

