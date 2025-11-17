"""
User Pydantic Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid
from app.models.roles import UserRole


class UserCreate(BaseModel):
    """Schema for creating a new user"""
    phone: str = Field(..., min_length=10, max_length=20, description="User phone number")
    password: str = Field(..., min_length=8, description="User password")
    role: Optional[UserRole] = Field(None, description="User role")


class UserResponse(BaseModel):
    """Schema for user response"""
    id: uuid.UUID
    phone: str
    phone_verified: bool
    role: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class PlatformMasterCreate(BaseModel):
    """Schema for creating platform_master user"""
    phone: str = Field(..., min_length=10, max_length=20, description="Platform master phone number")
    password: str = Field(..., min_length=8, description="Platform master password")

