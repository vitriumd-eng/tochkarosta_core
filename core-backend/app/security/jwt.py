"""
JWT Authentication - HS256 tokens
"""
from datetime import datetime, timedelta
from typing import Dict, Optional
import jwt
from jwt.exceptions import InvalidTokenError
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

# Загружаем переменные окружения
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)

# In production, load secret from Vault/K8s secrets
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "modular-saas-core-secret-key-change-in-production")

# Валидация секретного ключа
def validate_secret_key(secret_key: str, is_production: bool = False) -> bool:
    """Валидация JWT секретного ключа"""
    if not secret_key or len(secret_key) < 32:
        if is_production:
            raise ValueError("JWT_SECRET_KEY must be at least 32 characters in production")
        return False
    return True

# Проверяем окружение
is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"
validate_secret_key(SECRET_KEY, is_production)

ALGORITHM = "HS256"
ACCESS_TOKEN_TTL = timedelta(minutes=int(os.getenv("JWT_ACCESS_TOKEN_TTL_MINUTES", "15")))
REFRESH_TOKEN_TTL = timedelta(days=int(os.getenv("JWT_REFRESH_TOKEN_TTL_DAYS", "30")))


def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create HS256 access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or ACCESS_TOKEN_TTL)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: Dict) -> str:
    """Create refresh token with rotation support"""
    to_encode = data.copy()
    expire = datetime.utcnow() + REFRESH_TOKEN_TTL
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> Dict:
    """Verify and decode token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except InvalidTokenError:
        raise ValueError("Invalid token")



