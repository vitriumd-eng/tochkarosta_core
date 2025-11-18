"""
SMS Service - OTP sending and verification
Uses in-memory storage (in production, use Redis)
"""
from typing import Optional
import random
import hashlib
import time
import logging

logger = logging.getLogger(__name__)

# In-memory OTP storage (in production, use Redis)
_otp_storage: dict = {}


class SMSService:
    """SMS and OTP service"""
    OTP_TTL = 300  # 5 minutes
    OTP_LENGTH = 6
    
    async def send_otp(self, phone: str) -> bool:
        """Send OTP code to phone"""
        # Generate OTP
        otp = str(random.randint(100000, 999999))
        
        # Store OTP with expiration
        _otp_storage[phone] = {
            "code": otp,
            "expires_at": time.time() + self.OTP_TTL,
            "attempts": 0
        }
        
        # TODO: Integrate with actual SMS provider (Twilio, etc.)
        # For now, log to console (development only)
        logger.info(f"[SMS] OTP for {phone}: {otp}")
        
        return True
    
    async def verify_otp(self, phone: str, code: str) -> bool:
        """Verify OTP code"""
        stored = _otp_storage.get(phone)
        
        if not stored:
            return False
        
        # Check expiration
        if time.time() > stored["expires_at"]:
            del _otp_storage[phone]
            return False
        
        # Check attempts (rate limiting)
        if stored["attempts"] >= 5:
            del _otp_storage[phone]
            return False
        
        stored["attempts"] += 1
        
        # Verify code
        if stored["code"] == code:
            del _otp_storage[phone]
            return True
        
        return False



