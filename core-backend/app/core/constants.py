"""
Константы приложения
"""
from enum import Enum

class UserRole(str, Enum):
    """Роли пользователей"""
    SUBSCRIBER = "subscriber"
    OWNER = "owner"
    MASTER = "master"
    SUPERUSER = "superuser"

class TenantStatus(str, Enum):
    """Статусы tenant"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    TRIAL = "trial"

class SubscriptionStatus(str, Enum):
    """Статусы подписки"""
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    TRIAL = "trial"

# Тарифы по умолчанию
DEFAULT_TARIFFS = {
    "Base": {
        "price_monthly": 990.0,
        "subdomain_limit": 1,
        "features": ["shop"]
    },
    "Growth": {
        "price_monthly": 2990.0,
        "subdomain_limit": 2,
        "features": ["shop", "events"]
    },
    "Master": {
        "price_monthly": 9990.0,
        "subdomain_limit": 10,
        "features": ["shop", "events", "portfolio", "courses"]
    }
}

# OTP настройки
OTP_LENGTH = 6
OTP_EXPIRE_SECONDS = 300  # 5 минут

# JWT настройки
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 дней
REFRESH_TOKEN_EXPIRE_DAYS = 30



