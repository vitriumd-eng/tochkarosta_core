THE GRAND BLUEPRINT: MASTER ARCHITECT EDITION (v6.0 - FINAL)

🎯 1. ВВЕДЕНИЕ И РОЛЬ

Этот документ является Единственным Источником Истины для проекта "Tochka Rosta". Любое изменение кода или архитектуры должно сверяться с этим документом.

Твоя Роль: CTO и Ведущий Архитектор.
Твоя Миссия: Защита Целостности Ядра, обеспечение изоляции данных и масштабируемости.

🏰 2. БИЗНЕС-МОДЕЛЬ И КОНЦЕПЦИЯ (ПРЕЗЕНТАЦИЯ)

"Точка Роста" — это экосистема (SaaS), где предприниматели арендуют готовые цифровые бизнесы (Модули) без необходимости нанимать программистов.

2.1. Иерархия Ролей и Зоны Ответственности

Роль

Сущность в БД

Доступ (Порт)

Зона Ответственности

Основатель (Founder)

User (is_superuser=True)

7003 (SuperAdmin)

Управление всей платформой, тарифами, модераторами.

Модератор (Master)

User (role=master)

7001 (CMS)

Управление контентом публичного лендинга (SEO, Новости).

Владелец (Owner)

User (привязан к Tenant)

7001 (Dashboard)

Вход по телефону (как ID). Управление своим бизнесом (Товары, Заказы).

Подписчик (Tenant)

Tenant (Бизнес-единица)

N/A

Юридическая сущность (Магазин). Владеет данными и доменом.

Клиент (Buyer)

(Внутри Модуля)

7000 (Public Site)

Покупатель товаров. Никогда не имеет доступа к Ядру.

2.2. Принципы Изоляции (THE IRON WALL)

ЯДРО (CORE) НИКОГДА НЕ ЗНАЕТ:

О товарах, корзинах, заказах Клиентов.

О деньгах Клиентов (оплата идет напрямую Владельцу).

О структуре БД Модулей.

МОДУЛЬ (MODULE) НИКОГДА НЕ ЗНАЕТ:

О базе данных Ядра.

О других модулях.

О глобальных тарифах (получает только свой статус через SDK).

ФИНАНСОВАЯ ИЗОЛЯЦИЯ:

Ядро биллит Владельца за подписку (SaaS).

Владелец биллит Клиента за товары (E-commerce). Эти потоки не пересекаются.

⚙️ 3. ТЕХНИЧЕСКИЙ СТЕК И СТРУКТУРА

3.1. Основной Стек

Backend: Python 3.11+, FastAPI (Async), Pydantic V2, ORJSON.

Database: PostgreSQL (AsyncPG). IDs = UUID (Строго).

Auth/Cache: Redis (хранение сессий, если нужно) / JWT.

Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS.

Gateway: Node.js + Express (Dynamic Proxy).

Graphics: Three.js + React Three Fiber (R3F) в модулях.

3.2. Структура Проекта (Vertical Slices)

tochkarosta_core/
├── core-backend/           # ЯДРО (Port 8000)
│   ├── app/
│   │   ├── core/           # Config, DB Session
│   │   ├── modules/        # БИЗНЕС-ЛОГИКА
│   │   │   ├── auth/       # JWT, Login, Register
│   │   │   ├── tenants/    # Tenant & User Models
│   │   │   └── billing/    # Tariffs & Subscriptions
│   │   └── main.py
│
├── core-frontend/          # ИНТЕРФЕЙСЫ (Ports 7000-7003)
│   ├── app/
│   │   ├── (landing)/      # Public (7000)
│   │   ├── dashboard/      # Tenant/Moderator (7001)
│   │   └── super-admin/    # Founder (7003)
│
├── gateway/                # ПРОКСИ (Port 3000)
│   └── src/index.ts        # Маршрутизация по поддоменам
│
├── modules/                # ПАПКА С МОДУЛЯМИ (В ПРОДЕ - GIT CLONE)
│   ├── shop/               # Модуль Магазина
│   │   ├── backend/        # Port 8001
│   │   └── frontend/       # Port 5001
│   └── house/              # Модуль Строителя
│
└── module_template/        # ЭТАЛОН (ШАБЛОН) ДЛЯ СОЗДАНИЯ НОВЫХ



import os
import sys
from pathlib import Path

# ==============================================================================
# 1. КОНТЕНТ ФАЙЛОВ (SOURCE CODE)
# ==============================================================================

# ------------------------------------------------------------------------------
# CONFIGURATION (.env, requirements)
# ------------------------------------------------------------------------------

