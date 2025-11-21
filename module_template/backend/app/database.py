"""
Настройка базы данных для модуля

ВАЖНО: Каждый модуль имеет свою собственную БД
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os

# Получите DATABASE_URL из переменных окружения
# Формат: postgresql+asyncpg://user:password@host:port/dbname
DATABASE_URL = os.getenv(
    "MODULE_DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/module_db"
)

# Создание движка БД
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # В продакшене установите False
    future=True,
    pool_pre_ping=True
)

# Базовый класс для моделей
class Base(DeclarativeBase):
    pass

# Сессия БД
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db() -> AsyncSession:
    """Dependency для получения сессии БД"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()



