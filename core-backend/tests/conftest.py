"""
Pytest configuration and fixtures
"""
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy import TypeDecorator, String
from typing import AsyncGenerator
from app.main import app
from app.db.base import Base
from app.db.session import get_session
from app.core.config import settings
import os
import uuid


# Override database URL for tests
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite+aiosqlite:///:memory:")


# UUID TypeDecorator for SQLite compatibility
class GUID(TypeDecorator):
    """Platform-independent GUID type for SQLite compatibility"""
    impl = String(36)
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            from sqlalchemy.dialects.postgresql import UUID
            return dialect.type_descriptor(UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(String(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return value  # PostgreSQL UUID handles it directly
        else:
            if isinstance(value, uuid.UUID):
                return str(value)
            elif isinstance(value, str):
                return str(uuid.UUID(value))  # Validate and convert
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return value
        # Try to convert string to UUID
        try:
            if isinstance(value, str) and value:
                return uuid.UUID(value)
        except (ValueError, TypeError):
            pass
        return value


# Use pytest-asyncio default event_loop fixture
# Removed custom event_loop to avoid deprecation warning


@pytest.fixture(scope="function")
async def test_engine():
    """Create test database engine"""
    # Patch UUID columns for SQLite compatibility
    if TEST_DATABASE_URL.startswith("sqlite"):
        # Import models to ensure they're registered
        from app.models import user, tenant, subscription, tenant_domain, module_settings, platform_content, deleted_accounts_history
        
        # Replace PostgreSQL-specific types for SQLite compatibility
        from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB
        from sqlalchemy import JSON
        
        for table in Base.metadata.tables.values():
            for column in table.columns:
                # Replace UUID with GUID for SQLite
                if isinstance(column.type, PGUUID):
                    column.type = GUID()
                # Replace JSONB with JSON for SQLite
                elif isinstance(column.type, JSONB):
                    column.type = JSON()
    
    if TEST_DATABASE_URL.startswith("sqlite"):
        # SQLite for testing
        engine = create_async_engine(
            TEST_DATABASE_URL,
            connect_args={"check_same_thread": False} if "sqlite" in TEST_DATABASE_URL else {},
            poolclass=StaticPool,
            echo=False,
        )
    else:
        # PostgreSQL for testing (if needed)
        engine = create_async_engine(
            TEST_DATABASE_URL,
            echo=False,
            pool_pre_ping=True,
        )
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    # Drop all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()


@pytest.fixture(scope="function")
async def test_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create test database session"""
    async_session_maker = async_sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    
    async with async_session_maker() as session:
        yield session
        await session.rollback()


@pytest.fixture(scope="function")
async def client(test_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create test HTTP client"""
    # Note: Most routes use AsyncSessionLocal directly, not get_session dependency
    # If routes use get_session, override it:
    try:
        from app.db.session import get_session
        async def override_get_session():
            yield test_session
        app.dependency_overrides[get_session] = override_get_session
    except ImportError:
        # get_session might not be used, that's OK
        pass
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    # Clean up
    app.dependency_overrides.clear()

