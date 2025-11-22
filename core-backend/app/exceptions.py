"""
Кастомные исключения для приложения
"""
from fastapi import HTTPException, status

class TochkaRostaException(HTTPException):
    """Базовое исключение платформы"""
    pass

class TenantNotFoundError(TochkaRostaException):
    """Tenant не найден"""
    def __init__(self, tenant_id: str = None):
        detail = f"Tenant not found"
        if tenant_id:
            detail = f"Tenant with ID {tenant_id} not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )

class UserNotFoundError(TochkaRostaException):
    """Пользователь не найден"""
    def __init__(self, user_id: str = None):
        detail = "User not found"
        if user_id:
            detail = f"User with ID {user_id} not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )

class InvalidTokenError(TochkaRostaException):
    """Невалидный токен"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

class SubscriptionNotFoundError(TochkaRostaException):
    """Подписка не найдена"""
    def __init__(self, tenant_id: str = None):
        detail = "Subscription not found"
        if tenant_id:
            detail = f"Subscription for tenant {tenant_id} not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )

class TariffNotFoundError(TochkaRostaException):
    """Тариф не найден"""
    def __init__(self, tariff_id: str = None):
        detail = "Tariff not found"
        if tariff_id:
            detail = f"Tariff with ID {tariff_id} not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )

class InsufficientPermissionsError(TochkaRostaException):
    """Недостаточно прав"""
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message
        )