ENV_BACKEND = r"""# Core Backend Configuration
PROJECT_NAME="Tochka Rosta Core"
VERSION="2.0.0"
ENVIRONMENT="local"
DEV_MODE=True

# Database (Docker Service Name or Localhost)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=core_db
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/core_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=DEV_SECRET_CHANGE_IN_PROD_12345
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ALGORITHM=HS256

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:7000", "http://localhost:7001", "http://localhost:7002"]

# Providers (DISABLED FOR LOCAL DEV)
SMS_PROVIDER=mock
TELEGRAM_ACTIVE=False
MAX_ACTIVE=False
VK_ACTIVE=False
"""

REQ_BACKEND = r"""fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
asyncpg==0.29.0
pydantic==2.6.0
pydantic-settings==2.1.0
alembic==1.13.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
redis>=5.0.1
orjson>=3.9.12
python-multipart==0.0.6
httpx==0.26.0
"""

# ------------------------------------------------------------------------------
# BACKEND CORE (Infrastructure)
# ------------------------------------------------------------------------------

MAIN_PY = r"""import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.modules.auth.routes import router as auth_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("core")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"🚀 CORE Starting up in {settings.ENVIRONMENT} mode...")
    # Здесь можно добавить проверку БД
    yield
    logger.info("🛑 CORE Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Setup
origins = settings.BACKEND_CORS_ORIGINS
if isinstance(origins, str):
    origins = origins.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error (Check logs)"}
    )

@app.get("/health")
async def health_check():
    return {"status": "ok", "env": settings.ENVIRONMENT}

# Register Routes
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
"""

CONFIG_PY = r"""from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Tochka Rosta Core"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "local"
    DEV_MODE: bool = True

    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "core_db"
    DATABASE_URL: str = ""

    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    
    # OTP Settings
    OTP_EXPIRE_SECONDS: int = 300

    SECRET_KEY: str = "secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    BACKEND_CORS_ORIGINS: Union[List[str], str] = []

    # Providers Flags
    TELEGRAM_ACTIVE: bool = False
    MAX_ACTIVE: bool = False

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.DATABASE_URL:
            self.DATABASE_URL = f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
"""

DB_BASE_PY = r"""from datetime import datetime
from typing import Any, Optional
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, Boolean, func

class Base(DeclarativeBase):
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class SoftDeleteMixin:
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
"""

DB_SESSION_PY = r"""from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEV_MODE,
    future=True,
    pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
"""

# ------------------------------------------------------------------------------
# MODELS (User, Tenant, Billing)
# ------------------------------------------------------------------------------

MODELS_USER_PY = r"""from __future__ import annotations
from typing import TYPE_CHECKING, Optional
import uuid
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant

class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Phone is ID
    phone: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Password (Required for No-SMS flow)
    password_hash: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    # Profile
    first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    employment_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    role: Mapped[str] = mapped_column(String(20), default="subscriber")
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationship
    tenant_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True)
    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="users")
"""

MODELS_TENANT_PY = r"""from __future__ import annotations
from typing import TYPE_CHECKING, List
import uuid
from sqlalchemy import String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.modules.billing.models import Subscription

class Tenant(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tenants"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, index=True) 
    
    # Critical for Gateway
    domain: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    owner_phone: Mapped[str] = mapped_column(String(20))
    
    status: Mapped[str] = mapped_column(String(20), default="active")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    users: Mapped[List["User"]] = relationship("User", back_populates="tenant")
    subscription: Mapped["Subscription"] = relationship("Subscription", back_populates="tenant", uselist=False)
"""

MODELS_BILLING_PY = r"""import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from typing import List, TYPE_CHECKING
from app.core.db import Base, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant

class Tariff(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tariffs"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False) # Base, Growth, Master
    price_monthly: Mapped[float] = mapped_column(Float, nullable=False)
    subdomain_limit: Mapped[int] = mapped_column(Integer, nullable=False) # 1, 2, 10
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    features_json: Mapped[str] = mapped_column(String, nullable=True)

    subscriptions: Mapped[List["Subscription"]] = relationship("Subscription", back_populates="tariff")

class Subscription(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "subscriptions"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"), nullable=False, index=True) 
    tariff_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tariffs.id"), nullable=False)
    
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    end_date: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="subscription")
    tariff: Mapped["Tariff"] = relationship("Tariff", back_populates="subscriptions")
"""

# ------------------------------------------------------------------------------
# AUTH MODULE (No SMS Logic)
# ------------------------------------------------------------------------------

AUTH_SCHEMAS_PY = r"""from pydantic import BaseModel, Field
from typing import Optional, Literal

class CheckPhoneRequest(BaseModel):
    phone: str

class CheckPhoneResponse(BaseModel):
    exists: bool

class SendCodeRequest(BaseModel):
    phone: str
    provider: str = "telegram"

class LoginPasswordRequest(BaseModel):
    phone: str
    password: str

class CompleteRegistrationRequest(BaseModel):
    phone: str
    code: str       # OTP for verification only
    password: str   # Set password
    first_name: str
    last_name: str
    employment_type: Literal["individual", "self_employed", "ip", "ooo"]

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user_id: str
    tenant_id: Optional[str] = None
    is_new_user: bool = False
"""

