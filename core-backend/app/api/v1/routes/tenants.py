"""
Tenants API - Tenant information endpoints
Uses SQLAlchemy ORM for all database operations
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import select, func
from app.services.tenant import TenantService
from app.modules.registry import get_module_manifest
from app.models.tenant_domain import TenantDomain
from app.models.tenant import Tenant
from app.db.session import AsyncSessionLocal

router = APIRouter()
tenant_service = TenantService()


class TenantBySubdomainResponse(BaseModel):
    """Response schema for get_tenant_by_subdomain"""
    tenant_id: str
    tenant_name: str
    subdomain: str
    status: str
    is_active: bool
    is_frozen: bool
    active_module: Optional[str]
    module_info: Optional[dict]


@router.get("/by-subdomain/{subdomain}", response_model=TenantBySubdomainResponse)
async def get_tenant_by_subdomain(subdomain: str):
    """
    Get tenant and module info by subdomain
    Used by frontend to determine which module to load
    
    Returns:
        - tenant_id: UUID of the tenant
        - tenant_name: Name of the tenant
        - subdomain: Subdomain string
        - status: Tenant status (active/inactive)
        - is_active: Whether domain is active
        - is_frozen: Whether domain is frozen
        - active_module: ID of active module (if any)
        - module_info: Module manifest information (if active_module exists)
    """
    async with AsyncSessionLocal() as db:
        # Find tenant domain by subdomain
        domain_stmt = select(TenantDomain).where(
            func.lower(TenantDomain.domain) == func.lower(subdomain)
        ).where(
            (TenantDomain.is_active == True) | (TenantDomain.is_frozen == True)
        )
        domain_result = await db.execute(domain_stmt)
        tenant_domain = domain_result.scalar_one_or_none()
        
        if not tenant_domain:
            raise HTTPException(status_code=404, detail="Tenant not found for subdomain")
        
        # Get tenant via relationship
        tenant_stmt = select(Tenant).where(Tenant.id == tenant_domain.tenant_id)
        tenant_result = await db.execute(tenant_stmt)
        tenant = tenant_result.scalar_one_or_none()
        
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        active_module = tenant.active_module
        
        # Get module manifest if active module exists
        module_info = None
        if active_module:
            manifest = get_module_manifest(active_module)
            if manifest:
                module_info = {
                    "id": manifest.get("id"),
                    "name": manifest.get("name"),
                    "version": manifest.get("version"),
                    "publicRoutes": manifest.get("publicRoutes", []),
                    "dashboardRoutes": manifest.get("dashboardRoutes", []),
                    "defaultTheme": manifest.get("defaultTheme")
                }
        
        return {
            "tenant_id": str(tenant.id),
            "tenant_name": tenant.name,
            "subdomain": tenant_domain.domain,
            "status": tenant.status,
            "is_active": tenant_domain.is_active,
            "is_frozen": tenant_domain.is_frozen,
            "active_module": active_module,
            "module_info": module_info
        }
