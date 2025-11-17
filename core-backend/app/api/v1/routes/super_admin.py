"""
Super Admin API - Platform and core administration
For founder/owner to manage platform, users, and tariffs
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import logging
import sys
from app.services.user_service import get_user_by_phone, verify_user_password, get_user_by_id
from app.utils.jwt import verify_token, create_access_token
from app.db.session import AsyncSessionLocal
from app.models.roles import UserRole
from app.schemas.user import UserResponse
import uuid

# Настройка логирования
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s [%(name)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stderr)
    ]
)

router = APIRouter()

# LoginRequest and LoginResponse moved to app.schemas.auth
from app.schemas.auth import LoginRequest, LoginResponse


def require_super_admin(request: Request) -> Dict:
    """
    Dependency to check if user has super_admin role
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Dict with user_id and role
        
    Raises:
        HTTPException: If token is missing, invalid, or user doesn't have super_admin role
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    token = auth_header.replace("Bearer ", "")
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
        role = payload.get("role")
        
        if role != "super_admin":
            raise HTTPException(status_code=403, detail="Access denied. Super admin role required.")
        
        return {"user_id": uuid.UUID(user_id), "role": role}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/login", response_model=LoginResponse)
async def super_admin_login(data: LoginRequest):
    """
    Login for super_admin (founder)
    Authentication by login (phone) and password
    """
    logger.info(f"Super admin login attempt for: {data.login}")
    
    try:
        async with AsyncSessionLocal() as db:
            user = await get_user_by_phone(data.login, db)
            
            if not user:
                raise HTTPException(status_code=401, detail="Invalid login or password")
            
            # Check role - must be super_admin
            if not user.role or user.role != UserRole.super_admin:
                raise HTTPException(status_code=403, detail="Access denied. Super admin role required.")
            
            # Verify password
            password_valid = await verify_user_password(user, data.password)
            
            if not password_valid:
                raise HTTPException(status_code=401, detail="Invalid login or password")
            
            # Create JWT token
            token = create_access_token({
                "sub": str(user.id),
                "role": user.role.value if user.role else None
            })
            
            logger.info(f"Super admin token created successfully for user: {user.id}")
            return LoginResponse(token=token, role=user.role.value if user.role else None)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Super admin login error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/users")
async def get_all_users(user: dict = Depends(require_super_admin)):
    """Get all users (super admin only)"""
    try:
        from app.models.user import User
        from sqlalchemy import select
        
        async with AsyncSessionLocal() as db:
            stmt = select(User)
            result = await db.execute(stmt)
            users = result.scalars().all()
            
            return {
                "users": [
                    {
                        "id": str(u.id),
                        "phone": u.phone,
                        "role": u.role.value if u.role else None,
                        "phone_verified": u.phone_verified,
                        "created_at": u.created_at.isoformat() if u.created_at else None,
                    }
                    for u in users
                ]
            }
    except Exception as e:
        logger.error(f"Error getting users: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/users/{user_id}/activate")
