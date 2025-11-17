"""
Internal Registration Endpoint
Called by core when module is activated
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class InternalRegisterRequest(BaseModel):
    """Request schema for internal module registration"""
    tenant_id: str
    module_name: str
    plan: str
    version: str
    subdomain: Optional[str] = None
    callbacks: Optional[Dict[str, str]] = None


@router.post("")
async def register_tenant(request: InternalRegisterRequest):
    """
    Register tenant in module
    Called by core when module is activated
    """
    try:
        logger.info(f"Registering tenant {request.tenant_id} for module {request.module_name}")
        
        # TODO: Create tenant record in module database
        # For now, just return success
        # In production, this would:
        # 1. Create tenant in module_tenants table
        # 2. Set plan, license_status, features
        # 3. Store subdomain
        # 4. Store callbacks for webhooks
        
        return {
            "status": "ok",
            "ready": True,
            "tenant_id": request.tenant_id,
            "module": request.module_name
        }
    except Exception as e:
        logger.error(f"Failed to register tenant: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to register tenant: {str(e)}")


