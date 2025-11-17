"""
Users API - User management endpoints
"""
from fastapi import APIRouter, HTTPException
import uuid
from app.services.user_service import (
    create_platform_master,
    get_user_by_phone,
    get_user_by_id,
)
from app.schemas.user import UserCreate, UserResponse
from app.db.session import AsyncSessionLocal

router = APIRouter()


@router.post("/", response_model=UserResponse)
async def create_user(user_data: UserCreate):
    """
    Create a new user
    
    Args:
        user_data: User creation data
        db: Database session
        
    Returns:
        Created user response
    """
    try:
        async with AsyncSessionLocal() as db:
            # For now, only platform_master creation is supported
            # Regular user creation should go through auth registration flow
            if user_data.role and user_data.role.value == "platform_master":
                user = await create_platform_master(
                    phone=user_data.phone,
                    password=user_data.password,
                    db=db
                )
                return UserResponse(
                    id=user.id,
                    phone=user.phone,
                    phone_verified=user.phone_verified,
                    role=user.role.value if user.role else None,
                    created_at=user.created_at
                )
            else:
                raise HTTPException(
                    status_code=400,
                    detail="User creation through this endpoint is only supported for platform_master role. Use registration flow for regular users."
                )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: uuid.UUID):
    """
    Get user by ID
    
    Args:
        user_id: User UUID
        
    Returns:
        User response
    """
    async with AsyncSessionLocal() as db:
        user = await get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        phone=user.phone,
        phone_verified=user.phone_verified,
        role=user.role.value if user.role else None,
        created_at=user.created_at
    )


@router.get("/by-phone/{phone}", response_model=UserResponse)
async def get_user_by_phone_endpoint(phone: str):
    """
    Get user by phone number
    
    Args:
        phone: User phone number
        
    Returns:
        User response
    """
    async with AsyncSessionLocal() as db:
        user = await get_user_by_phone(phone, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        phone=user.phone,
        phone_verified=user.phone_verified,
        role=user.role.value if user.role else None,
        created_at=user.created_at
    )