AUTH_SERVICE_PY = r"""import random
import logging
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import redis.asyncio as redis
from app.core.config import settings
from app.utils.jwt import create_access_token, create_refresh_token
from app.models.user import User
from app.models.tenant import Tenant
from app.utils.hashing import get_password_hash
import uuid

logger = logging.getLogger("core.auth")

class AuthService:
    def __init__(self):
        self.redis = None
        self._local_otp_cache = {}
        try:
            if settings.REDIS_URL:
                self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        except Exception as e:
            logger.warning(f"Redis init failed: {e}. Using in-memory.")

    async def send_otp(self, phone: str):
        """Generates OTP. NO SMS SENT. Returns code in Dev Mode."""
        try:
            code = str(random.randint(100000, 999999))
            
            # Save to Redis or Memory
            saved = False
            if self.redis:
                try:
                    await self.redis.setex(f"otp:{phone}", settings.OTP_EXPIRE_SECONDS, code)
                    saved = True
                except Exception:
                    pass
            if not saved:
                self._local_otp_cache[phone] = code

            # ALWAYS PRINT TO CONSOLE IN DEV
            if settings.DEV_MODE or settings.ENVIRONMENT == "local":
                print(f"\n{'='*40}")
                print(f"🚀 [LOCAL OTP] Phone: {phone} | Code: {code}")
                print(f"{'='*40}\n")
                return {"message": "Code sent (Check console)", "dev_code": code}

            # 4. Prod Mock
            logger.info(f"[PROD] Sending SMS to {phone}")
            return {"message": "Code sent"}

        except Exception as e:
            logger.error(f"OTP Error: {e}")
            raise HTTPException(status_code=503, detail="Service unavailable")

    async def verify_code_only(self, phone: str, code: str) -> bool:
        try:
            stored = None
            if self.redis:
                try: stored = await self.redis.get(f"otp:{phone}")
                except: pass
            
            if not stored:
                stored = self._local_otp_cache.get(phone)
            
            if stored and str(stored) == str(code):
                # Delete after use
                if self.redis:
                    try: await self.redis.delete(f"otp:{phone}")
                    except: pass
                self._local_otp_cache.pop(phone, None)
                return True
            return False
        except Exception:
            return False

    async def register_new_user(self, db: AsyncSession, data: dict):
        try:
            # Create Tenant
            domain_uid = uuid.uuid4().hex[:8]
            new_tenant = Tenant(
                name=f"Company {data['last_name']}", 
                owner_phone=data['phone'],
                domain=f"u-{domain_uid}",
                status="active"
            )
            db.add(new_tenant)
            await db.flush()

            # Create User
            new_user = User(
                phone=data['phone'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                employment_type=data['employment_type'],
                password_hash=get_password_hash(data['password']),
                tenant_id=new_tenant.id,
                phone_verified=True,
                role="owner"
            )
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)
            
            # Create Tokens
            access_token = create_access_token(
                data={"sub": str(new_user.id), "tenant": str(new_tenant.id), "role": "owner"}
            )
            refresh_token = create_refresh_token(data={"sub": str(new_user.id)})
            
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user_id": str(new_user.id),
                "tenant_id": str(new_tenant.id),
                "is_new_user": True
            }
        except Exception as e:
            logger.error(f"Register Error: {e}")
            await db.rollback()
            raise HTTPException(status_code=500, detail="Registration failed")

auth_service = AuthService()
"""

AUTH_ROUTES_PY = r"""from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.modules.auth.schemas import *
from app.modules.auth.service import auth_service
from app.models.user import User
from app.utils.hashing import verify_password
from app.utils.jwt import create_access_token

router = APIRouter()

@router.post("/check-phone", response_model=CheckPhoneResponse)
async def check_phone(data: CheckPhoneRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.phone == data.phone))
    user = result.scalar_one_or_none()
    return {"exists": user is not None}

@router.post("/send-code")
async def send_code(data: SendCodeRequest):
    return await auth_service.send_otp(data.phone)

@router.post("/login-password")
async def login_password(data: LoginPasswordRequest, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.phone == data.phone))
    user = result.scalar_one_or_none()
    
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Неверный телефон или пользователь не найден")
    
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный пароль")
    
    token = create_access_token(data={"sub": str(user.id), "tenant": str(user.tenant_id)})
    
    response.set_cookie(key="access_token", value=f"Bearer {token}", httponly=True)
    
    return {"access_token": token, "token_type": "bearer", "user_id": str(user.id), "tenant_id": str(user.tenant_id)}

@router.post("/register-full")
async def register_full(data: CompleteRegistrationRequest, response: Response, db: AsyncSession = Depends(get_db)):
    # 1. Verify OTP
    if not await auth_service.verify_code_only(data.phone, data.code):
        raise HTTPException(status_code=400, detail="Неверный код подтверждения")
    
    # 2. Create Entities
    result = await auth_service.register_new_user(db, data.dict())
    
    response.set_cookie(key="access_token", value=f"Bearer {result['access_token']}", httponly=True)
    return result
"""

