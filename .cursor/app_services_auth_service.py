# ПРИМЕР: app/services/auth_service.py
from typing import Dict, Any
from app.db.session import AsyncSessionLocal
from app.models import User, Tenant  # example imports
import hashlib, hmac, os, asyncio

async def verify_telegram_signature(data: Dict[str, Any], bot_token: str) -> bool:
    # PРИМЕР: Implement Telegram WebApp signature validation
    # incoming data should be normalized dict of allowed fields
    # Compute HMAC-SHA256 of data string and compare with hash
    hash_to_check = data.get('signature')  # signature field name may differ
    # For dev mode: allow "DEV"
    if hash_to_check == 'DEV':
        return True
    # Real validation (placeholder)
    secret = hashlib.sha256(bot_token.encode()).digest()
    # Implement the canonical string building per Telegram docs
    return False  # <-- replace with actual validation

async def auth_oauth_handler(body) -> Dict[str, Any]:
    provider = body.provider
    external_id = str(body.external_id)
    signature = body.signature
    # For TELEGRAM
    if provider == 'telegram':
        bot_token = os.getenv('TELEGRAM_BOT_TOKEN', '') 
        ok = await verify_telegram_signature(body.dict(), bot_token)
        if not ok:
            return None
    # For MAX - similar verification (omitted)
    # Lookup or create user & tenant (ПРИМЕР)
    # NOTE: This is a high-level example. Implement DB operations with proper async sessions and models.
    user_id = f"dev-user-{external_id}"
    tenant_id = f"dev-tenant-{external_id}"
    # Generate tokens (ПРИМЕР)
    return {
        "access_token": "ey..example",
        "refresh_token": "rft..example",
        "tenant_id": tenant_id,
        "user_id": user_id
    }
