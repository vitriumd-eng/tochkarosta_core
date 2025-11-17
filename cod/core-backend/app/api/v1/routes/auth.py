"""
Auth API - Phone-only registration with OTP
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional
from app.services.auth import AuthService
from app.services.sms import SMSService
from app.services.tenant import TenantService
from app.security.jwt import verify_token
import uuid

router = APIRouter()


def get_current_tenant(request: Request) -> uuid.UUID:
    """Get tenant_id from JWT token or request state"""
    # Try to get from request state (set by middleware)
    if hasattr(request.state, 'tenant_id') and request.state.tenant_id:
        return uuid.UUID(request.state.tenant_id)
    
    # Fallback: extract from Authorization token
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
        try:
            payload = verify_token(token)
            tenant_id = payload.get("tenant")
            if tenant_id:
                return uuid.UUID(tenant_id)
        except Exception:
            pass
    
    raise HTTPException(status_code=401, detail="Tenant not found in token")


class SendCodeRequest(BaseModel):
    phone: str  # E.164 format


class VerifyCodeRequest(BaseModel):
    phone: str
    code: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str


class RegisterRequest(BaseModel):
    phone: str  # E.164 format
    code: str  # OTP code


class RegisterResponse(BaseModel):
    token: str
    tenant_id: str


class ActivateModuleRequest(BaseModel):
    module_id: str
    subdomain: str


class ActivateModuleResponse(BaseModel):
    tenant_id: str
    module_id: str
    subdomain: str
    trial_days: int
    trial_expires: str


@router.post("/send-code")
async def send_code(data: SendCodeRequest):
    """Send OTP code to phone (rate-limited, TTL 5 minutes)"""
    # TODO: Implement rate limiting per IP/phone
    # TODO: Check blocked phones in deleted_accounts_history
    
    sms_service = SMSService()
    result = await sms_service.send_otp(data.phone)
    
    if not result:
        raise HTTPException(status_code=400, detail="Failed to send OTP")
    
    return {"message": "OTP sent", "ttl": 300}  # 5 minutes


@router.post("/verify")
async def verify_code(data: VerifyCodeRequest) -> AuthResponse:
    """Verify OTP code and create user + tenant, issue tokens"""
    auth_service = AuthService()
    sms_service = SMSService()
    
    # Verify OTP
    valid = await sms_service.verify_otp(data.phone, data.code)
    if not valid:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Get or create user
    user = await auth_service.get_or_create_user(data.phone)
    
    # Get or create tenant
    tenant = await auth_service.get_or_create_tenant(user.id)
    
    # Issue tokens
    from app.security.jwt import create_access_token, create_refresh_token
    
    access_token = create_access_token({
        "sub": str(user.id),
        "tenant": str(tenant.id)
    })
    refresh_token = create_refresh_token({
        "sub": str(user.id)
    })
    
    # Mark phone as verified
    await auth_service.mark_phone_verified(user.id)
    
    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )


@router.post("/register")
async def register_user(data: RegisterRequest) -> RegisterResponse:
    """
    Registration flow (without module activation):
    1. Verify OTP code
    2. Check if phone already registered (anti-trial abuse)
    3. Create user
    4. Create tenant (without plan, status='inactive', active_module=NULL)
    5. Create JWT token
    """
    auth_service = AuthService()
    sms_service = SMSService()
    tenant_service = TenantService()
    
    # 1. Verify OTP
    valid = await sms_service.verify_otp(data.phone, data.code)
    if not valid:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # 2. Check if phone already registered (anti-trial abuse)
    from sqlalchemy import select, desc
    from app.models.deleted_accounts_history import DeletedAccountsHistory
    from app.db.session import AsyncSessionLocal
    
    async with AsyncSessionLocal() as db:
        # Check if user exists
        from app.models.user import User
        user_stmt = select(User).where(User.phone == data.phone)
        user_result = await db.execute(user_stmt)
        existing_user = user_result.scalar_one_or_none()
        
        if existing_user:
            # Check deleted accounts history
            deleted_stmt = select(DeletedAccountsHistory).where(
                DeletedAccountsHistory.phone == data.phone
            ).order_by(desc(DeletedAccountsHistory.deleted_at)).limit(1)
            deleted_result = await db.execute(deleted_stmt)
            deleted = deleted_result.scalar_one_or_none()
            
            if deleted:
                raise HTTPException(
                    status_code=403,
                    detail="This phone number is blocked. Please contact support."
                )
            else:
                raise HTTPException(
                    status_code=400,
                    detail="User with this phone already exists"
                )
    
    # 3. Create user
    user = await auth_service.create_user(data.phone)
    
    # 4. Create tenant (without plan, status='inactive', active_module=NULL)
    tenant = await tenant_service.create_tenant(
        owner_id=user.id,
        name=f"Tenant {user.id}"
    )
    
    # 5. Create JWT token
    from app.security.jwt import create_access_token
    access_token = create_access_token({
        "sub": str(user.id),
        "tenant": str(tenant.id)
    })
    
    # Mark phone as verified
    await auth_service.mark_phone_verified(user.id)
    
    return RegisterResponse(
        token=access_token,
        tenant_id=str(tenant.id)
    )


@router.post("/activate-module")
async def activate_module(
    data: ActivateModuleRequest,
    tenant_id: uuid.UUID = Depends(get_current_tenant)
) -> ActivateModuleResponse:
    """
    Activate module for tenant:
    1. Check module is registered
    2. Check module dependencies
    3. Check subdomain availability
    4. Activate module (set active_module)
    5. Reserve subdomain
    6. Create trial subscription (with duration from module_settings)
    """
    from app.modules.registry import is_module_registered
    from app.modules.sdk import check_dependencies
    from app.services.subscription import SubscriptionService
    
    tenant_service = TenantService()
    subscription_service = SubscriptionService()
    
    # 1. Check module is registered
    if not is_module_registered(data.module_id):
        raise HTTPException(
            status_code=400,
            detail=f"Module '{data.module_id}' not found or not registered"
        )
    
    # 2. Check module dependencies
    deps = await check_dependencies(data.module_id)
    if not deps.get("ok"):
        raise HTTPException(
            status_code=400,
            detail=f"Module dependencies not met: {deps.get('missing')} {deps.get('inactive')}"
        )
    
    # 3. Check subdomain availability
    subdomain_available = await tenant_service.check_subdomain_availability(data.subdomain)
    if not subdomain_available:
        raise HTTPException(
            status_code=400,
            detail=f"Subdomain '{data.subdomain}' is already taken"
        )
    
    # 4. Check if tenant already has active module and activate
    from sqlalchemy import select
    from app.models.tenant import Tenant
    from app.db.session import AsyncSessionLocal
    
    async with AsyncSessionLocal() as db:
        tenant_stmt = select(Tenant).where(Tenant.id == tenant_id)
        tenant_result = await db.execute(tenant_stmt)
        tenant = tenant_result.scalar_one_or_none()
        
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        if tenant.active_module:
            raise HTTPException(
                status_code=400,
                detail=f"Tenant already has active module: {tenant.active_module}"
            )
        
        # 5. Activate module (set active_module)
        tenant.active_module = data.module_id
        await db.flush()
    
    # 6. Reserve subdomain
    await tenant_service.reserve_subdomain(
        tenant_id=tenant_id,
        subdomain=data.subdomain
    )
    
    # 7. Create trial subscription (with duration from module_settings)
    subscription = await subscription_service.create_trial_subscription(
        tenant_id=tenant_id,
        module_id=data.module_id
    )
    
    # 8. Get trial days for response
    trial_days = await subscription_service.get_trial_days_for_module(data.module_id)
    
    return ActivateModuleResponse(
        tenant_id=str(tenant_id),
        module_id=data.module_id,
        subdomain=data.subdomain,
        trial_days=trial_days,
        trial_expires=subscription.expires_at.isoformat() if subscription.expires_at else ""
    )


@router.get("/check-subdomain/{subdomain}")
async def check_subdomain(subdomain: str):
    """Check if subdomain is available"""
    tenant_service = TenantService()
    available = await tenant_service.check_subdomain_availability(subdomain)
    return {"available": available, "subdomain": subdomain}