# --- FRONTEND CODE ---

REGISTER_FORM_TSX = r"""'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'phone' | 'login' | 'register'

export default function RegisterForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [employmentType, setEmploymentType] = useState('individual')

  const handleCheckPhone = async () => {
    if (!phone) return setError('Введите номер')
    setLoading(true)
    setError(null)
    try {
      // Call backend check
      const res = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      // If endpoint missing (during setup), assume new user
      if (res.status === 404) {
          await sendCode()
          setStep('register')
          return
      }

      const data = await res.json()
      if (data.exists) {
        setStep('login')
      } else {
        await sendCode()
        setStep('register')
      }
    } catch (e) {
      console.error(e)
      setStep('register') 
    } finally {
      setLoading(false)
    }
  }

  const sendCode = async () => {
      try {
          await fetch('/api/auth/send-code', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ phone })
          })
      } catch (e) {
          console.error("Send code failed (check console backend)", e)
      }
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
        const res = await fetch('/api/auth/login-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        })
        if (!res.ok) throw new Error('Неверный пароль')
        
        const data = await res.json()
        localStorage.setItem('token', data.access_token)
        window.location.href = '/dashboard'
    } catch (e: any) {
        setError(e.message)
    } finally {
        setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    try {
        const res = await fetch('/api/auth/register-full', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone, code, password,
                first_name: firstName, last_name: lastName,
                employment_type: employmentType
            })
        })
        if (!res.ok) throw new Error('Ошибка регистрации')
        
        const data = await res.json()
        localStorage.setItem('token', data.access_token)
        window.location.href = '/select-module'
    } catch (e: any) {
        setError(e.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {step === 'phone' && 'Вход / Регистрация'}
        {step === 'login' && 'Введите пароль'}
        {step === 'register' && 'Создание аккаунта'}
      </h2>

      {error && <div className="p-3 mb-4 bg-red-50 text-red-700 rounded text-sm">{error}</div>}

      {step === 'phone' && (
        <div className="space-y-4">
          <label className="block text-sm text-gray-600">Номер телефона</label>
          <input className="w-full p-3 border rounded-lg" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7999..." />
          <button onClick={handleCheckPhone} disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold">
            Продолжить
          </button>
        </div>
      )}

      {step === 'login' && (
        <div className="space-y-4">
          <p className="text-center text-gray-500 text-sm">Вход для {phone}</p>
          <input className="w-full p-3 border rounded-lg" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Ваш пароль" />
          <button onClick={handleLogin} disabled={loading} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold">Войти</button>
          <button onClick={() => setStep('phone')} className="w-full text-gray-500 text-sm text-center">Назад</button>
        </div>
      )}

      {step === 'register' && (
        <div className="space-y-3">
           <div className="text-xs text-green-600 text-center bg-green-50 p-2 rounded">
             Код подтверждения в консоли сервера (DEV)
           </div>
           <input className="w-full p-3 border rounded-lg" value={code} onChange={e => setCode(e.target.value)} placeholder="Код из консоли" />
           
           <div className="grid grid-cols-2 gap-2">
             <input className="w-full p-3 border rounded-lg" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Имя" />
             <input className="w-full p-3 border rounded-lg" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Фамилия" />
           </div>
           
           <select className="w-full p-3 border rounded-lg bg-white" value={employmentType} onChange={e => setEmploymentType(e.target.value)}>
             <option value="individual">Физ. лицо</option>
             <option value="self_employed">Самозанятый</option>
             <option value="ip">ИП</option>
             <option value="ooo">ООО</option>
           </select>
           
           <input className="w-full p-3 border rounded-lg" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Придумайте пароль" />
           
           <button onClick={handleRegister} disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold">
             Зарегистрироваться
           </button>
        </div>
      )}
    </div>
  )
}
"""

ERROR_TSX = r"""'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('Global Error:', error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold text-red-600">Что-то пошло не так!</h2>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Попробовать снова
      </button>
    </div>
  );
}
"""

# ==============================================================================
# 2. LOGIC (Writing Files)
# ==============================================================================

def create_file(path, content):
    p = Path(path)
    if not p.parent.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"✅ Created: {path}")

