import random
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
from app.utils.validators import normalize_phone, validate_phone
from app.utils.helpers import generate_tenant_domain
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
            # Normalize phone
            normalized_phone = normalize_phone(data['phone'])
            if not normalized_phone:
                raise HTTPException(status_code=400, detail="Invalid phone number format")
            
            # Create Tenant
            new_tenant = Tenant(
                name=f"Company {data['last_name']}", 
                owner_phone=normalized_phone,
                domain=generate_tenant_domain(),
                status="active"
            )
            db.add(new_tenant)
            await db.flush()

            # Create User
            new_user = User(
                phone=normalized_phone,
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