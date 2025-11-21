from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.modules.auth.schemas import *
from app.modules.auth.service import auth_service
from app.models.user import User
from app.utils.hashing import verify_password
from app.utils.jwt import create_access_token
from app.middleware.auth import get_current_user

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
    
    token_data = {
        "sub": str(user.id),
        "role": user.role
    }
    if user.tenant_id:
        token_data["tenant"] = str(user.tenant_id)
    
    token = create_access_token(data=token_data)
    
    response.set_cookie(key="access_token", value=f"Bearer {token}", httponly=True)
    
    return {"access_token": token, "token_type": "bearer", "user_id": str(user.id), "tenant_id": str(user.tenant_id)}

@router.post("/register-full")
async def register_full(data: CompleteRegistrationRequest, response: Response, db: AsyncSession = Depends(get_db)):
    # 1. Verify OTP (only if code is provided)
    if data.code and not await auth_service.verify_code_only(data.phone, data.code):
        raise HTTPException(status_code=400, detail="Неверный код подтверждения")
    
    # 2. Create Entities
    result = await auth_service.register_new_user(db, data.model_dump())
    
    response.set_cookie(key="access_token", value=f"Bearer {result['access_token']}", httponly=True)
    return result

@router.get("/me")
async def get_current_user_info(user: User = Depends(get_current_user)):
    """Получить информацию о текущем пользователе"""
    try:
        response_data = {
            "id": str(user.id),
            "phone": user.phone or "",
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "role": user.role or "subscriber",
            "is_superuser": bool(user.is_superuser) if user.is_superuser is not None else False
        }
        
        if user.tenant_id:
            response_data["tenant_id"] = str(user.tenant_id)
        else:
            response_data["tenant_id"] = None
            
        return response_data
    except Exception as e:
        import logging
        logger = logging.getLogger("core.auth")
        logger.error(f"Error in /me endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error getting user info: {str(e)}")