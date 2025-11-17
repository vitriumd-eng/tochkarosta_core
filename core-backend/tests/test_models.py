"""
Tests for SQLAlchemy models
"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.tenant import Tenant
from app.models.roles import UserRole
from app.core.security import hash_password
import uuid


@pytest.mark.asyncio
async def test_user_create(test_session: AsyncSession):
    """Test user model creation"""
    user = User(
        phone="79990001123",
        password_hash=hash_password("testpass123"),
        role=UserRole.user,
        phone_verified=True
    )
    
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    
    assert user.id is not None
    assert isinstance(user.id, uuid.UUID)
    assert user.phone == "79990001123"
    assert user.role == UserRole.user
    assert user.phone_verified is True
    assert user.password_hash is not None


@pytest.mark.asyncio
async def test_user_with_tenant(test_session: AsyncSession):
    """Test user creation with tenant"""
    # Create tenant first
    tenant = Tenant(
        name="Test Tenant",
        owner_phone="79990001123",
        status="inactive"
    )
    test_session.add(tenant)
    await test_session.flush()
    
    # Create user with tenant
    user = User(
        phone="79990002234",
        password_hash=hash_password("testpass123"),
        role=UserRole.user,
        phone_verified=True,
        tenant_id=tenant.id
    )
    
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    
    assert user.id is not None
    assert user.tenant_id == tenant.id
    assert user.tenant is not None
    assert user.tenant.name == "Test Tenant"


@pytest.mark.asyncio
async def test_user_platform_master(test_session: AsyncSession):
    """Test platform_master user creation"""
    user = User(
        phone="89535574133",
        password_hash=hash_password("Tehnologick987"),
        role=UserRole.platform_master,
        phone_verified=True,
        tenant_id=None  # platform_master has no tenant
    )
    
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    
    assert user.id is not None
    assert user.role == UserRole.platform_master
    assert user.tenant_id is None


@pytest.mark.asyncio
async def test_tenant_create(test_session: AsyncSession):
    """Test tenant model creation"""
    tenant = Tenant(
        name="Test Company",
        owner_phone="79990001123",
        status="inactive"
    )
    
    test_session.add(tenant)
    await test_session.commit()
    await test_session.refresh(tenant)
    
    assert tenant.id is not None
    assert isinstance(tenant.id, uuid.UUID)
    assert tenant.name == "Test Company"
    assert tenant.owner_phone == "79990001123"
    assert tenant.status == "inactive"
    assert tenant.plan is None
    assert tenant.active_module is None


@pytest.mark.asyncio
async def test_tenant_user_relationship(test_session: AsyncSession):
    """Test tenant-user relationship"""
    from sqlalchemy import select
    
    # Create tenant
    tenant = Tenant(
        name="Test Company",
        owner_phone="79990001123",
        status="active"
    )
    test_session.add(tenant)
    await test_session.flush()
    
    # Create users for tenant
    user1 = User(
        phone="79990001123",
        password_hash=hash_password("pass1"),
        role=UserRole.user,
        tenant_id=tenant.id
    )
    user2 = User(
        phone="79990002234",
        password_hash=hash_password("pass2"),
        role=UserRole.user,
        tenant_id=tenant.id
    )
    
    test_session.add_all([user1, user2])
    await test_session.commit()
    
    # Eagerly load relationship to avoid lazy loading issues
    result = await test_session.execute(
        select(Tenant).where(Tenant.id == tenant.id)
    )
    tenant = result.scalar_one()
    
    # Query users for tenant explicitly
    result = await test_session.execute(
        select(User).where(User.tenant_id == tenant.id)
    )
    users = result.scalars().all()
    
    # Check relationship
    assert len(users) == 2
    assert user1.id in [u.id for u in users]
    assert user2.id in [u.id for u in users]
    assert user1.tenant_id == tenant.id
    assert user2.tenant_id == tenant.id

