"""
Settings Schema - Pydantic Settings for application configuration
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Database
    DATABASE_URL: str
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database Pool
    DB_POOL_MIN_SIZE: int = 5
    DB_POOL_MAX_SIZE: int = 10
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:7000,http://localhost:7001,http://localhost:3000"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # SMS Service (if applicable)
    SMS_SERVICE_API_KEY: Optional[str] = None
    SMS_SERVICE_URL: Optional[str] = None
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Get CORS origins as list, handling wildcard and production safety"""
        if self.CORS_ORIGINS == "*":
            # In production, warn about wildcard CORS
            if self.ENVIRONMENT == "production":
                import warnings
                from warnings import SecurityWarning
                warnings.warn(
                    "CORS_ORIGINS=* is insecure for production! "
                    "Set specific origins in CORS_ORIGINS.",
                    SecurityWarning
                )
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()