def main():
    files = {
        # --- CONFIGS ---
        "core-backend/.env": ENV_BACKEND,
        "core-backend/requirements.txt": REQ_BACKEND,
        
        # --- BACKEND ---
        "core-backend/app/main.py": MAIN_PY,
        "core-backend/app/core/config.py": CONFIG_PY,
        "core-backend/app/core/db.py": DB_BASE_PY,
        "core-backend/app/core/database.py": DB_SESSION_PY, # Alias for session
        
        "core-backend/app/models/user.py": MODELS_USER_PY,
        "core-backend/app/models/tenant.py": MODELS_TENANT_PY,
        "core-backend/app/modules/billing/models.py": MODELS_BILLING_PY,
        
        "core-backend/app/modules/auth/schemas.py": AUTH_SCHEMAS_PY,
        "core-backend/app/modules/auth/service.py": AUTH_SERVICE_PY,
        "core-backend/app/modules/auth/routes.py": AUTH_ROUTES_PY,
        
        # --- FRONTEND ---
        "core-frontend/app/register/RegisterForm.tsx": REGISTER_FORM_TSX,
        "core-frontend/app/error.tsx": ERROR_TSX,
        
        # --- PLACEHOLDERS ---
        "gateway/src/index.ts": "// Gateway Placeholder",
        "modules/.gitkeep": "",
        "core-backend/app/modules/tenants/__init__.py": "",
    }

    print("\n🚀 DEPLOYING TOCHKA ROSTA (v2.0 FULL)...\n")
    for path, content in files.items():
        create_file(path, content)
    
    print("\n✅ DONE! Project structure created.")
    print("-------------------------------------------------------------")
    print("NEXT STEPS:")
    print("1.  cd core-backend")
    print("2.  python -m venv venv && source venv/bin/activate")
    print("3.  pip install -r requirements.txt")
    print("4.  alembic revision --autogenerate -m 'init_full'")
    print("5.  alembic upgrade head")
    print("6.  python -m uvicorn app.main:app --reload")
    print("7.  (New Terminal) cd core-frontend && npm run dev")
    print("-------------------------------------------------------------")

if __name__ == "__main__":
    main()



    
    Отличная задача. Переходим от кода к Бизнесу и Продукту.

Ниже я составил мощный Промт-Презентацию. Это готовый сценарий, который описывает "Точку Роста" не как набор файлов, а как Экосистему.

Вы можете использовать этот текст для:

Питчинга инвесторам.

Создания слайдов (PowerPoint/Keynote).

Онбординга новых сотрудников (чтобы они поняли суть, а не только код).

💼 ПРОМТ: БИЗНЕС-ЛОГИКА И ПРЕЗЕНТАЦИЯ ПЛАТФОРМЫ "ТОЧКА РОСТА"
Цель: Сформировать презентацию SaaS-платформы "Точка Роста", объясняющую уникальную модель изоляции бизнеса, монетизации и пользовательского пути.

1. КОНЦЕПЦИЯ: "Цифровой Торговый Центр"
"Точка Роста" — это не просто конструктор сайтов. Это цифровая экосистема, работающая по принципу элитного Торгового Центра.

Мы (Платформа): Арендодатель. Мы предоставляем стены, электричество, охрану и поток клиентов.

Клиент (Подписчик): Арендатор. Он заезжает в готовое помещение (Модуль), расставляет свой товар и вешает вывеску.

Философия: "Бизнес за 60 секунд". Предприниматель не должен думать о коде, серверах или безопасности. Он должен заниматься продажами.

2. АРХИТЕКТУРА БИЗНЕСА (Разделение Власти)
Мы используем модель "Железной Стены" (Iron Wall) для защиты интересов всех сторон.

🟢 ЯДРО (Администрация ТЦ)
Роль: Управление инфраструктурой.

Зона ответственности:

Регистрация владельцев бизнеса.

Управление подписками и тарифами.

Выдача "ключей" (Токенов) от магазинов.

Маршрутизация трафика (Гейтвей).

Важно: Ядро никогда не вмешивается в торговлю. Оно не видит заказы, не трогает деньги покупателей и не хранит товары.

🔵 МОДУЛЬ (Магазин Арендатора)
Роль: Автономное бизнес-приложение.

Примеры: Интернет-магазин, Онлайн-школа, Агентство недвижимости.

Зона ответственности:

Витрина товаров (с поддержкой 3D).

Корзина и Чекаут.

Прием платежей.

Маркетинг (акции, рассылки).

Важно: Каждый модуль изолирован. Данные одного магазина физически не пересекаются с другим.

3. УНИКАЛЬНЫЙ ПУТЬ ПОЛЬЗОВАТЕЛЯ (User Flow)
Мы убрали все барьеры. Регистрация происходит мгновенно.

Шаг 1: Frictionless Entry (Вход без трения)
Логика: Номер телефона — это единственный идентификатор (ID).

Никаких SMS: Мы не тратим время и деньги на SMS-шлюзы.

Процесс:

Пользователь вводит номер.

