"""
Database Seeding Functions
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.models.roles import UserRole
from app.core.security import hash_password


async def seed_platform_master(session: AsyncSession):
    """
    Seed platform_master user
    
    Args:
        session: SQLAlchemy async session
        
    Returns:
        Created or existing User instance
    """
    phone = "89535574133"
    password = "Tehnologick987"

    existing = await session.scalar(select(User).where(User.phone == phone))
    if existing:
        print("platform_master already exists")
        return existing

    user = User(
        phone=phone,
        password_hash=hash_password(password),
        role=UserRole.platform_master,
        phone_verified=True,
        tenant_id=None  # Platform master is not tied to a specific tenant
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)
    print(f"platform_master created: {user.id}")
    return user

