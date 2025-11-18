"""
Telegram Service - Send messages via Telegram Bot API
"""
import os
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class TelegramService:
    """Service for sending messages via Telegram Bot API"""
    
    def __init__(self):
        self.bot_token = os.getenv('TELEGRAM_BOT_TOKEN', '8224386162:AAF5qQSGonU4DaHe43-2yq6YSBb2X0bW5Zw')
        self.bot_id = os.getenv('TELEGRAM_BOT_ID', '8224386162')
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}"
    
    async def send_message(self, chat_id: int, text: str) -> bool:
        """
        Send message to Telegram user by chat_id
        
        Args:
            chat_id: Telegram chat ID
            text: Message text
            
        Returns:
            True if sent successfully, False otherwise
        """
        if not self.bot_token:
            logger.warning("TELEGRAM_BOT_TOKEN not set")
            return False
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{self.api_url}/sendMessage",
                    json={
                        "chat_id": chat_id,
                        "text": text,
                        "parse_mode": "HTML"
                    }
                )
                
                if response.status_code == 200:
                    logger.info(f"Telegram message sent to chat_id {chat_id}")
                    return True
                else:
                    error_data = response.json()
                    logger.error(f"Failed to send Telegram message: {error_data}")
                    return False
        except Exception as e:
            logger.error(f"Error sending Telegram message: {e}", exc_info=True)
            return False
    
    async def send_otp_code(self, phone: str, code: str, chat_id: Optional[int] = None) -> bool:
        """
        Send OTP code to user
        
        Args:
            phone: User phone number
            code: OTP code
            chat_id: Optional Telegram chat ID (if known)
            
        Returns:
            True if sent successfully, False otherwise
        """
        message = f"🔐 Ваш код подтверждения: <b>{code}</b>\n\nКод действителен 5 минут."
        
        # If chat_id is provided, send directly
        if chat_id:
            return await self.send_message(chat_id, message)
        
        # Otherwise, try to find user by phone
        # Note: Telegram Bot API doesn't allow searching by phone directly
        # In production, you'd need to store phone -> chat_id mapping
        # For now, log the code
        logger.info(f"[TELEGRAM] OTP code for {phone}: {code}")
        logger.info(f"[TELEGRAM] User should start conversation with bot to receive code")
        
        # TODO: Implement phone -> chat_id lookup from database
        # For now, code is logged and user needs to check bot manually
        
        return False
    
    async def find_chat_id_by_phone(self, phone: str) -> Optional[int]:
        """
        Try to find Telegram chat_id by phone number
        
        Note: Telegram Bot API doesn't provide direct phone -> chat_id lookup.
        This would require:
        1. User to start conversation with bot first
        2. Store phone -> chat_id mapping in database
        3. Or use Telegram WebApp initData
        
        Returns:
            chat_id if found, None otherwise
        """
        # TODO: Implement database lookup for phone -> chat_id
        # For now, return None
        return None

