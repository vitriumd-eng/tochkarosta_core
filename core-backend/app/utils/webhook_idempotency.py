"""
Webhook idempotency storage
Uses in-memory storage for dev, Redis for production (optional)
"""
import logging
import time
import os
from typing import Optional

logger = logging.getLogger(__name__)

# In-memory storage for webhook IDs (dev mode)
# Format: {webhook_id: (processed_at, tenant_id, module_id)}
_webhook_storage: dict = {}

# TTL for webhook IDs (24 hours)
WEBHOOK_ID_TTL = 86400


def is_webhook_processed(webhook_id: str) -> bool:
    """
    Check if webhook was already processed
    
    Args:
        webhook_id: Unique webhook ID
    
    Returns:
        True if webhook was already processed, False otherwise
    """
    # Try Redis first if available
    try:
        redis_url = os.getenv("REDIS_URL")
        if redis_url:
            import redis.asyncio as redis
            redis_client = redis.from_url(redis_url)
            # Check if key exists (synchronous check for simplicity)
            # In production, use async Redis client
            return False  # TODO: Implement async Redis check
    except Exception as e:
        logger.debug(f"Redis not available, using in-memory storage: {e}")
    
    # Fallback to in-memory storage
    if webhook_id not in _webhook_storage:
        return False
    
    # Check TTL
    processed_at, _, _ = _webhook_storage[webhook_id]
    if time.time() - processed_at > WEBHOOK_ID_TTL:
        # Expired, remove from storage
        del _webhook_storage[webhook_id]
        return False
    
    return True


def mark_webhook_processed(webhook_id: str, tenant_id: str, module_id: str) -> None:
    """
    Mark webhook as processed
    
    Args:
        webhook_id: Unique webhook ID
        tenant_id: Tenant ID
        module_id: Module ID
    """
    # Try Redis first if available
    try:
        redis_url = os.getenv("REDIS_URL")
        if redis_url:
            import redis.asyncio as redis
            redis_client = redis.from_url(redis_url)
            # Store in Redis with TTL
            # redis_client.setex(f"webhook:{webhook_id}", WEBHOOK_ID_TTL, f"{tenant_id}:{module_id}")
            return  # TODO: Implement async Redis storage
    except Exception as e:
        logger.debug(f"Redis not available, using in-memory storage: {e}")
    
    # Fallback to in-memory storage
    _webhook_storage[webhook_id] = (time.time(), tenant_id, module_id)
    
    # Cleanup old entries periodically (keep last 1000)
    if len(_webhook_storage) > 1000:
        # Remove oldest entries
        sorted_items = sorted(_webhook_storage.items(), key=lambda x: x[1][0])
        for old_id, _ in sorted_items[:len(_webhook_storage) - 1000]:
            del _webhook_storage[old_id]


