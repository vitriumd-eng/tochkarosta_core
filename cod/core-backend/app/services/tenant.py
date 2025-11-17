"""
Tenant Service - Tenant and subdomain management
Uses SQLAlchemy ORM for all database operations
"""
from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.models.tenant import Tenant
from app.models.user import User
from app.models.tenant_domain import TenantDomain
from app.db.session import AsyncSessionLocal
import uuid
import re
import logging

logger = logging.getLogger(__name__)


class TenantService:
    """Tenant and subdomain management service"""
    
    async def create_tenant(self, owner_id: uuid.UUID, name: str) -> Tenant:
        """Create new tenant (without plan, status, or active_module)"""
        async with AsyncSessionLocal() as db:
            # Get user for owner_phone
            user_stmt = select(User).where(User.id == owner_id)
            user_result = await db.execute(user_stmt)
            user = user_result.scalar_one_or_none()
            
            if not user:
                raise ValueError(f"User not found: {owner_id}")
            
            # Create new tenant
            new_tenant = Tenant(
                name=name,
                owner_phone=user.phone,
                plan=None,
                status="inactive",
                active_module=None
            )
            db.add(new_tenant)
            
            # Link user to tenant
            user.tenant_id = new_tenant.id
            
            try:
                await db.flush()
                await db.refresh(new_tenant)
                logger.info(f"Created tenant {new_tenant.id} for user {owner_id}")
                return new_tenant
            except IntegrityError as e:
                await db.rollback()
                raise ValueError(f"Failed to create tenant: {e}") from e
    
    async def check_subdomain_availability(self, subdomain: str) -> bool:
        """Check if subdomain is available (unique and valid)"""
        # Validate subdomain format (alphanumeric and hyphens, 3-63 chars)
        if not re.match(r'^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$', subdomain.lower()):
            return False
        
        # Check reserved subdomains
        reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'localhost']
        if subdomain.lower() in reserved:
            return False
        
        # Check database for existing subdomain
        async with AsyncSessionLocal() as db:
            stmt = select(TenantDomain).where(
                func.lower(TenantDomain.domain) == func.lower(subdomain)
            ).where(
                (TenantDomain.is_active == True) | (TenantDomain.is_frozen == True)
            )
            result = await db.execute(stmt)
            existing = result.scalar_one_or_none()
            
            return existing is None
    
    async def reserve_subdomain(self, tenant_id: uuid.UUID, subdomain: str) -> None:
        """Reserve subdomain for tenant"""
        async with AsyncSessionLocal() as db:
            # Get tenant
            tenant_stmt = select(Tenant).where(Tenant.id == tenant_id)
            tenant_result = await db.execute(tenant_stmt)
            tenant = tenant_result.scalar_one_or_none()
            
            if not tenant:
                raise ValueError(f"Tenant not found: {tenant_id}")
            
            # Check if subdomain already exists
            domain_stmt = select(TenantDomain).where(
                func.lower(TenantDomain.domain) == func.lower(subdomain)
            )
            domain_result = await db.execute(domain_stmt)
            existing_domain = domain_result.scalar_one_or_none()
            
            if existing_domain:
                raise ValueError(f"Subdomain '{subdomain}' is already taken")
            
            # Insert subdomain
            new_domain = TenantDomain(
                tenant_id=tenant_id,
                domain=subdomain,
                is_active=True,
                is_frozen=False
            )
            db.add(new_domain)
            
            try:
                await db.flush()
                await db.refresh(new_domain)
                logger.info(f"Reserved subdomain '{subdomain}' for tenant {tenant_id}")
            except IntegrityError as e:
                await db.rollback()
                raise ValueError(f"Failed to reserve subdomain '{subdomain}': {e}") from e


