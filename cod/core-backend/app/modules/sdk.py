"""
Backend SDK - Single contract for modules to interact with core
Modules MUST use only these functions - NO direct imports from core internals
Uses SQLAlchemy ORM for all database operations
"""
from typing import Dict, Optional
from sqlalchemy import select, desc, text
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.tenant import Tenant
from app.models.subscription import Subscription
import asyncio
import uuid
import logging

logger = logging.getLogger(__name__)


async def get_subscription_status(tenant_id: str) -> Dict:
    """
    Get subscription status for tenant
    Returns: { active, plan, limits, features, expires }
    """
    async with AsyncSessionLocal() as db:
        # Query subscription using ORM
        tenant_uuid = uuid.UUID(tenant_id)
        stmt = select(Subscription).where(
            Subscription.tenant_id == tenant_uuid
        ).order_by(desc(Subscription.started_at)).limit(1)
        
        result = await db.execute(stmt)
        subscription = result.scalar_one_or_none()
        
        if not subscription:
            return {"active": False}
        
        # Get limits and features based on plan
        plan = subscription.plan
        limits, features = _get_plan_config(plan)
        
        return {
            "active": subscription.status == "active",
            "plan": plan,
            "limits": limits,
            "features": features,
            "expires": str(subscription.expires_at) if subscription.expires_at else None
        }


async def get_tenant_info(tenant_id: str) -> Dict:
    """
    Get tenant metadata
    Returns: tenant information dict
    """
    async with AsyncSessionLocal() as db:
        tenant_uuid = uuid.UUID(tenant_id)
        stmt = select(Tenant).where(Tenant.id == tenant_uuid)
        result = await db.execute(stmt)
        tenant = result.scalar_one_or_none()
        
        if not tenant:
            return {}
        
        return {
            "id": str(tenant.id),
            "name": tenant.name,
            "owner_phone": tenant.owner_phone,
            "status": tenant.status,
            "active_module": tenant.active_module
        }


async def get_tenant_database_url(tenant_id: str, module_id: str) -> Dict:
    """
    Get or create database for tenant+module
    Returns: { dsn, expires_at }
    
    Creates database with name: {tenant_id}_{module_id}
    Uses same connection parameters as core DB
    """
    import os
    import re
    import logging
    from datetime import datetime, timedelta
    from app.db.session import DATABASE_URL
    
    logger = logging.getLogger(__name__)
    
    # Extract connection parameters from core DATABASE_URL
    # Format: postgresql://user:password@host:port/database
    pattern = r'postgresql://([^:]+):([^@]+)@([^:/]+)(?::(\d+))?/([^/?]+)'
    match = re.match(pattern, DATABASE_URL)
    
    if not match:
        raise ValueError(f"Invalid core DATABASE_URL format: {DATABASE_URL.split('@')[0]}@***")
    
    db_user, db_password, db_host, db_port, _ = match.groups()
    db_port = db_port or '5432'
    
    # Generate module database name: {tenant_id}_{module_id}
    # Sanitize to avoid SQL injection and invalid characters
    tenant_id_clean = re.sub(r'[^a-zA-Z0-9_-]', '_', tenant_id)
    module_id_clean = re.sub(r'[^a-zA-Z0-9_-]', '_', module_id)
    module_db_name = f"{tenant_id_clean}_{module_id_clean}"
    
    # Check if database exists and create if needed
    # Connect to 'postgres' database to create new database using SQLAlchemy
    from sqlalchemy.ext.asyncio import create_async_engine
    from sqlalchemy.pool import NullPool
    
    postgres_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/postgres"
    async_postgres_url = postgres_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    try:
        # Create temporary engine for administrative operations
        admin_engine = create_async_engine(
            async_postgres_url,
            poolclass=NullPool,
            echo=False
        )
        
        # Check if database exists (in transaction)
        async with admin_engine.connect() as conn:
            check_stmt = text("SELECT 1 FROM pg_database WHERE datname = :db_name")
            result = await conn.execute(check_stmt, {"db_name": module_db_name})
            db_exists = result.scalar_one_or_none() is not None
            
            if not db_exists:
                # Create database (DDL operation - must be in autocommit mode)
                # Note: CREATE DATABASE cannot be executed in a transaction
                # Use autocommit connection for DDL
                async with admin_engine.connect() as ddl_conn:
                    # Set autocommit mode for CREATE DATABASE
                    await ddl_conn.execution_options(isolation_level="AUTOCOMMIT").execute(
                        text(f'CREATE DATABASE "{module_db_name}"')
                    )
                    
                logger.info(f"Creating database for tenant {tenant_id}, module {module_id}: {module_db_name}")
                logger.info(f"Database {module_db_name} created successfully")
            else:
                logger.debug(f"Database {module_db_name} already exists")
        
        await admin_engine.dispose()
        
    except Exception as e:
        logger.error(f"Error creating/checking database {module_db_name}: {e}", exc_info=True)
        raise ValueError(f"Failed to create database for module: {str(e)}")
    
    # Build module database URL
    module_db_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{module_db_name}"
    
    # Return DSN with expiration (1 hour from now)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    return {
        "dsn": module_db_url,
        "expires_at": expires_at.isoformat() + "Z"
    }


async def check_dependencies(module_id: str) -> Dict:
    """
    Check if module dependencies are available and active
    Returns: { ok, missing, inactive }
    """
    # Load module manifest
    from app.modules.registry import get_module_manifest
    manifest = get_module_manifest(module_id)
    
    if not manifest:
        return {"ok": False, "missing": [module_id], "inactive": []}
    
    dependencies = manifest.get("dependencies", [])
    missing = []
    inactive = []
    
    for dep_id in dependencies:
        dep_manifest = get_module_manifest(dep_id)
        if not dep_manifest:
            missing.append(dep_id)
            continue
        
        # Check if dependency is registered in registry
        from app.modules.registry import is_module_registered
        if not is_module_registered(dep_id):
            inactive.append(dep_id)
    
    return {
        "ok": len(missing) == 0 and len(inactive) == 0,
        "missing": missing,
        "inactive": inactive
    }


async def verify_module_token(token: str) -> bool:
    """
    Verify module authentication token
    Returns: bool
    """
    from app.security.jwt import verify_token
    try:
        payload = verify_token(token)
        return payload.get("type") == "module"
    except Exception:
        return False


async def notify_tenant(tenant_id: str, payload: Dict) -> None:
    """
    Send notification to tenant (email/sms/push)
    """
    # TODO: Implement notification service
    pass


def _get_plan_config(plan: str) -> tuple:
    """Get limits and features for plan"""
    configs = {
        "start": (
            {"products": 50, "staff": 1, "domains": 1},
            {"ai_assistant": False, "custom_themes": False}
        ),
        "growth": (
            {"products": 500, "staff": 5, "domains": 2},
            {"ai_assistant": True, "custom_themes": True}
        ),
        "premium": (
            {"products": -1, "staff": -1, "domains": 3},  # -1 = unlimited
            {"ai_assistant": True, "custom_themes": True}
        )
    }
    return configs.get(plan, ({}, {}))



