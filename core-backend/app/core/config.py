from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Tochka Rosta Core"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "local"
    DEV_MODE: bool = True

    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "core_db"
    DATABASE_URL: str = ""

    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    
    # OTP Settings
    OTP_EXPIRE_SECONDS: int = 300

    SECRET_KEY: str = "secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    BACKEND_CORS_ORIGINS: Union[List[str], str] = []

    # Providers Flags
    TELEGRAM_ACTIVE: bool = False
    MAX_ACTIVE: bool = False

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.DATABASE_URL:
            self.DATABASE_URL = f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()