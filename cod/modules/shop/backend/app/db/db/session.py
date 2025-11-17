"""
Module Database Session Management
Shop module uses its own database per tenant (via SDK)
"""
import os
import sys
from pathlib import Path
from typing import AsyncGenerator, Optional
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import logging

logger = logging.getLogger(__name__)

# Try to import SDK
try:
    from app.modules.sdk import get_tenant_database_url
except ImportError:
    # Fallback for module development
    core_backend_path = Path(__file__).parent.parent.parent.parent / "core-backend"
    if core_backend_path.exists():
        sys.path.insert(0, str(core_backend_path))
        from app.modules.sdk import get_tenant_database_url
    else:
        raise ImportError("Cannot import SDK. Make sure core-backend is in the path.")

Base = declarative_base()

# Store engines per tenant+module
_engines: dict[str, any] = {}
_session_makers: dict[str, async_sessionmaker] = {}


def _convert_postgres_url_to_async(url: str) -> str:
    """Convert postgresql:// to postgresql+asyncpg:// for SQLAlchemy async"""
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


async def get_module_db(tenant_id: str, module_id: str = "shop") -> AsyncGenerator[AsyncSession, None]:
    """
    Get database session for module
    Uses SDK to get tenant-specific database URL
    
    Args:
        tenant_id: Tenant identifier
        module_id: Module identifier (default: "shop")
    
    Yields:
        AsyncSession: SQLAlchemy async session for module database
    """
    cache_key = f"{tenant_id}_{module_id}"
    
    # Get database URL from SDK
    try:
        db_config = await get_tenant_database_url(tenant_id, module_id)
        module_db_url = db_config["dsn"]
    except Exception as e:
        logger.error(f"Failed to get database URL for tenant {tenant_id}, module {module_id}: {e}", exc_info=True)
        raise ValueError(f"Failed to get module database URL: {str(e)}")
    
    # Convert to async URL format
    async_db_url = _convert_postgres_url_to_async(module_db_url)
    
    # Create or get engine for this tenant+module
    if cache_key not in _engines:
        logger.info(f"Creating engine for tenant {tenant_id}, module {module_id}")
        _engines[cache_key] = create_async_engine(
            async_db_url,
            echo=False,  # Set to True for SQL query logging
            pool_pre_ping=True,  # Verify connections before using
            pool_size=5,
            max_overflow=10
        )
        _session_makers[cache_key] = async_sessionmaker(
            _engines[cache_key],
            class_=AsyncSession,
            expire_on_commit=False
        )
    
    # Get session maker for this tenant+module
    SessionLocal = _session_makers[cache_key]
    
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def close_module_db_engines():
    """Close all module database engines"""
    global _engines
    for cache_key, engine in _engines.items():
        try:
            await engine.dispose()
            logger.info(f"Closed engine for {cache_key}")
        except Exception as e:
            logger.error(f"Error closing engine for {cache_key}: {e}", exc_info=True)
    _engines.clear()
    _session_makers.clear()

