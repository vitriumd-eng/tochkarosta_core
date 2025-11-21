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
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from typing import List, TYPE_CHECKING, Optional
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
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="subscription")
    tariff: Mapped["Tariff"] = relationship("Tariff", back_populates="subscriptions")
"""

# ------------------------------------------------------------------------------
# UTILS (JWT, Hashing)
# ------------------------------------------------------------------------------

JWT_UTILS_PY = r"""from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt
from app.core.config import settings

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: Dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.JWTError:
        return None
"""

HASHING_UTILS_PY = r"""from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
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
        # Generates OTP. NO SMS SENT. Returns code in Dev Mode.
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
    result = await auth_service.register_new_user(db, data.model_dump())
    
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
    print(f"[OK] Created: {path}")

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
        
        "core-backend/app/models/__init__.py": "",
        "core-backend/app/models/user.py": MODELS_USER_PY,
        "core-backend/app/models/tenant.py": MODELS_TENANT_PY,
        "core-backend/app/modules/billing/__init__.py": "",
        "core-backend/app/modules/billing/models.py": MODELS_BILLING_PY,
        
        "core-backend/app/modules/auth/__init__.py": "",
        "core-backend/app/modules/auth/schemas.py": AUTH_SCHEMAS_PY,
        "core-backend/app/modules/auth/service.py": AUTH_SERVICE_PY,
        "core-backend/app/modules/auth/routes.py": AUTH_ROUTES_PY,
        
        "core-backend/app/utils/__init__.py": "",
        "core-backend/app/utils/jwt.py": JWT_UTILS_PY,
        "core-backend/app/utils/hashing.py": HASHING_UTILS_PY,
        
        # --- FRONTEND ---
        "core-frontend/app/register/RegisterForm.tsx": REGISTER_FORM_TSX,
        "core-frontend/app/error.tsx": ERROR_TSX,
        
        # --- PLACEHOLDERS ---
        "gateway/src/index.ts": "// Gateway Placeholder",
        "modules/.gitkeep": "",
        "core-backend/app/modules/tenants/__init__.py": "",
        "core-backend/app/core/__init__.py": "",
    }

    print("\n[START] DEPLOYING TOCHKA ROSTA (v2.0 FULL)...\n")
    for path, content in files.items():
        create_file(path, content)
    
    print("\n[OK] DONE! Project structure created.")
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

