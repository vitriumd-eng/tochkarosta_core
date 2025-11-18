"""
Auth Pydantic Schemas
"""
from pydantic import BaseModel, Field, validator
from typing import Optional
import uuid


class SendCodeRequest(BaseModel):
    """Schema for sending OTP code (TG/MAX)"""
    phone: str = Field(..., description="User phone number in E.164 format")
    provider: str = Field(..., description="Provider: telegram or max")
    
    @validator('provider')
    def validate_provider(cls, v):
        if v not in ['telegram', 'max']:
            raise ValueError('Provider must be telegram or max')
        return v.lower()


class VerifyCodeRequest(BaseModel):
    """Schema for verifying OTP code and creating user+tenant"""
    phone: str = Field(..., description="User phone number")
    code: str = Field(..., description="OTP code")
    provider: str = Field(..., description="Provider: telegram or max")
    
    @validator('provider')
    def validate_provider(cls, v):
        if v not in ['telegram', 'max']:
            raise ValueError('Provider must be telegram or max')
        return v.lower()


class AuthResponse(BaseModel):
    """Schema for authentication response"""
    access_token: str
    refresh_token: str
    tenant_id: str
    user_id: Optional[str] = None


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


class ExternalAuthRequest(BaseModel):
    """Schema for OAuth external authentication request"""
    provider: str = Field(..., description="OAuth provider: 'telegram' or 'max'")
    external_id: str = Field(..., description="External provider user ID")
    username: Optional[str] = Field(None, description="Username from provider")
    first_name: Optional[str] = Field(None, description="First name from provider")
    last_name: Optional[str] = Field(None, description="Last name from provider")
    signature: str = Field(..., description="Signature/hash for verification")
    
    @validator('provider')
    def validate_provider(cls, v):
        """Validate provider value"""
        if v not in ['telegram', 'max']:
            raise ValueError('Provider must be telegram or max')
        return v


class OAuthAuthResponse(BaseModel):
    """Schema for OAuth authentication response"""
    access_token: str
    refresh_token: str
    tenant_id: str
    user_id: str


class OAuthVKRequest(BaseModel):
    """Schema for VK OAuth callback request"""
    code: str = Field(..., description="VK OAuth authorization code")





