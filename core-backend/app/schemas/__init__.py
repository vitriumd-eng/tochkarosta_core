"""
Pydantic Schemas Module
"""
from app.schemas.user import (
    UserCreate,
    UserResponse,
    PlatformMasterCreate,
)
from app.schemas.tenant import (
    TenantCreate,
    TenantResponse,
    TenantUpdate,
)
from app.schemas.module import (
    ModuleResponse,
    ModuleListResponse,
    ModuleSwitchRequest,
    ModuleSwitchResponse,
)
from app.schemas.auth import (
    SendCodeRequest,
    VerifyCodeRequest,
    AuthResponse,
    RegisterRequest,
    RegisterResponse,
    ActivateModuleResponse,
    LoginRequest,
    LoginResponse,
)

__all__ = [
    "UserCreate",
    "UserResponse",
    "PlatformMasterCreate",
    "TenantCreate",
    "TenantResponse",
    "TenantUpdate",
    "ModuleResponse",
    "ModuleListResponse",
    "ModuleSwitchRequest",
    "ModuleSwitchResponse",
    "SendCodeRequest",
    "VerifyCodeRequest",
    "AuthResponse",
    "RegisterRequest",
    "RegisterResponse",
    "ActivateModuleResponse",
    "LoginRequest",
    "LoginResponse",
]





