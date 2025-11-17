"""
Auth Service - User and tenant management
Uses SQLAlchemy ORM for all database operations
"""
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.models.tenant import Tenant
from app.db.session import AsyncSessionLocal
import uuid
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Authentication and user management service"""
    
    async def get_or_create_user(self, phone: str) -> User:
        """Get existing user or create new one"""
        async with AsyncSessionLocal() as db:
            # Try to find existing user
            stmt = select(User).where(User.phone == phone)
            result = await db.execute(stmt)
            user = result.scalar_one_or_none()
            
            if user:
                return user
            
            # Create new user
            new_user = User(
                phone=phone,
                phone_verified=False
            )
            db.add(new_user)
            try:
                await db.flush()
                await db.refresh(new_user)
                logger.info(f"Created new user: {new_user.id}")
                return new_user
            except IntegrityError as e:
                await db.rollback()
                # Race condition: user was created between check and insert
                # Try to fetch again
                result = await db.execute(stmt)
                user = result.scalar_one_or_none()
                if user:
                    return user
                raise ValueError(f"Failed to create user: {e}") from e
    
    async def get_or_create_tenant(self, user_id: uuid.UUID) -> Tenant:
        """Get existing tenant for user or create new one"""
        async with AsyncSessionLocal() as db:
            # Get user with tenant relationship
            user_stmt = select(User).where(User.id == user_id)
            user_result = await db.execute(user_stmt)
            user = user_result.scalar_one_or_none()
            
            if not user:
                raise ValueError(f"User not found: {user_id}")
            
            # Check if user already has a tenant
            if user.tenant_id:
                tenant_stmt = select(Tenant).where(Tenant.id == user.tenant_id)
                tenant_result = await db.execute(tenant_stmt)
                tenant = tenant_result.scalar_one_or_none()
                if tenant:
                    return tenant
            
            # Create new tenant
            new_tenant = Tenant(
                name=f"Tenant {user_id}",
                owner_phone=user.phone,
                plan=None,
                status="inactive",
                active_module=None
            )
            db.add(new_tenant)
            await db.flush()
            await db.refresh(new_tenant)
            
            # Link user to tenant
            user.tenant_id = new_tenant.id
            await db.flush()
            
            logger.info(f"Created new tenant {new_tenant.id} for user {user_id}")
            return new_tenant
    
    async def create_user(self, phone: str) -> User:
        """Create new user (for registration)"""
        async with AsyncSessionLocal() as db:
            new_user = User(
                phone=phone,
                phone_verified=False
            )
            db.add(new_user)
            try:
                await db.flush()
                await db.refresh(new_user)
                logger.info(f"Created user: {new_user.id}")
                return new_user
            except IntegrityError as e:
                await db.rollback()
                raise ValueError(f"Failed to create user: {e}") from e
    
    async def mark_phone_verified(self, user_id: uuid.UUID) -> None:
        """Mark user phone as verified"""
        async with AsyncSessionLocal() as db:
            user_stmt = select(User).where(User.id == user_id)
            result = await db.execute(user_stmt)
            user = result.scalar_one_or_none()
            
            if not user:
                raise ValueError(f"User not found: {user_id}")
            
            user.phone_verified = True
            await db.flush()
            logger.info(f"Marked phone as verified for user: {user_id}")

