"""
Auth API - Phone-only registration with OTP
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from starlette.requests import Request
from pydantic import BaseModel
from typing import Optional
from app.services.auth import AuthService
from app.services.sms import SMSService
from app.services.tenant import TenantService
from app.utils.jwt import verify_token
import uuid
import logging
import time
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()


# get_current_tenant moved to app.api.deps.dependencies
from app.api.deps.dependencies import get_current_tenant

# Schemas moved to app.schemas.auth
from app.schemas.auth import (
    SendCodeRequest,
    VerifyCodeRequest,
    AuthResponse,
    RegisterRequest,
    RegisterResponse,
    ActivateModuleResponse,
    RequestCodeRequest,
    ConfirmCodeRequest,
    ConfirmCodeResponse,
)


class ActivateModuleRequest(BaseModel):
    """Request schema for activating module (kept local as it's specific to this endpoint)"""
    module_id: str
    subdomain: str
    tenant_id: Optional[str] = None


@router.post("/request_code")
async def request_code(data: RequestCodeRequest, request: Request):
    """
    Request verification code for Telegram/MAX registration
    In dev mode, code is logged to console
    """
    request_id = request.headers.get("X-Request-ID", "unknown")
    start_time = time.time()
    
    logger.info(
        "[AUTH] /request_code - Request received",
        extra={
            "request_id": request_id,
            "channel": data.channel,
            "identifier": data.identifier,
            "identifier_length": len(data.identifier) if data.identifier else 0,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )
    
    try:
        if data.channel not in ["telegram", "max"]:
            logger.warning(
                "[AUTH] /request_code - Invalid channel",
                extra={
                    "request_id": request_id,
                    "channel": data.channel,
                    "identifier": data.identifier,
                }
            )
            raise HTTPException(status_code=400, detail="Channel must be 'telegram' or 'max'")
        
        logger.debug(
            "[AUTH] /request_code - Creating VerificationService",
            extra={"request_id": request_id, "channel": data.channel}
        )
        
        from app.services.verification import VerificationService
        verification_service = VerificationService()
        
        logger.debug(
            "[AUTH] /request_code - Generating code",
            extra={
                "request_id": request_id,
                "channel": data.channel,
                "identifier": data.identifier,
            }
        )
        
        code = await verification_service.generate_code(data.channel, data.identifier)
        
        duration = time.time() - start_time
        logger.info(
            "[AUTH] /request_code - Code generated successfully",
            extra={
                "request_id": request_id,
                "channel": data.channel,
                "identifier": data.identifier,
                "code_length": len(code) if code else 0,
                "code_preview": f"{code[:2]}****" if code and len(code) >= 2 else "****",
                "duration_ms": int(duration * 1000),
                "timestamp": datetime.utcnow().isoformat(),
            }
        )
        
        return {"sent": True}
    except HTTPException:
        duration = time.time() - start_time
        logger.error(
            "[AUTH] /request_code - HTTPException",
            exc_info=True,
            extra={
                "request_id": request_id,
                "channel": data.channel,
                "identifier": data.identifier,
                "duration_ms": int(duration * 1000),
            }
        )
        raise
    except Exception as e:
        duration = time.time() - start_time
        logger.error(
            "[AUTH] /request_code - Unexpected error",
            exc_info=True,
            extra={
                "request_id": request_id,
                "channel": data.channel,
                "identifier": data.identifier,
                "error_type": type(e).__name__,
                "error_message": str(e),
                "duration_ms": int(duration * 1000),
            }
        )
        raise HTTPException(status_code=500, detail="Failed to generate verification code")


@router.post("/confirm_code")
async def confirm_code(data: ConfirmCodeRequest) -> ConfirmCodeResponse:
    """
    Confirm verification code and create tenant_id
    Returns tenant_id for dev mode
    """
    from app.services.verification import VerificationService
    
    if data.channel not in ["telegram", "max"]:
        raise HTTPException(status_code=400, detail="Channel must be 'telegram' or 'max'")
    
    verification_service = VerificationService()
    is_valid = await verification_service.verify_code(data.channel, data.identifier, data.code)
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    
    # Create user and tenant
    auth_service = AuthService()
    tenant_service = TenantService()
    
    # Create user with identifier as phone (for compatibility)
    # In production, this would be separate user creation
    user_identifier = f"{data.channel}:{data.identifier}"
    
    from sqlalchemy import select
    from app.models.user import User
    from app.models.tenant import Tenant
    from app.db.session import AsyncSessionLocal
    from sqlalchemy.exc import IntegrityError
    
    async with AsyncSessionLocal() as db:
        try:
            # Check if user already exists (with lock to prevent race condition)
            user_stmt = select(User).where(User.phone == user_identifier).with_for_update(skip_locked=True)
            user_result = await db.execute(user_stmt)
            user = user_result.scalar_one_or_none()
            
            if not user:
                # Create new user
                user = User(
                    phone=user_identifier,
                    phone_verified=True,  # Verified via code
                    role=None
                )
                db.add(user)
                try:
                    await db.flush()
                    await db.refresh(user)
                    logger.info(f"Created user for {data.channel} {data.identifier}: {user.id}")
                except IntegrityError as e:
                    await db.rollback()
                    # Race condition: user was created between check and insert
                    # Retry: get existing user
                    user_result = await db.execute(select(User).where(User.phone == user_identifier))
                    user = user_result.scalar_one_or_none()
                    if not user:
                        raise ValueError(f"Failed to create user: {e}") from e
                    logger.info(f"User already exists (race condition): {user.id}")
            
            # Get or create tenant
            if user.tenant_id:
                tenant_stmt = select(Tenant).where(Tenant.id == user.tenant_id)
                tenant_result = await db.execute(tenant_stmt)
                tenant = tenant_result.scalar_one_or_none()
            else:
                tenant = None
            
            if not tenant:
                # Create new tenant
                tenant = Tenant(
                    name=f"Tenant {user.id}",
                    owner_phone=user.phone,
                    plan=None,
                    status="inactive",
                    active_module=None
                )
                db.add(tenant)
                await db.flush()
                await db.refresh(tenant)
                
                # Link user to tenant
                user.tenant_id = tenant.id
                await db.flush()
                logger.info(f"Created tenant {tenant.id} for user {user.id}")
            
            await db.commit()
            
            return ConfirmCodeResponse(
                confirmed=True,
                tenant_id=str(tenant.id)
            )
            
        except HTTPException:
            await db.rollback()
            raise
        except Exception as e:
            await db.rollback()
            logger.error(
                f"Failed to create user/tenant: {e}",
                exc_info=True,
                extra={"channel": data.channel, "identifier": data.identifier}
            )
            raise HTTPException(status_code=500, detail="Failed to create tenant")


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
    from app.utils.jwt import create_access_token, create_refresh_token
    
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
    
    # 3-4. Create user and tenant atomically (to prevent race condition)
    # Use get_or_create pattern to handle race conditions
    from sqlalchemy import select
    from app.models.user import User
    from app.models.tenant import Tenant
    from app.db.session import AsyncSessionLocal
    from sqlalchemy.exc import IntegrityError
    
    async with AsyncSessionLocal() as db:
        try:
            # 3. Get or create user (with race condition handling)
            user_stmt = select(User).where(User.phone == data.phone)
            user_result = await db.execute(user_stmt)
            existing_user = user_result.scalar_one_or_none()
            
            if existing_user:
                # User already exists (race condition occurred)
                raise HTTPException(
                    status_code=400,
                    detail="User with this phone already exists"
                )
            
            # Create new user
            user = User(
                phone=data.phone,
                phone_verified=False
            )
            db.add(user)
            await db.flush()
            await db.refresh(user)
            
            # 4. Create tenant (in same transaction)
            # Use tenant_service but pass db session for atomicity
            tenant = await tenant_service.create_tenant(
                owner_id=user.id,
                name=f"Tenant {user.id}",
                db=db  # Pass session for atomicity
            )
            
            # Mark phone as verified (in same transaction)
            user.phone_verified = True
            
            # Commit all changes atomically
            await db.commit()
            
            logger.info(
                f"Registered user {user.id} with tenant {tenant.id}",
                extra={"user_id": str(user.id), "tenant_id": str(tenant.id)}
            )
            
        except IntegrityError as e:
            await db.rollback()
            # Race condition: user was created between check and insert
            # Try to fetch again
            user_result = await db.execute(user_stmt)
            existing_user = user_result.scalar_one_or_none()
            if existing_user:
                raise HTTPException(
                    status_code=400,
                    detail="User with this phone already exists"
                )
            logger.error(
                f"Failed to create user/tenant: {e}",
                exc_info=True,
                extra={"phone": data.phone}
            )
            raise HTTPException(status_code=500, detail="Failed to register user")
        except HTTPException:
            await db.rollback()
            raise
        except Exception as e:
            await db.rollback()
            logger.error(
                f"Unexpected error during registration: {e}",
                exc_info=True,
                extra={"phone": data.phone}
            )
            raise HTTPException(status_code=500, detail="Failed to register user")
    
    # 5. Create JWT token (after successful registration)
    from app.utils.jwt import create_access_token
    access_token = create_access_token({
        "sub": str(user.id),
        "tenant": str(tenant.id)
    })
    
    return RegisterResponse(
        token=access_token,
        tenant_id=str(tenant.id)
    )


@router.post("/activate-module")
async def activate_module(
    data: ActivateModuleRequest,
    request: Request
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
    import os
    
    # Try to get tenant_id from token, or from request body for dev mode
    tenant_id = None
    is_dev_mode = os.getenv("ENVIRONMENT", "development").lower() != "production"
    
    # First, try to get from request body (for dev mode or when token doesn't have tenant)
    if data.tenant_id:
        try:
            tenant_id = uuid.UUID(data.tenant_id)
        except (ValueError, TypeError):
            # In dev mode, try to find tenant by string representation
            if is_dev_mode:
                from sqlalchemy import select
                from app.models.tenant import Tenant
                from app.db.session import AsyncSessionLocal
                
                try:
                    async with AsyncSessionLocal() as db:
                        # Try to find by string ID (UUID as string)
                        tenant_stmt = select(Tenant).where(Tenant.id == str(data.tenant_id))
                        tenant_result = await db.execute(tenant_stmt)
                        tenant = tenant_result.scalar_one_or_none()
                        
                        if tenant:
                            tenant_id = tenant.id
                        else:
                            raise HTTPException(
                                status_code=404,
                                detail=f"Tenant '{data.tenant_id}' not found. Please register first."
                            )
                except Exception as e:
                    if isinstance(e, HTTPException):
                        raise
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid tenant_id format: {data.tenant_id}. Error: {str(e)}"
                    )
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid tenant_id format: {data.tenant_id}. Must be a valid UUID."
                )
    
    # If not in body, try to get from token
    if not tenant_id:
        try:
            tenant_id = get_current_tenant(request)
        except HTTPException:
            # Token is invalid or doesn't have tenant
            if not is_dev_mode:
                raise HTTPException(
                    status_code=401,
                    detail="Tenant not found in token. Please provide tenant_id in request body."
                )
    
    # Final check
    if not tenant_id:
        raise HTTPException(
            status_code=401,
            detail="Tenant not found. Please provide tenant_id in request body."
        )
    
    # Verify tenant access (if user_id is available)
    try:
        from app.api.deps.dependencies import verify_tenant_access
        await verify_tenant_access(request, tenant_id)
    except HTTPException as e:
        # If verification fails but we're in dev mode with tenant_id in body, continue
        if not is_dev_mode or not data.tenant_id:
            raise e
        # In dev mode, allow if tenant_id is provided in body
        logger.warning(
            f"Tenant access verification failed, but continuing in dev mode",
            extra={"tenant_id": tenant_id}
        )
    
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


@router.post("/dev-login")
async def dev_login():
    """
    Dev-only endpoint: Create a dev JWT token with tenant_id
    This creates a temporary tenant and returns a valid JWT token for development
    """
    import os
    is_dev_mode = os.getenv("ENVIRONMENT", "development").lower() != "production"
    
    if not is_dev_mode:
        raise HTTPException(status_code=403, detail="Dev login only available in development mode")
    
    try:
        # Use existing services for consistency
        auth_service = AuthService()
        tenant_service = TenantService()
        
        # Get or create a dev user and tenant
        dev_phone = "+79991234567"
        
        # Try to get or create user using auth service
        from sqlalchemy import select
        from app.models.user import User
        from app.models.tenant import Tenant
        from app.db.session import AsyncSessionLocal
        
        async with AsyncSessionLocal() as db:
            try:
                # Get or create user
                user_stmt = select(User).where(User.phone == dev_phone)
                user_result = await db.execute(user_stmt)
                user = user_result.scalar_one_or_none()
                
                if not user:
                    # Create new user using auth service
                    logger.info(f"Creating new dev user with phone: {dev_phone}")
                    user = await auth_service.create_user(dev_phone)
                    logger.info(f"Created dev user: {user.id}")
                else:
                    logger.info(f"Found existing dev user: {user.id}")
                
                # Get or create tenant
                tenant = None
                if user.tenant_id:
                    tenant_stmt = select(Tenant).where(Tenant.id == user.tenant_id)
                    tenant_result = await db.execute(tenant_stmt)
                    tenant = tenant_result.scalar_one_or_none()
                    if tenant:
                        logger.info(f"Found existing tenant: {tenant.id}")
                
                if not tenant:
                    # Create new tenant using tenant service
                    logger.info(f"Creating new dev tenant for user: {user.id}")
                    tenant = await tenant_service.create_tenant(
                        owner_id=user.id,
                        name=f"Dev Tenant {user.id}"
                    )
                    logger.info(f"Created dev tenant: {tenant.id} for user: {user.id}")
                    
                    # Link user to tenant
                    user.tenant_id = tenant.id
                    await db.commit()
                    logger.info(f"Linked user to tenant")
                
            except Exception as e:
                await db.rollback()
                logger.error(f"Failed to create dev user/tenant: {e}", exc_info=True)
                raise HTTPException(status_code=500, detail=f"Failed to create dev user/tenant: {str(e)}")
        
        # Create JWT token with tenant_id
        from app.utils.jwt import create_access_token
        from datetime import timedelta
        
        # Create token with long expiration for dev
        token_payload = {
            "sub": str(user.id),
            "tenant": str(tenant.id)
        }
        logger.info(f"Creating JWT token with payload: {token_payload}")
        
        access_token = create_access_token(
            token_payload,
            expires_delta=timedelta(days=365)  # Long expiration for dev
        )
        
        logger.info(f"Dev-login successful: user_id={user.id}, tenant_id={tenant.id}")
        
        return {
            "token": access_token,
            "tenant_id": str(tenant.id),
            "user_id": str(user.id)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in dev-login: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