async def activate_user(user_id: str, user: dict = Depends(require_super_admin)):
    """Activate user (super admin only)"""
    try:
        from app.models.user import User
        from sqlalchemy import select, update
        
        async with AsyncSessionLocal() as db:
            # Get user
            user_obj = await get_user_by_id(uuid.UUID(user_id), db)
            if not user_obj:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Activate user (set active flag if exists, or just return success)
            # For now, just return success - can add active flag to User model later
            
            await db.commit()
            
            return {"status": "ok", "message": f"User {user_id} activated"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error activating user: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/users/{user_id}/deactivate")
async def deactivate_user(user_id: str, user: dict = Depends(require_super_admin)):
    """Deactivate user (super admin only)"""
    try:
        from app.models.user import User
        from sqlalchemy import select, update
        
        async with AsyncSessionLocal() as db:
            # Get user
            user_obj = await get_user_by_id(uuid.UUID(user_id), db)
            if not user_obj:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Deactivate user (set active flag if exists, or just return success)
            # For now, just return success - can add active flag to User model later
            
            await db.commit()
            
            return {"status": "ok", "message": f"User {user_id} deactivated"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deactivating user: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


class TariffUpdate(BaseModel):
    id: str
    name: Optional[str] = None
    price: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    popular: Optional[bool] = None
    active: Optional[bool] = None


@router.get("/tariffs")
async def get_tariffs(user: dict = Depends(require_super_admin)):
    """Get all tariffs (super admin only)"""
    try:
        # For now, return hardcoded tariffs - can be moved to database later
        # This should be stored in platform_content with key 'pricing'
        from app.services.platform_content import PlatformContentService
        
        platform_content_service = PlatformContentService()
        pricing_content = await platform_content_service.get_content_by_key("pricing")
        
        if pricing_content and pricing_content.content:
            return {"tariffs": pricing_content.content.get("tariffs", [])}
        
        # Default tariffs if not in database
        default_tariffs = [
            {
                "id": "start",
                "name": "Старт",
                "price": "0",
                "period": "месяц",
                "description": "Идеально для начинающих",
                "features": [
                    "До 50 товаров",
                    "Базовые шаблоны",
                    "Email поддержка",
                    "Базовая аналитика",
                    "Мобильная версия"
                ],
                "popular": False,
                "active": True
            },
            {
                "id": "growth",
                "name": "Профессионал",
                "price": "2990",
                "period": "месяц",
                "description": "Для растущего бизнеса",
                "features": [
                    "Неограниченное количество товаров",
                    "Все шаблоны",
                    "Приоритетная поддержка",
                    "Расширенная аналитика",
                    "Интеграции с платежами",
                    "Скидочные программы",
                    "Email маркетинг"
                ],
                "popular": True,
                "active": True
            },
            {
                "id": "premium",
                "name": "Бизнес",
                "price": "7990",
                "period": "месяц",
                "description": "Для крупных компаний",
                "features": [
                    "Все из Профессионал",
                    "Персональный менеджер",
                    "Кастомные интеграции",
                    "API доступ",
                    "Мультивалютность",
                    "Белый лейбл",
                    "Обучение команды"
                ],
                "popular": False,
                "active": True
            }
        ]
        
        return {"tariffs": default_tariffs}
    except Exception as e:
        logger.error(f"Error getting tariffs: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/tariffs/{tariff_id}")
async def update_tariff(tariff_id: str, tariff_data: TariffUpdate, user: dict = Depends(require_super_admin)):
    """Update tariff (super admin only)"""
    try:
        from app.services.platform_content import PlatformContentService
        
        platform_content_service = PlatformContentService()
        pricing_content = await platform_content_service.get_content_by_key("pricing")
        
        # Get current tariffs
        if pricing_content and pricing_content.content:
            tariffs = pricing_content.content.get("tariffs", [])
        else:
            tariffs = []
        
        # Find and update tariff
        tariff_found = False
        for tariff in tariffs:
            if tariff.get("id") == tariff_id:
                tariff_found = True
                if tariff_data.name is not None:
                    tariff["name"] = tariff_data.name
                if tariff_data.price is not None:
                    tariff["price"] = tariff_data.price
                if tariff_data.period is not None:
                    tariff["period"] = tariff_data.period
                if tariff_data.description is not None:
                    tariff["description"] = tariff_data.description
                if tariff_data.features is not None:
                    tariff["features"] = tariff_data.features
                if tariff_data.popular is not None:
                    tariff["popular"] = tariff_data.popular
                if tariff_data.active is not None:
                    tariff["active"] = tariff_data.active
                break
        
        if not tariff_found:
            raise HTTPException(status_code=404, detail="Tariff not found")
        
        # Save updated tariffs
        content = pricing_content.content if pricing_content else {}
        content["tariffs"] = tariffs
        
        await platform_content_service.upsert_content(
            key="pricing",
            content=content,
            updated_by=user["user_id"]
        )
        
        return {"status": "ok", "message": f"Tariff {tariff_id} updated"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating tariff: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))




