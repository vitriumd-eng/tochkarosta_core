"""
Webhook handlers
For core and payment provider webhooks
"""
from fastapi import APIRouter, Request

router = APIRouter()


@router.post("/license.updated")
async def license_updated(request: Request):
    """Handle license update webhook from core"""
    import logging
    import sys
    import os
    logger = logging.getLogger(__name__)
    
    try:
        data = await request.json()
        webhook_id = data.get("id")  # For idempotency
        tenant_id = data.get("tenant_id")
        status = data.get("status")
        plan = data.get("plan")
        features = data.get("features", {})
        limits = data.get("limits", {})
        
        # Check idempotency (prevent duplicate processing)
        # For dev mode, use simple in-memory check
        # In production, use Redis or database
        if webhook_id:
            # Simple in-memory idempotency check for dev
            # In production, use Redis or database
            idempotency_key = f"webhook:license.updated:{webhook_id}:{tenant_id}"
            
            # Try Redis if available
            try:
                redis_url = os.getenv("REDIS_URL")
                if redis_url:
                    import redis.asyncio as redis
                    redis_client = redis.from_url(redis_url)
                    # Check if already processed (async)
                    # processed = await redis_client.exists(idempotency_key)
                    # if processed:
                    #     logger.info(f"Webhook {webhook_id} already processed, skipping")
                    #     return {"status": "ok", "tenant_id": tenant_id, "duplicate": True}
                    # await redis_client.setex(idempotency_key, 86400, "processed")  # 24h TTL
                    pass  # TODO: Implement async Redis check
            except Exception:
                # Redis not available, use in-memory (dev mode)
                # For dev, we'll just process (simple mode)
                pass
        
        logger.info(
            f"License updated for tenant {tenant_id}: status={status}, plan={plan}",
            extra={
                "tenant_id": tenant_id,
                "webhook_id": webhook_id,
                "status": status,
                "plan": plan
            }
        )
        
        # TODO: Update license_cache in module
        # For now, just log the update
        # In production, this would:
        # 1. Update license_cache table
        # 2. Invalidate cache
        # 3. Update feature flags
        
        return {"status": "ok", "tenant_id": tenant_id, "webhook_id": webhook_id}
    except Exception as e:
        logger.error(
            f"Failed to process license update: {e}",
            exc_info=True,
            extra={"webhook_id": webhook_id if 'webhook_id' in locals() else None}
        )
        return {"status": "error", "detail": "Internal server error"}


@router.post("/version.updated")
async def version_updated(request: Request):
    """Handle version update webhook from core"""
    data = await request.json()
    # Process version update
    return {"status": "ok"}


@router.post("/payment/yookassa")
async def yookassa_webhook(request: Request):
    """Handle YooKassa payment webhook"""
    data = await request.json()
    # Process payment
    return {"status": "ok"}


@router.post("/payment/p2p")
async def p2p_webhook(request: Request):
    """Handle P2P payment webhook"""
    data = await request.json()
    # Process payment
    return {"status": "ok"}



