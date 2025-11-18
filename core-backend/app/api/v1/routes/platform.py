"""
Platform API - Content management for landing page
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
import sys
from app.services.platform_content import PlatformContentService
from app.services.user_service import create_platform_master, get_user_by_phone, verify_user_password
from app.utils.jwt import verify_token, create_access_token
from app.db.session import AsyncSessionLocal
from app.models.roles import UserRole
from app.schemas.user import PlatformMasterCreate, UserResponse
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

platform_content_service = PlatformContentService()


# require_platform_master moved to app.api.deps.dependencies
from app.api.deps.dependencies import require_platform_master


# LoginRequest and LoginResponse moved to app.schemas.auth
from app.schemas.auth import LoginRequest, LoginResponse


class UpdateContentRequest(BaseModel):
    content: Dict[str, Any]


@router.post("/login", response_model=LoginResponse)
async def platform_login(data: LoginRequest):
    """
    Login for platform_master
    Authentication by login (phone) and password
    """
    logger.debug("===== LOGIN REQUEST START =====")
    logger.info(f"Login attempt for: {data.login}")
    logger.debug(f"Request data: login={data.login}, password length={len(data.password)}")
    
    try:
        logger.debug("Attempting to get database connection...")
        logger.info(f"[PLATFORM_LOGIN] Starting login for: {data.login}")
        try:
            async with AsyncSessionLocal() as db:
                logger.debug("Database connection established")
                
                # Find user by phone using ORM
                try:
                    logger.debug(f"Executing query for phone: {data.login}")
                    user = await get_user_by_phone(data.login, db)
                    logger.debug(f"User found: {user is not None}")
                except Exception as db_error:
                    logger.error(f"Database error: {str(db_error)}", exc_info=True)
                    raise HTTPException(
                        status_code=500,
                        detail=f"Database error: {str(db_error)}"
                    )
                
                if not user:
                    raise HTTPException(status_code=401, detail="Invalid login or password")
                
                # Check role - handle None role
                if not user.role or user.role != UserRole.platform_master:
                    raise HTTPException(status_code=403, detail="Access denied. Platform master role required.")
                
                # Verify password using service
                try:
                    password_valid = await verify_user_password(user, data.password)
                    logger.debug(f"Password verification result: {password_valid}")
                except Exception as password_error:
                    logger.error(f"Password verification error: {str(password_error)}", exc_info=True)
                    password_valid = False
                
                if not password_valid:
                    raise HTTPException(status_code=401, detail="Invalid login or password")
                
                # Create JWT token
                try:
                    logger.debug(f"Creating token for user: {user.id}, role: {user.role.value if user.role else None}")
                    token = create_access_token({
                        "sub": str(user.id),
                        "role": user.role.value if user.role else None
                    })
                    logger.info(f"Token created successfully for user: {user.id}")
                except Exception as jwt_error:
                    logger.error(f"JWT creation error: {str(jwt_error)}", exc_info=True)
                    raise HTTPException(
                        status_code=500,
                        detail=f"Token creation error: {str(jwt_error)}"
                    )
                
                logger.debug("Returning LoginResponse")
                return LoginResponse(token=token, role=user.role.value if user.role else None)
        except HTTPException:
            raise
        except Exception as db_conn_error:
            logger.error(f"[PLATFORM_LOGIN] Database connection error: {type(db_conn_error).__name__}: {db_conn_error}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Database connection error: {str(db_conn_error)}"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("===== UNEXPECTED ERROR IN PLATFORM_LOGIN =====", exc_info=True)
        logger.error(f"Error type: {type(e).__name__}, Error message: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        from sqlalchemy import select, func
        from app.models.user import User
        async with AsyncSessionLocal() as db:
            # Simple query to check database connection
            result = await db.execute(select(func.count()).select_from(User).limit(1))
            result.scalar()
            return {"status": "ok", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        return {"status": "error", "database": "disconnected", "error": "Database connection failed"}

@router.get("/test")
async def test_endpoint():
    """Простой тестовый endpoint без БД"""
    return {"status": "ok", "message": "Platform router works"}

@router.post("/test-login")
async def test_login_simple(data: LoginRequest):
    """Упрощенный тест логина без БД"""
    return {"status": "ok", "login": data.login, "password_length": len(data.password)}


@router.post("/register-master", response_model=UserResponse)
async def register_master(user_data: PlatformMasterCreate):
    """
    Register new platform_master user
    Creates or updates platform_master user with given phone and password
    """
    logger.info(f"Registering platform_master user: {user_data.phone}")
    
    try:
        async with AsyncSessionLocal() as db:
            user = await create_platform_master(
                phone=user_data.phone,
                password=user_data.password,
                db=db
            )
            
            logger.info(f"Platform master user registered successfully: {user.id}")
            
            return UserResponse(
                id=user.id,
                phone=user.phone,
                phone_verified=user.phone_verified,
                role=user.role.value if user.role else None,
                created_at=user.created_at
            )
    except ValueError as e:
        logger.error(f"Failed to register platform_master: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during platform_master registration: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/content/public")
async def get_public_content():
    """Get public platform content (hero_banner and telegram_settings, no auth required)"""
    try:
        result = {}
        
        # Get hero_banner
        hero_banner = await platform_content_service.get_content_by_key("hero_banner")
        if hero_banner:
            result["hero_banner"] = {
                "content": hero_banner.content,
                "updated_at": hero_banner.updated_at.isoformat() if hero_banner.updated_at else None
            }
        else:
            result["hero_banner"] = None
        
        # Get telegram_settings (for bot_id)
        telegram_settings = await platform_content_service.get_content_by_key("telegram_settings")
        if telegram_settings:
            result["telegram_settings"] = {
                "content": telegram_settings.content,
                "updated_at": telegram_settings.updated_at.isoformat() if telegram_settings.updated_at else None
            }
        else:
            result["telegram_settings"] = None
        
        return result
    except Exception as e:
        logger.error(f"Error getting public content: {e}", exc_info=True)
        return {"hero_banner": None, "telegram_settings": None}


@router.get("/content")
async def get_all_content(user: dict = Depends(require_platform_master)):
    """Get all platform content sections (requires authentication)"""
    content = await platform_content_service.get_all_content()
    return content


@router.put("/content/{key}")
async def update_content(
    key: str,
    data: UpdateContentRequest,
    user: dict = Depends(require_platform_master)
):
    """Update platform content section"""
    updated_content = await platform_content_service.upsert_content(
        key=key,
        content=data.content,
        updated_by=user["user_id"]
    )
    
    return {
        "status": "ok",
        "key": updated_content.key,
        "updated_at": updated_content.updated_at.isoformat()
    }