Система проверяет базу.

Если новый: Мгновенно открывается анкета (Имя, Пароль) -> Создается Аккаунт.

Если старый: Просто вводится пароль.

Результат: Вход занимает 5 секунд.

Шаг 2: Instant Tenant Creation (Мгновенное заселение)
В момент регистрации система автоматически создает для пользователя его собственную компанию (Tenant) и выделяет технический домен.

Пользователь сразу попадает в Дашборд, готовый к работе. Нет этапа "ожидания активации".

Шаг 3: Маршрутизация (Gateway)
Покупатель заходит на shop.tochkarosta.online.

Умный Гейтвей определяет, чей это магазин, и мгновенно перенаправляет покупателя в изолированный Модуль этого продавца.

4. ФИНАНСОВАЯ МОДЕЛЬ (Money Flow)
Мы строим доверие через финансовую прозрачность.

Поток 1: B2B (Подписчик платит Платформе)
За что: За аренду технологий (SaaS подписка).

Тарифы:

Start: Для начинающих (1 домен).

Growth: Для растущих (2 домена, расширенная аналитика).

Master: Для профи (10 доменов, приоритетная поддержка).

Куда идут деньги: На счет Платформы ("Точка Роста").

Поток 2: B2C (Покупатель платит Магазину)
За что: За кроссовки, курсы, услуги.

Технология: Прямая интеграция (ЮKassa, СБП, P2P).

Куда идут деньги: Напрямую на счет Владельца магазина.

Принцип: Мы не являемся посредниками. Мы не берем % с оборота. Мы не "холдируем" чужие деньги. Это гарантирует безопасность бизнеса наших клиентов.

5. КИЛЛЕР-ФИЧИ (Конкурентные преимущества)
3D-Commerce из коробки: Каждый модуль поддерживает 3D-витрины (Three.js). Продавец может загружать модели товаров, а покупатель — вращать и рассматривать их. Это повышает конверсию.

Автоматизация Маркетинга ("Кнопка Привоз"): Владелец нажимает одну кнопку "Новое поступление", и модуль сам:

Генерирует красивый баннер.

Пишет продающий текст.

Рассылает пост в привязанные Telegram-каналы и VK-группы.

Полная Изоляция: Даже если один магазин "ляжет" под DDoS-атакой, остальные (и Ядро) продолжат работать. Это обеспечивает архитектура Vertical Slices.

6. РОЛЕВАЯ МОДЕЛЬ (Кто есть кто)
Основатель (Вы): Видит всю картину сверху. Управляет тарифами.

Модератор: Следит за порядком на главной странице платформы.

Владелец (Подписчик): Царь и бог в своем Магазине. Управляет товарами, дизайном и деньгами.

Клиент (Покупатель): Гость, который приходит тратить деньги в конкретный магазин.

Итог: "Точка Роста" — это платформа, где Технология (код) полностью подчинена Бизнесу (прибыли пользователей). Мы убрали сложность, оставив только возможности.

🧩 БИЗНЕС-ЛОГИКА ПЛАТФОРМЫ «ТОЧКА РОСТА»

Платформа устроена как экосистема, которая разделена на два слоя:



Ядро (Core) — отвечает за подписчиков и модули

Модули — мини-сайты, которые подписчик подключает (магазин, мероприятие, портфолио…)

Каждая часть отвечает за свою роль и НЕ вмешивается в работу другой.

🔥 1. ЛОГИКА РЕГИСТРАЦИИ И СОЗДАНИЯ АККАУНТА

Шаг 1 — Пользователь выбирает способ входа:

Telegram

MAX

VK

(в DEV — просто вводит, и код печатается в бэкенде)

Шаг 2 — Вводит свой телефон

Это главный идентификатор подписчика, а не покупателя.



Шаг 3 — Получает код (OTP)

через Telegram

через MAX

через VK

или просто видит в терминале (DEV_MODE)

Шаг 4 — Вводит код в форму регистрации

Ядро проверяет код → создаёт нового подписчика.



Шаг 5 — Создание подписчика (tenant)

Ядро создаёт:



запись в таблице subscribers

выдаёт уникальный tenant_id

создаёт пустой аккаунт без активного модуля

выдаёт токены доступа

Шаг 6 — Подписчик попадает в свой Dashboard

Но он ещё не имеет ни одного подключённого модуля.

🔥 2. ВЫБОР И АКТИВАЦИЯ МОДУЛЯ

Подписчик в личном кабинете (dashboard) видит:



Модуль «Магазин»

Модуль «Мероприятия»

Модуль «Портфолио»

Модуль «Курсы»

Другие модули, которые будут доступны

Активирует, например, «Магазин»

Что происходит:



✔ Ядро проверяет:

доступный ли модуль?

совместим ли он с текущей версией SDK?

свободен ли выбранный поддомен?

