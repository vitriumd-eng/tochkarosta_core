"""
Tenant Middleware - Extract tenant from subdomain or token
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from typing import Callable
import re
import logging
from app.security.jwt import verify_token
from app.db.session import AsyncSessionLocal

logger = logging.getLogger(__name__)


class TenantMiddleware(BaseHTTPMiddleware):
    """Extract tenant by subdomain or token; set request.state.tenant_id, request.state.user_id"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Пропускаем platform endpoints без обработки tenant
        if request.url.path.startswith("/api/v1/platform"):
            response = await call_next(request)
            return response
        
        tenant_id = None
        user_id = None
        
        # Try to extract from Authorization token
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")
            try:
                payload = verify_token(token)
                tenant_id = payload.get("tenant")
                user_id = payload.get("sub")
            except Exception:
                pass
        
        # Fallback: extract from subdomain
        if not tenant_id:
            host = request.headers.get("host", "")
            # Parse subdomain (e.g., shop.localhost:7000 or shop.example.com)
            # Handle localhost:port format
            host_without_port = host.split(':')[0]
            parts = host_without_port.split('.')
            
            # Extract subdomain (first part before first dot)
            if len(parts) > 1 and parts[0] not in ['www', 'api', 'admin']:
                subdomain = parts[0]
            elif len(parts) == 1 and parts[0] not in ['localhost', 'www', 'api', 'admin']:
                # Handle case like "shop.localhost:7000"
                subdomain = parts[0]
            else:
                subdomain = None
            
            if subdomain:
                # Query database to get tenant_id from subdomain using ORM
                # Пропускаем для platform endpoints - они не требуют tenant_id
                if not request.url.path.startswith("/api/v1/platform"):
                    try:
                        from sqlalchemy import select, func
                        from app.models.tenant_domain import TenantDomain
                        from app.models.tenant import Tenant
                        
                        async with AsyncSessionLocal() as db:
                            # Find tenant domain by subdomain
                            domain_stmt = select(TenantDomain).where(
                                func.lower(TenantDomain.domain) == func.lower(subdomain)
                            ).where(
                                (TenantDomain.is_active == True) | (TenantDomain.is_frozen == True)
                            ).limit(1)
                            domain_result = await db.execute(domain_stmt)
                            tenant_domain = domain_result.scalar_one_or_none()
                            
                            if tenant_domain:
                                # Get tenant to get active_module
                                tenant_stmt = select(Tenant).where(Tenant.id == tenant_domain.tenant_id)
                                tenant_result = await db.execute(tenant_stmt)
                                tenant = tenant_result.scalar_one_or_none()
                                
                                if tenant:
                                    tenant_id = str(tenant.id)
                                    # Store active module in request state
                                    request.state.active_module = tenant.active_module
                                    logger.debug(f"Tenant found for subdomain {subdomain}: {tenant_id}")
                    except Exception as e:
                        # Логируем ошибки БД в middleware, но не падаем
                        logger.warning(f"TenantMiddleware DB error for subdomain {subdomain}: {e}", exc_info=True)
                        pass
        
        # Set state
        request.state.tenant_id = tenant_id
        request.state.user_id = user_id
        if not hasattr(request.state, 'active_module'):
            request.state.active_module = None
        
        # Set session-local variable for RLS-like queries
        if tenant_id and hasattr(request.state, "db_session"):
            # This would be set in database middleware
            # await request.state.db_session.execute(f"SET LOCAL app.current_tenant = '{tenant_id}'")
            pass
        
        response = await call_next(request)
        return response

