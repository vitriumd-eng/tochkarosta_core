"""
Конфигурация логирования для приложения
"""
import logging
import sys
from app.core.config import settings

def setup_logging():
    """
    Настройка логирования в зависимости от окружения
    """
    log_level = logging.DEBUG if settings.DEV_MODE else logging.INFO
    
    # Формат логов
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"
    
    # Базовая конфигурация
    logging.basicConfig(
        level=log_level,
        format=log_format,
        datefmt=date_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Настройка уровней для внешних библиотек
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.DEV_MODE else logging.WARNING
    )
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    
    # Логгер для приложения
    logger = logging.getLogger("core")
    logger.info(f"Logging configured for {settings.ENVIRONMENT} environment")
    
    return logger



