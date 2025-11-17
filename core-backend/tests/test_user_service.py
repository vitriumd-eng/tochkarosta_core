"""
Tests for user service
"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.roles import UserRole
from app.services.user_service import (
    create_platform_master,
    get_user_by_phone,
    verify_user_password
)
from app.core.security import hash_password


@pytest.mark.asyncio
async def test_create_platform_master(test_session: AsyncSession):
    """Test creating platform_master user"""
    phone = "89535574133"
    password = "Tehnologick987"
    
    user = await create_platform_master(phone, password, test_session)
    
    assert user is not None
    assert user.phone == phone
    assert user.role == UserRole.platform_master
    assert user.phone_verified is True
    assert user.tenant_id is None
    assert user.password_hash is not None


@pytest.mark.asyncio
async def test_create_platform_master_duplicate(test_session: AsyncSession):
    """Test creating platform_master when user already exists"""
    phone = "89535574133"
    password = "Tehnologick987"
    
    # Create first time
    user1 = await create_platform_master(phone, password, test_session)
    await test_session.commit()
    
    # Create second time (should update)
    user2 = await create_platform_master(phone, password, test_session)
    await test_session.commit()
    
    assert user1.id == user2.id
    assert user2.role == UserRole.platform_master


@pytest.mark.asyncio
async def test_get_user_by_phone(test_session: AsyncSession):
    """Test getting user by phone"""
    phone = "79990001123"
    password_hash = hash_password("testpass123")
    
    # Create user
    user = User(
        phone=phone,
        password_hash=password_hash,
        role=UserRole.user,
        phone_verified=True
    )
    test_session.add(user)
    await test_session.commit()
    
    # Get user
    found_user = await get_user_by_phone(phone, test_session)
    
    assert found_user is not None
    assert found_user.phone == phone
    assert found_user.id == user.id


@pytest.mark.asyncio
async def test_get_user_by_phone_not_found(test_session: AsyncSession):
    """Test getting non-existent user"""
    found_user = await get_user_by_phone("79990009999", test_session)
    
    assert found_user is None


@pytest.mark.asyncio
async def test_verify_user_password(test_session: AsyncSession):
    """Test password verification"""
    password = "testpass123"
    password_hash = hash_password(password)
    
    user = User(
        phone="79990001123",
        password_hash=password_hash,
        role=UserRole.user,
        phone_verified=True
    )
    test_session.add(user)
    await test_session.commit()
    
    # Verify correct password
    assert await verify_user_password(user, password) is True
    
    # Verify wrong password
    assert await verify_user_password(user, "wrongpassword") is False


@pytest.mark.asyncio
async def test_verify_user_password_no_hash(test_session: AsyncSession):
    """Test password verification for user without password hash"""
    user = User(
        phone="79990001123",
        password_hash=None,
        role=UserRole.user,
        phone_verified=True
    )
    test_session.add(user)
    await test_session.commit()
    
    # Should return False if no password hash
    assert await verify_user_password(user, "anypassword") is False


