"""
Middleware для проверки JWT токенов и извлечения информации о пользователе
"""
from fastapi import HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.core.database import get_db
from app.models.user import User
from app.utils.jwt import decode_token
import uuid

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Получить текущего пользователя из JWT токена"""
    try:
        token = credentials.credentials
        payload = decode_token(token)
        
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token missing user ID")
        
        try:
            user_uuid = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid user ID format")
        
        result = await db.execute(select(User).where(User.id == user_uuid))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        if hasattr(user, 'is_deleted') and user.is_deleted:
            raise HTTPException(status_code=401, detail="User is deleted")
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger("core.auth")
        logger.error(f"Error in get_current_user: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

async def get_current_tenant_id(
    user: User = Depends(get_current_user)
) -> uuid.UUID:
    """Получить tenant_id текущего пользователя"""
    if not user.tenant_id:
        raise HTTPException(status_code=403, detail="User has no associated tenant")
    return user.tenant_id

async def get_superuser(
    user: User = Depends(get_current_user)
) -> User:
    """Проверить, что пользователь является суперпользователем"""
    if not user.is_superuser:
        raise HTTPException(status_code=403, detail="Superuser access required")
    return user

async def get_owner_or_superuser(
    user: User = Depends(get_current_user)
) -> User:
    """Проверить, что пользователь является владельцем или суперпользователем"""
    if not user.is_superuser and user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner or superuser access required")
    return user



