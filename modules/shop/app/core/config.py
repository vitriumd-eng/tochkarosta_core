"""
Shop Module - Configuration
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Module Info
    MODULE_NAME: str = "shop"
    MODULE_VERSION: str = "1.0.0"
    
    # Core API
    CORE_API_URL: str = "http://localhost:8000"
    CORE_API_KEY: str = ""
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/shop_db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:7000"]
    
    # Security
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Payments
    PAYMENTS_MODE: str = "mock"  # mock | yookassa | p2p
    
    # AI
    AI_MODE: str = "mock"  # mock | openai | anthropic
    AI_API_KEY: str = ""
    
    # SEO
    SEO_ENABLED: bool = True
    
    # Licensing
    LICENSE_SYNC_INTERVAL: int = 300  # seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()