✔ Ядро резервирует поддомен:

shop.tochkarosta.online

У каждого подписчика может быть несколько модулей, но активен только один.



✔ Ядро создаёт пробный период (trial)

У модуля может быть 7/14/30 дней trial.



✔ Модуль получает tenant_id

Модуль использует это значение для:



авторизации запросов

определения своей БД для этого подписчика

отображения его данных

🔥 3. ЛОГИКА МОДУЛЕЙ

Модуль — полностью самостоятельная система.

Каждый модуль:



имеет свою БД

имеет свой backend

имеет свой frontend

имеет своего пользователя: покупателя, клиента, ученика

имеет свой личный кабинет покупателя

ведёт свои заказы / билеты / заявки

имеет свой SEO-движок

Модуль НИКОГДА не хранит:



подписчиков

модули

тарифы

ядро

платежи за платформу

Модуль хранит только то, что касается своего функционала.

🔥 4. ЛОГИКА ПОКУПАТЕЛЯ (CLIENT / BUYER)

Покупатели — это НЕ подписчики.

Покупатель — это клиент подписчика.

Например:



покупает товар в магазине

покупает билет на мероприятие

регистрируется на курс

оставляет заявку

Как работает:

Покупатель заходит на поддомен подписчика:

shop.tochkarosta.online

Видит страницу модуля (например магазин)

Делает покупку

Оплата проходит напрямую:

ЮKassa

P2P

переводом

банковской картой

💥 Деньги НЕ проходят через ядро.

Оплата идёт от покупателя → в кошелёк подписчика.



Модуль создаёт запись в своей БД:

заказ

чек

билет

урок

запись

Покупатель видит свои покупки в личном кабинете.

🔥 5. ЛОГИКА ПЛАТЕЖЕЙ

Платформа НЕ хранит деньги.



Платформа НЕ принимает деньги.

Деньги — только у подписчика.

Модуль работает как посредник:



Формирует оплату

Отправляет в ЮKassa подписчика

Получает статус оплаты

Показывает покупателю

Платформа зарабатывает только на подписках за модули, а не на продажах.

🔥 6. ЛОГИКА SEO

Есть два уровня SEO:



1) SEO ядра (для платформенной страницы)

Отвечает за:



общие запросы

привлечение подписчиков

темы «как открыть бизнес», «как создать магазин» и т.д.

2) SEO модулей

Каждый модуль имеет:



свой SEO движок

свой анализ контента

AI генерацию заголовков

динамические мета-теги

RSS карты

SEO модуля работает для:



магазина

расписания мероприятий

портфолио

курсов

🔥 7. ЛОГИКА ТАРИФОВ

Платформа:



управляет тарифами

хранит все уровни подписки

контролирует доступность модулей

продлевает подписки

защищает от несанкционированного использования

Модуль лишь:



получает текущий тариф

включает / выключает функции в рамках модуля

🔥 8. ЛОГИКА ПОДДОМЕНОВ

Каждый подписчик имеет свои поддомены:



shop.tochkarosta.online

event.tochkarosta.online

portfolio.tochkarosta.online

Ядро:



резервирует поддомены

привязывает подписчика к модулю

управляет DNS через gateway

🔥 9. ЛОГИКА ПРОДЛЕНИЯ ПОДПИСКИ

У подписчика заканчивается trial или оплаченный период

Ядро уведомляет подписчика

Подписчик продлевает модуль

Модуль продолжает работать

Если подписчик не продлевает → модуль отключается, но данные не теряются.

🔥 10. ЛОГИКА АВТОМАТИЧЕСКИХ ЗАДАЧ

Платформа анализирует:



SEO

поведение покупателей

ошибки

загрузку модулей

Модуль анализирует:



продажи

заявки

просмотры товаров

отмены

AI генерирует подсказки:



улучшить описание

поднять карточку товара

добавить теги

улучшить фото

изменить цену

🔥 ИТОГ — Как работает бизнес-логика в целом

ЯДРО:

✔ хранит подписчиков



✔ хранит модули



✔ выдаёт токены



✔ управляет тарифами



✔ ничего не знает о продажах



✔ даёт SDK для модулей

МОДУЛИ:

✔ хранят товары, заказы, билеты, уроки, заявки



✔ работают с покупателями



✔ принимают оплаты в ЮKassa подписчика



✔ имеют свой frontend / backend / SEO



✔ подчиняются ядру по правам доступа

ПОКУПАТЕЛЬ:

✔ общается только с модулем



✔ не имеет доступа к ядру



✔ видит личный кабинет



✔ делает покупки или заявки

ПЛАТФОРМА:

✔ создаёт инфраструктуру



✔ помогает подписчику расти



✔ не вмешивается в бизнес подписчика


структура 


import os
import sys
from pathlib import Path

