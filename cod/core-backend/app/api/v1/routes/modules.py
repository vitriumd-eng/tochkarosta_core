"""
Modules API - SDK endpoints for modules
"""
from fastapi import APIRouter, Depends, HTTPException
from starlette.requests import Request
from app.modules.registry import load_registry, get_module_manifest

router = APIRouter()


@router.get("/subscription")
async def get_subscription_status(request: Request):
    """SDK endpoint: Get subscription status"""
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(status_code=401, detail="No tenant found")
    
    from app.modules.sdk import get_subscription_status
    status = await get_subscription_status(tenant_id)
    return status


@router.get("/tenant-info")
async def get_tenant_info(request: Request):
    """SDK endpoint: Get tenant info"""
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(status_code=401, detail="No tenant found")
    
    from app.modules.sdk import get_tenant_info
    info = await get_tenant_info(tenant_id)
    return info


@router.get("/list")
async def list_modules(request: Request):
    """Get list of available modules for tenant"""
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(status_code=401, detail="No tenant found")
    
    # Check subscription status
    from app.modules.sdk import get_subscription_status
    subscription = await get_subscription_status(tenant_id)
    
    if not subscription.get("active"):
        return []
    
    # Load registry and enrich with manifest data
    registry = load_registry()
    modules = []
    
    for reg_entry in registry:
        module_id = reg_entry.get("id")
        manifest = get_module_manifest(module_id)
        
        if manifest:
            modules.append({
                "id": manifest.get("id"),
                "name": manifest.get("name"),
                "description": manifest.get("description", ""),
                "version": manifest.get("version"),
                "themes": manifest.get("themes", [])
            })
    
    return modules


@router.post("/switch")
async def switch_module(request: Request):
    """Switch active module for tenant"""
    from pydantic import BaseModel
    
    class SwitchModuleRequest(BaseModel):
        module_id: str
    
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(status_code=401, detail="No tenant found")
    
    # Parse request body
    body = await request.json()
    switch_req = SwitchModuleRequest(**body)
    
    # Check if module exists and is registered
    from app.modules.registry import is_module_registered
    if not is_module_registered(switch_req.module_id):
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Check dependencies
    from app.modules.sdk import check_dependencies
    deps = await check_dependencies(switch_req.module_id)
    if not deps.get("ok"):
        raise HTTPException(
            status_code=400,
            detail=f"Module dependencies not met: {deps.get('missing')} {deps.get('inactive')}"
        )
    
    # Update tenant active module
    from sqlalchemy import select
    from app.models.tenant import Tenant
    from app.db.session import AsyncSessionLocal
    
    async with AsyncSessionLocal() as db:
        # Get current active module to save theme preference
        tenant_stmt = select(Tenant).where(Tenant.id == tenant_id)
        tenant_result = await db.execute(tenant_stmt)
        tenant = tenant_result.scalar_one_or_none()
        
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        current_module = tenant.active_module
        
        # TODO: Save current module theme before switching
        
        # Update active module
        tenant.active_module = switch_req.module_id
        await db.flush()
    
    # TODO: Notify old module of deactivation
    # TODO: Notify new module of activation
    
    return {
        "success": True,
        "active_module": switch_req.module_id,
        "previous_module": current_module
    }
