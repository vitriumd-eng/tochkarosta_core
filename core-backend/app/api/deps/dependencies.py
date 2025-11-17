"""
FastAPI Dependencies
Common dependencies used across API routes
"""
from fastapi import Request, HTTPException
from typing import Dict
import uuid
from app.utils.jwt import verify_token


def get_current_tenant(request: Request) -> uuid.UUID:
    """
    Dependency to get current tenant_id from JWT token or request state
    
    Args:
        request: FastAPI Request object
        
    Returns:
        UUID of the tenant
        
    Raises:
        HTTPException: If tenant not found in token or request state
    """
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


async def verify_tenant_access(request: Request, tenant_id: uuid.UUID) -> bool:
    """
    Verify that the current user has access to the specified tenant
    
    Args:
        request: FastAPI Request object
        tenant_id: Tenant UUID to verify access to
        
    Returns:
        True if user has access, False otherwise
        
    Raises:
        HTTPException: If access is denied
    """
    from app.models.user import User
    from app.db.session import AsyncSessionLocal
    from sqlalchemy import select
    
    # Get user_id from token
    user_id = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
        try:
            payload = verify_token(token)
            user_id = payload.get("sub")
            if user_id:
                user_id = uuid.UUID(user_id)
        except Exception:
            pass
    
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found in token")
    
    # Check if user belongs to tenant
    async with AsyncSessionLocal() as db:
        user_stmt = select(User).where(User.id == user_id)
        user_result = await db.execute(user_stmt)
        user = user_result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=403, detail="Access denied to tenant")
        
        if user.tenant_id != tenant_id:
            raise HTTPException(status_code=403, detail="Access denied to tenant")
    
    return True


def require_platform_master(request: Request) -> Dict:
    """
    Dependency to check if user has platform_master role
    Модератор контента платформы - управляет контентом платформеной страницы
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Dict with user_id and role
        
    Raises:
        HTTPException: If token is missing, invalid, or user doesn't have platform_master role
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    token = auth_header.replace("Bearer ", "")
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
        role = payload.get("role")
        
        if role != "platform_master":
            raise HTTPException(status_code=403, detail="Access denied. Platform master role required.")
        
        return {"user_id": uuid.UUID(user_id), "role": role}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_subscriber(request: Request) -> Dict:
    """
    Dependency to check if user has subscriber role
    Подписчик - использует подписку, арендует платформу для своего бизнеса
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Dict with user_id, role, and tenant_id
        
    Raises:
        HTTPException: If token is missing, invalid, or user doesn't have subscriber role
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    token = auth_header.replace("Bearer ", "")
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
        role = payload.get("role")
        tenant_id = payload.get("tenant")
        
        if role != "subscriber":
            raise HTTPException(status_code=403, detail="Access denied. Subscriber role required.")
        
        result = {"user_id": uuid.UUID(user_id), "role": role}
        if tenant_id:
            result["tenant_id"] = uuid.UUID(tenant_id)
        
        return result
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_user(request: Request) -> Dict:
    """
    Dependency to check if user has user role (public user)
    Публичный пользователь - просто смотрит платформеную страницу, не зарегистрирован
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Dict with user_id and role
        
    Raises:
        HTTPException: If token is missing, invalid, or user doesn't have user role
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    token = auth_header.replace("Bearer ", "")
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
        role = payload.get("role")
        
        if role != "user":
            raise HTTPException(status_code=403, detail="Access denied. User role required.")
        
        result = {"user_id": uuid.UUID(user_id), "role": role}
        return result
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_buyer(request: Request) -> Dict:
    """
    Dependency to check if user has buyer role
    Покупатель - клиенты подписчика, которые покупают товары/услуги
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Dict with user_id, role, and tenant_id
        
    Raises:
        HTTPException: If token is missing, invalid, or user doesn't have buyer role
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    token = auth_header.replace("Bearer ", "")
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
        role = payload.get("role")
        tenant_id = payload.get("tenant")
        
        if role != "buyer":
            raise HTTPException(status_code=403, detail="Access denied. Buyer role required.")
        
        result = {"user_id": uuid.UUID(user_id), "role": role}
        if tenant_id:
            result["tenant_id"] = uuid.UUID(tenant_id)
        
        return result
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


