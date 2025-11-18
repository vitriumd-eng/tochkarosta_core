"""
Verification Service - Code generation and verification for Telegram/MAX
Uses in-memory storage for dev, Redis for production (optional)
"""
from typing import Optional
import random
import time
import logging
import os

logger = logging.getLogger(__name__)

# In-memory verification code storage (fallback for dev)
_verification_storage: dict = {}

# Try to initialize Redis if available (optional)
_redis_client = None
try:
    redis_url = os.getenv("REDIS_URL")
    if redis_url:
        import redis.asyncio as redis
        _redis_client = redis.from_url(redis_url)
        logger.info("Redis client initialized for verification codes")
except Exception as e:
    logger.debug(f"Redis not available for verification codes, using in-memory storage: {e}")


class VerificationService:
    """Verification code service for Telegram/MAX registration"""
    CODE_TTL = 300  # 5 minutes
    CODE_LENGTH = 6
    
    async def generate_code(self, channel: str, identifier: str) -> str:
        """Generate verification code for channel (telegram|max) and identifier"""
        logger.info(
            "[VERIFICATION] generate_code - Starting",
            extra={
                "channel": channel,
                "identifier": identifier,
                "identifier_length": len(identifier) if identifier else 0,
            }
        )
        
        # Generate 6-digit code
        code = str(random.randint(100000, 999999))
        logger.debug(
            "[VERIFICATION] generate_code - Code generated",
            extra={
                "channel": channel,
                "identifier": identifier,
                "code_length": len(code),
                "code_preview": f"{code[:2]}****",
            }
        )
        
        # Store code with expiration
        key = f"verification:{channel}:{identifier}"
        logger.debug(
            "[VERIFICATION] generate_code - Storage key",
            extra={
                "channel": channel,
                "identifier": identifier,
                "key": key,
            }
        )
        
        # Try Redis first if available
        if _redis_client:
            try:
                import json
                value = json.dumps({
                    "code": code,
                    "channel": channel,
                    "identifier": identifier,
                    "expires_at": time.time() + self.CODE_TTL,
                    "attempts": 0
                })
                await _redis_client.setex(key, self.CODE_TTL, value)
                logger.debug(f"Stored verification code in Redis: {key}")
            except Exception as e:
                logger.warning(f"Failed to store code in Redis, using in-memory: {e}")
                # Fallback to in-memory
                _verification_storage[key] = {
                    "code": code,
                    "channel": channel,
                    "identifier": identifier,
                    "expires_at": time.time() + self.CODE_TTL,
                    "attempts": 0
                }
        else:
            # Use in-memory storage (dev mode)
            _verification_storage[key] = {
                "code": code,
                "channel": channel,
                "identifier": identifier,
                "expires_at": time.time() + self.CODE_TTL,
                "attempts": 0
            }
        
        # In dev mode, log code to console
        from app.core.config import settings
        
        logger.info(
            "[VERIFICATION] generate_code - Code generated and stored",
            extra={
                "channel": channel,
                "identifier": identifier,
                "code": code,
                "code_length": len(code),
                "key": key,
                "ttl_seconds": self.CODE_TTL,
                "storage_type": "redis" if _redis_client else "in-memory",
            }
        )
        
        # In DEV_MODE, always print code to console (never send to providers)
        if settings.DEV_MODE:
            print(f"\n{'='*60}")
            print(f"[DEV MODE] OTP for {identifier}")
            print(f"[DEV MODE] Code:  {code}")
            print(f"{'='*60}\n")
            logger.info(f"[DEV MODE] OTP for {channel} {identifier} = {code}")
        else:
            # Production mode: log without showing code
            logger.info(f"[VERIFICATION] Code for {channel} {identifier}: {code[:2]}****")
        
        logger.debug(
            "[VERIFICATION] generate_code - Completed",
            extra={
                "channel": channel,
                "identifier": identifier,
                "code_length": len(code),
            }
        )
        
        return code
    
    async def verify_code(self, channel: str, identifier: str, code: str) -> bool:
        """Verify code for channel and identifier"""
        key = f"verification:{channel}:{identifier}"
        stored = None
        
        # Try Redis first if available
        if _redis_client:
            try:
                import json
                value = await _redis_client.get(key)
                if value:
                    stored = json.loads(value)
            except Exception as e:
                logger.warning(f"Failed to get code from Redis, trying in-memory: {e}")
        
        # Fallback to in-memory storage
        if not stored:
            stored = _verification_storage.get(key)
        
        if not stored:
            return False
        
        # Check expiration
        if time.time() > stored["expires_at"]:
            # Remove from storage
            if _redis_client:
                try:
                    await _redis_client.delete(key)
                except Exception:
                    pass
            else:
                _verification_storage.pop(key, None)
            return False
        
        # Check attempts (rate limiting)
        if stored["attempts"] >= 5:
            # Remove from storage
            if _redis_client:
                try:
                    await _redis_client.delete(key)
                except Exception:
                    pass
            else:
                _verification_storage.pop(key, None)
            return False
        
        stored["attempts"] += 1
        
        # Verify code
        if stored["code"] == code:
            # Remove from storage (code used)
            if _redis_client:
                try:
                    await _redis_client.delete(key)
                except Exception:
                    pass
            else:
                _verification_storage.pop(key, None)
            return True
        
        # Update attempts in storage
        if _redis_client:
            try:
                import json
                value = json.dumps(stored)
                await _redis_client.setex(key, int(stored["expires_at"] - time.time()), value)
            except Exception:
                pass
        
        return False
    
    async def get_code_info(self, channel: str, identifier: str) -> Optional[dict]:
        """Get code info without verifying (for debugging)"""
        key = f"verification:{channel}:{identifier}"
        stored = None
        
        # Try Redis first if available
        if _redis_client:
            try:
                import json
                value = await _redis_client.get(key)
                if value:
                    stored = json.loads(value)
            except Exception:
                pass
        
        # Fallback to in-memory storage
        if not stored:
            stored = _verification_storage.get(key)
        
        if not stored:
            return None
        
        return {
            "channel": stored["channel"],
            "identifier": stored["identifier"],
            "expires_at": stored["expires_at"],
            "attempts": stored["attempts"]
        }

