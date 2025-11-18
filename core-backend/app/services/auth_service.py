"""
OAuth Authentication Service
Handles Telegram and MAX OAuth authentication
"""
from typing import Dict, Any, Optional
import hashlib
import os

async def verify_telegram_signature(data: Dict[str, Any], bot_token: str) -> bool:
    """
    Verify Telegram WebApp signature
    
    Incoming data should be normalized dict of allowed fields.
    Compute HMAC-SHA256 of data string and compare with hash.
    """
    hash_to_check = data.get('signature')
    
    # Dev mode: allow "DEV" signature
    if hash_to_check == 'DEV':
        return True
    
    # Production validation placeholder
    if not bot_token:
        return False
    
    secret = hashlib.sha256(bot_token.encode()).digest()
    # TODO: Implement canonical string building per Telegram docs
    return False


async def auth_oauth_handler(body) -> Optional[Dict[str, Any]]:
    """
    Handle OAuth authentication request
    
    Returns dict with tokens and IDs, or None if authentication failed.
    """
    provider = body.provider
    external_id = str(body.external_id)
    signature = body.signature
    
    # Verify signature based on provider
    if provider == 'telegram':
        bot_token = os.getenv('TELEGRAM_BOT_TOKEN', '')
        ok = await verify_telegram_signature(body.dict(), bot_token)
        if not ok:
            return None
    elif provider == 'max':
        # TODO: Implement MAX signature verification
        return None
    else:
        return None
    
    # TODO: Implement DB operations with proper async sessions and models
    # This is a placeholder implementation
    user_id = f"dev-user-{external_id}"
    tenant_id = f"dev-tenant-{external_id}"
    
    return {
        "access_token": "ey..example",
        "refresh_token": "rft..example",
        "tenant_id": tenant_id,
        "user_id": user_id
    }
