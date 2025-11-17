"""
User Service - Business logic for user operations
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import Optional
import logging
from app.models.user import User
from app.models.roles import UserRole
from app.core.security import hash_password, verify_password

logger = logging.getLogger(__name__)


async def create_platform_master(phone: str, password: str, db: AsyncSession) -> User:
    """
    Create or update platform_master user
    
    Args:
        phone: User phone number
        password: Plain text password
        db: SQLAlchemy async session
        
    Returns:
        Created or updated User instance
        
    Raises:
        ValueError: If phone already exists with different role
    """
    # Check if user already exists
    stmt = select(User).where(User.phone == phone)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        # Update existing user
        existing_user.password_hash = hash_password(password)
        existing_user.role = UserRole.platform_master
        existing_user.phone_verified = True
        existing_user.tenant_id = None  # platform_master has no tenant
        
        await db.flush()
        await db.refresh(existing_user)
        
        logger.info(f"Updated platform_master user: {existing_user.id}")
        return existing_user
    else:
        # Create new user
        hashed_password = hash_password(password)
        
        new_user = User(
            phone=phone,
            password_hash=hashed_password,
            role=UserRole.platform_master,
            phone_verified=True,
            tenant_id=None  # platform_master has no tenant
        )
        
        db.add(new_user)
        try:
            await db.flush()
            await db.refresh(new_user)
            logger.info(f"Created platform_master user: {new_user.id}")
            return new_user
        except IntegrityError as e:
            await db.rollback()
            logger.error(f"Failed to create platform_master: {e}")
            raise ValueError(f"User with phone {phone} already exists") from e


async def get_user_by_phone(phone: str, db: AsyncSession) -> Optional[User]:
    """
    Get user by phone number
    
    Args:
        phone: User phone number
        db: SQLAlchemy async session
        
    Returns:
        User instance or None if not found
    """
    stmt = select(User).where(User.phone == phone)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def verify_user_password(user: User, password: str) -> bool:
    """
    Verify user password
    
    Args:
        user: User instance
        password: Plain text password to verify
        
    Returns:
        True if password matches, False otherwise
    """
    if not user.password_hash:
        return False
    
    return verify_password(password, user.password_hash)

