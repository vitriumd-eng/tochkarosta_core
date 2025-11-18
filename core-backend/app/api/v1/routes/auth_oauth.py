"""
OAuth Authentication API - Telegram/MAX/VK registration
"""
from fastapi import APIRouter, HTTPException
from app.api.v1.schemas.external_auth import ExternalAuthRequest
from app.schemas.auth import OAuthVKRequest, AuthResponse
from app.services.auth_service import auth_oauth_handler
from app.utils.jwt import create_access_token, create_refresh_token
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/oauth/{provider}", response_model=dict)
async def oauth_login(provider: str, body: ExternalAuthRequest):
    """
    OAuth Login / Registration endpoint (Telegram/MAX)
    
    Provider path parameter must match body.provider
    """
    if provider != body.provider:
        raise HTTPException(status_code=400, detail="Provider mismatch")
    
    result = await auth_oauth_handler(body)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid signature or auth failed")
    
    return result


@router.post("/oauth/vk", response_model=AuthResponse)
async def oauth_vk(req: OAuthVKRequest):
    """
    VK OAuth callback (code)
    
    1. Exchange code -> access_token via VK API
    2. Fetch profile (id, first_name, last_name, email?)
    3. Lookup user by vk_id or create new
    4. Create tenant as needed
    5. Return tokens
    """
    import os
    import httpx
    
    vk_app_id = os.getenv('VK_APP_ID')
    vk_app_secret = os.getenv('VK_APP_SECRET')
    vk_redirect_uri = os.getenv('VK_REDIRECT_URI', 'http://localhost:7001/auth/vk/callback')
    
    if not vk_app_id or not vk_app_secret:
        logger.error("VK OAuth credentials not configured")
        raise HTTPException(status_code=500, detail="VK OAuth not configured")
    
    # 1. Exchange code for access_token
    async with httpx.AsyncClient() as client:
        token_response = await client.get(
            "https://oauth.vk.com/access_token",
            params={
                "client_id": vk_app_id,
                "client_secret": vk_app_secret,
                "redirect_uri": vk_redirect_uri,
                "code": req.code
            }
        )
        
        if token_response.status_code != 200:
            logger.error(f"VK token exchange failed: {token_response.status_code}")
            raise HTTPException(status_code=400, detail="Failed to exchange VK code")
        
        token_data = token_response.json()
        if "error" in token_data:
            logger.error(f"VK token error: {token_data.get('error_description')}")
            raise HTTPException(status_code=400, detail=token_data.get('error_description', 'VK OAuth error'))
        
        access_token = token_data.get('access_token')
        vk_user_id = token_data.get('user_id')
        
        if not access_token or not vk_user_id:
            raise HTTPException(status_code=400, detail="Invalid VK response")
        
        # 2. Fetch profile
        profile_response = await client.get(
            "https://api.vk.com/method/users.get",
            params={
                "access_token": access_token,
                "user_ids": vk_user_id,
                "fields": "first_name,last_name,email",
                "v": "5.131"
            }
        )
        
        if profile_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch VK profile")
        
        profile_data = profile_response.json()
        if "error" in profile_data:
            raise HTTPException(status_code=400, detail="VK API error")
        
        vk_profile = profile_data.get('response', [{}])[0] if profile_data.get('response') else {}
    
    # 3. Lookup or create user
    from sqlalchemy import select
    from app.models.user import User
    from app.db.session import AsyncSessionLocal
    from app.services.auth import AuthService
    
    auth_service = AuthService()
    
    async with AsyncSessionLocal() as db:
        # TODO: When migration adds vk_id field, use it
        # user_stmt = select(User).where(User.vk_id == str(vk_user_id))
        # For now, use phone if available, or create with vk_id in external_accounts
        phone = None  # VK users may not have phone
        
        # Check if user exists by vk_id (via external_accounts)
        from app.models.user_external_account import UserExternalAccount
        external_stmt = select(UserExternalAccount).where(
            UserExternalAccount.provider == 'vk',
            UserExternalAccount.external_id == str(vk_user_id)
        )
        external_result = await db.execute(external_stmt)
        external_account = external_result.scalar_one_or_none()
        
        user = None
        if external_account:
            user_stmt = select(User).where(User.id == external_account.user_id)
            user_result = await db.execute(user_stmt)
            user = user_result.scalar_one_or_none()
        
        if not user:
            # Create new user
            user = User(
                phone=phone or f"vk:{vk_user_id}",
                phone_verified=True,  # OAuth providers are verified
                role="subscriber"
            )
            db.add(user)
            await db.flush()
            await db.refresh(user)
            
            # Create external account
            external_account = UserExternalAccount(
                user_id=user.id,
                provider='vk',
                external_id=str(vk_user_id)
            )
            db.add(external_account)
            await db.flush()
        
        # 4. Get or create tenant
        tenant = None
        if user.tenant_id:
            from app.models.tenant import Tenant
            tenant_stmt = select(Tenant).where(Tenant.id == user.tenant_id)
            tenant_result = await db.execute(tenant_stmt)
            tenant = tenant_result.scalar_one_or_none()
        
        if not tenant:
            from app.services.tenant import TenantService
            tenant_service = TenantService()
            tenant = await tenant_service.create_tenant(
                owner_id=user.id,
                name=f"Tenant {user.id}",
                db=db,
                user=user
            )
        
        await db.commit()
    
    # 5. Generate tokens
    access_token_jwt = create_access_token({
        "sub": str(user.id),
        "tenant": str(tenant.id)
    })
    refresh_token_jwt = create_refresh_token({
        "sub": str(user.id)
    })
    
    return AuthResponse(
        access_token=access_token_jwt,
        refresh_token=refresh_token_jwt,
        tenant_id=str(tenant.id),
        user_id=str(user.id)
    )