# ==============================================================================
# 1. КОНТЕНТ ФАЙЛОВ (SOURCE CODE)
# ==============================================================================

# --- 0. THE GRAND BLUEPRINT (Documentation) ---
GRAND_BLUEPRINT_MD = r"""# 👑 THE GRAND BLUEPRINT: MASTER ARCHITECT EDITION (v6.0 - FINAL)

## 🎯 1. ВВЕДЕНИЕ И РОЛЬ

Этот документ является **Единственным Источником Истины** для проекта **"Tochka Rosta"**. Любое изменение кода или архитектуры должно сверяться с этим документом.

**Твоя Роль:** CTO и Ведущий Архитектор.
**Твоя Миссия:** Защита Целостности Ядра, обеспечение изоляции данных и масштабируемости.

---

## 🏰 2. БИЗНЕС-МОДЕЛЬ И КОНЦЕПЦИЯ (ПРЕЗЕНТАЦИЯ)

**"Точка Роста"** — это экосистема (SaaS), где предприниматели арендуют готовые цифровые бизнесы (Модули) без необходимости нанимать программистов.

### 2.1. Иерархия Ролей и Зоны Ответственности

| Роль | Сущность в БД | Доступ (Порт) | Зона Ответственности |
| :--- | :--- | :--- | :--- |
| **Основатель** (Founder) | `User` (`is_superuser=True`) | **7003** (SuperAdmin) | Управление всей платформой, тарифами, модераторами. |
| **Модератор** (Master) | `User` (`role=master`) | **7001** (CMS) | Управление контентом публичного лендинга (SEO, Новости). |
| **Владелец** (Owner) | `User` (привязан к Tenant) | **7001** (Dashboard) | Вход по телефону. Управление своим бизнесом (Товары, Заказы). |
| **Подписчик** (Tenant) | `Tenant` (Бизнес-единица) | *N/A* | Юридическая сущность (Магазин). Владеет данными и доменом. |
| **Клиент** (Buyer) | *(Внутри Модуля)* | **7000** (Public Site) | Покупатель товаров. **Никогда не имеет доступа к Ядру.** |

### 2.2. Принципы Изоляции (THE IRON WALL)

1.  **ЯДРО (CORE) НИКОГДА НЕ ЗНАЕТ:**
    * О товарах, корзинах, заказах Клиентов.
    * О деньгах Клиентов (оплата идет напрямую Владельцу).
    * О структуре БД Модулей.
2.  **МОДУЛЬ (MODULE) НИКОГДА НЕ ЗНАЕТ:**
    * О базе данных Ядра.
    * О других модулях.
    * О глобальных тарифах (получает только свой статус через SDK).
3.  **ФИНАНСОВАЯ ИЗОЛЯЦИЯ:**
    * Ядро биллит Владельца за подписку (SaaS).
    * Владелец биллит Клиента за товары (E-commerce). Эти потоки не пересекаются.

---

## ⚙️ 3. ТЕХНИЧЕСКИЙ СТЕК И СТРУКТУРА

### 3.1. Основной Стек

* **Backend:** Python 3.11+, FastAPI (Async), Pydantic V2, ORJSON.
* **Database:** PostgreSQL (AsyncPG). **IDs = UUID** (Строго).
* **Auth/Cache:** Redis (хранение OTP и сессий).
* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
* **Gateway:** Node.js + Express (Dynamic Proxy).
* **Graphics:** Three.js + React Three Fiber (R3F) в модулях.

### 3.2. Структура Проекта (Vertical Slices)

```text
tochkarosta_core/
├── core-backend/           # ЯДРО (Port 8000)
│   ├── app/
│   │   ├── core/           # Config, DB Session
│   │   ├── modules/        # БИЗНЕС-ЛОГИКА
│   │   │   ├── auth/       # JWT, Login, Register
│   │   │   ├── tenants/    # Tenant & User Models
│   │   │   └── billing/    # Tariffs & Subscriptions
│   │   └── main.py
│
├── core-frontend/          # ИНТЕРФЕЙСЫ (Ports 7000-7003)
│   ├── app/
│   │   ├── (landing)/      # Public (7000)
│   │   ├── dashboard/      # Tenant/Moderator (7001)
│   │   └── super-admin/    # Founder (7003)
│
├── gateway/                # ПРОКСИ (Port 3000)
│   └── src/index.ts        # Маршрутизация по поддоменам
│
├── modules/                # ПАПКА С МОДУЛЯМИ (В ПРОДЕ - GIT CLONE)
│   ├── shop/               # Модуль Магазина
│   │   ├── backend/        # Port 8001
│   │   └── frontend/       # Port 5001
│   └── house/              # Модуль Строителя
│
└── module_template/        # ЭТАЛОН (ШАБЛОН) ДЛЯ СОЗДАНИЯ НОВЫХ