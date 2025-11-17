"""
Module migrations environment
Shop module uses its own database per tenant (via SDK)
"""
import sys
from pathlib import Path
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Add parent directories to path for imports
# Now using app/ structure
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

# Try to import SDK for database URL
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

# Import module models for autogenerate
# Note: Import from app.* since we're now using app/ structure
from app.models.product import Product
from app.db.base import Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_database_url():
    """
    Get database URL for module
    This should be called with tenant_id and module_id
    For migrations, we need to specify these via environment variables
    """
    import os
    import asyncio
    
    tenant_id = os.getenv("MIGRATION_TENANT_ID")
    module_id = os.getenv("MIGRATION_MODULE_ID", "shop")
    
    if not tenant_id:
        raise ValueError(
            "MIGRATION_TENANT_ID environment variable must be set. "
            "Example: export MIGRATION_TENANT_ID=tenant-uuid-here"
        )
    
    # Get database URL from SDK
    # Note: Alembic env.py runs synchronously, so we need to run async function
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    db_config = loop.run_until_complete(get_tenant_database_url(tenant_id, module_id))
    return db_config["dsn"]


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    # Get database URL
    url = get_database_url()
    
    # Convert to async URL if needed (for SQLAlchemy 2.0 async)
    # For Alembic, we use synchronous engine
    # Remove asyncpg driver prefix if present
    url = url.replace("postgresql+asyncpg://", "postgresql://")
    
    config.set_main_option("sqlalchemy.url", url)
    
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # Get database URL
    url = get_database_url()
    
    # Convert to async URL if needed (for SQLAlchemy 2.0 async)
    # For Alembic, we use synchronous engine
    # Remove asyncpg driver prefix if present
    url = url.replace("postgresql+asyncpg://", "postgresql://")
    
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = url
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

