"""
Auth Pydantic Schemas
"""
from pydantic import BaseModel, Field, validator
from typing import Optional
import uuid


class SendCodeRequest(BaseModel):
    """Schema for sending OTP code"""
    phone: str = Field(..., description="User phone number in E.164 format")


class VerifyCodeRequest(BaseModel):
    """Schema for verifying OTP code"""
    phone: str = Field(..., description="User phone number")
    code: str = Field(..., description="OTP code")


class AuthResponse(BaseModel):
    """Schema for authentication response"""
    access_token: str
    refresh_token: str


class RegisterRequest(BaseModel):
    """Schema for user registration"""
    phone: str = Field(..., description="User phone number")
    code: str = Field(..., description="OTP verification code")


class RegisterResponse(BaseModel):
    """Schema for registration response"""
    token: str
    tenant_id: str


class ActivateModuleResponse(BaseModel):
    """Schema for module activation response"""
    tenant_id: str
    module_id: str
    subdomain: str
    trial_days: int
    trial_expires: Optional[str] = None


class RequestCodeRequest(BaseModel):
    """Schema for requesting verification code"""
    channel: str = Field(..., description="Channel: 'telegram' or 'max'")
    identifier: str = Field(..., description="Telegram @username or MAX user_id")
    
    @validator('channel')
    def validate_channel(cls, v):
        """Validate channel value"""
        if v not in ['telegram', 'max']:
            raise ValueError('Channel must be telegram or max')
        return v


class ConfirmCodeRequest(BaseModel):
    """Schema for confirming verification code"""
    channel: str = Field(..., description="Channel: 'telegram' or 'max'")
    identifier: str = Field(..., description="Telegram @username or MAX user_id")
    code: str = Field(..., description="6-digit verification code")
    
    @validator('channel')
    def validate_channel(cls, v):
        """Validate channel value"""
        if v not in ['telegram', 'max']:
            raise ValueError('Channel must be telegram or max')
        return v
    
    @validator('code')
    def validate_code(cls, v):
        """Validate code format"""
        if not v.isdigit() or len(v) != 6:
            raise ValueError('Code must be a 6-digit number')
        return v


class ConfirmCodeResponse(BaseModel):
    """Schema for confirm code response"""
    confirmed: bool
    tenant_id: str


class LoginRequest(BaseModel):
    """Schema for platform master login"""
    login: str = Field(..., description="Phone number")
    password: str = Field(..., description="Password")
    
    class Config:
        extra = "forbid"


class LoginResponse(BaseModel):
    """Schema for login response"""
    token: str
    role: str





