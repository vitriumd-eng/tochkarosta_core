"""
Database Session Management
Uses SQLAlchemy ORM exclusively
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Convert postgresql:// to postgresql+asyncpg:// for async
async_database_url = settings.DATABASE_URL
if async_database_url.startswith("postgresql://"):
    async_database_url = async_database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Create async engine with connection pooling
# Note: For async engines, the pool class is automatically AsyncAdaptedQueuePool
engine = create_async_engine(
    async_database_url,
    echo=False,  # Set to True for SQL query logging
    pool_pre_ping=True,  # Verify connections before using
    pool_size=settings.DB_POOL_MIN_SIZE,
    max_overflow=settings.DB_POOL_MAX_SIZE - settings.DB_POOL_MIN_SIZE,
    pool_recycle=3600,  # Recycle connections after 1 hour
)

# Create session maker
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_session():
    """
    Get database session (FastAPI dependency)
    
    Usage:
        @router.get("/")
        async def endpoint(session: AsyncSession = Depends(get_session)):
            # Use session here
            pass
    """
    async with AsyncSessionLocal() as session:
        yield session
