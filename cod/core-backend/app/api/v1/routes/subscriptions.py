"""
Subscriptions API
"""
from fastapi import APIRouter, Depends, HTTPException
from starlette.requests import Request

router = APIRouter()


@router.get("/status")
async def get_subscription_status(request: Request):
    """Get subscription status for current tenant"""
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(status_code=401, detail="No tenant found")
    
    from app.modules.sdk import get_subscription_status
    status = await get_subscription_status(tenant_id)
    return status



