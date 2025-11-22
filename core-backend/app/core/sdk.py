"""
SDK для модулей - интерфейс взаимодействия модулей с Ядром
"""
from typing import Optional, Dict, Any
from app.core.config import settings
import httpx
import logging

logger = logging.getLogger("core.sdk")

class CoreSDK:
    """
    SDK для модулей для взаимодействия с Ядром
    Модули используют этот класс для проверки прав доступа и получения информации о tenant
    """
    
    def __init__(self, core_api_url: str = None):
        self.core_api_url = core_api_url or f"http://localhost:8000"
        self.client = httpx.AsyncClient(timeout=10.0)
    
    async def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Проверить JWT токен и получить информацию о пользователе/tenant
        Возвращает payload токена или None если токен невалиден
        """
        try:
            from app.utils.jwt import decode_token
            payload = decode_token(token)
            return payload
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return None
    
    async def get_tenant_info(self, tenant_id: str, token: str) -> Optional[Dict[str, Any]]:
        """
        Получить информацию о tenant через API Ядра
        """
        try:
            response = await self.client.get(
                f"{self.core_api_url}/api/tenants/{tenant_id}",
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            logger.error(f"Failed to get tenant info: {e}")
            return None
    
    async def get_subscription_status(self, tenant_id: str, token: str) -> Optional[Dict[str, Any]]:
        """
        Получить статус подписки tenant
        """
        try:
            response = await self.client.get(
                f"{self.core_api_url}/api/billing/subscriptions/{tenant_id}",
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            logger.error(f"Failed to get subscription status: {e}")
            return None
    
    async def check_module_access(self, tenant_id: str, module_name: str, token: str) -> bool:
        """
        Проверить, имеет ли tenant доступ к модулю
        """
        subscription = await self.get_subscription_status(tenant_id, token)
        if not subscription:
            return False
        
        # TODO: Реализовать проверку доступа к модулю на основе тарифа
        # Пока возвращаем True если подписка активна
        return subscription.get("is_active", False)
    
    async def close(self):
        """Закрыть HTTP клиент"""
        await self.client.aclose()

# Глобальный экземпляр SDK
sdk = CoreSDK()







