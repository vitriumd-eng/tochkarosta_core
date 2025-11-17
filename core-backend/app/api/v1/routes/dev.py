"""
Dev-only endpoints for development mode
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class SaveTenantIdRequest(BaseModel):
    """Request to save tenant_id to .env.local"""
    tenant_id: str


@router.post("/save-tenant-id")
async def save_tenant_id(request: SaveTenantIdRequest):
    """
    Save tenant_id to .env.local (dev mode only)
    This allows frontend to persist tenant_id for dev mode
    """
    is_dev_mode = os.getenv("ENVIRONMENT", "development").lower() != "production"
    
    if not is_dev_mode:
        raise HTTPException(status_code=403, detail="This endpoint is only available in development mode")
    
    try:
        # Path to .env.local in core-frontend
        env_file = Path(__file__).parent.parent.parent.parent.parent / "core-frontend" / ".env.local"
        
        # Read existing .env.local
        existing_content = ""
        if env_file.exists():
            existing_content = env_file.read_text(encoding="utf-8")
        
        # Check if NEXT_PUBLIC_DEV_TENANT_ID already exists
        lines = existing_content.split("\n")
        updated = False
        new_lines = []
        
        for line in lines:
            if line.startswith("NEXT_PUBLIC_DEV_TENANT_ID="):
                new_lines.append(f'NEXT_PUBLIC_DEV_TENANT_ID="{request.tenant_id}"')
                updated = True
            else:
                new_lines.append(line)
        
        if not updated:
            # Add new line
            if new_lines and new_lines[-1]:
                new_lines.append("")
            new_lines.append(f'NEXT_PUBLIC_DEV_TENANT_ID="{request.tenant_id}"')
        
        # Write back to file
        env_file.write_text("\n".join(new_lines), encoding="utf-8")
        
        logger.info(f"Saved tenant_id to .env.local: {request.tenant_id}")
        
        return {
            "success": True,
            "message": f"Tenant ID saved to .env.local. Please restart frontend server.",
            "tenant_id": request.tenant_id
        }
    except Exception as e:
        logger.error(f"Failed to save tenant_id: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to save tenant_id: {str(e)}")


