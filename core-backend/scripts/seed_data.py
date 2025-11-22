"""
Скрипт для создания тестовых данных
Использование: python scripts/seed_data.py
"""
import asyncio
import sys
from pathlib import Path

# Добавляем путь к app
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.models.tenant import Tenant
from app.modules.billing.models import Tariff, Subscription
from app.utils.hashing import get_password_hash
from app.utils.helpers import generate_tenant_domain
import uuid

async def create_test_data():
    """Создание тестовых данных"""
    async with AsyncSessionLocal() as session:
        try:
            # Создание тестового суперпользователя
            superuser = User(
                phone="+79990000001",
                phone_verified=True,
                first_name="Admin",
                last_name="System",
                password_hash=get_password_hash("admin123"),
                role="superuser",
                is_superuser=True
            )
            session.add(superuser)
            await session.flush()
            print("✅ Created superuser: +79990000001 / admin123")
            
            # Создание тестового tenant с владельцем
            test_tenant = Tenant(
                name="Test Company",
                domain=generate_tenant_domain(),
                owner_phone="+79991234567",
                status="active",
                is_active=True
            )
            session.add(test_tenant)
            await session.flush()
            print(f"✅ Created tenant: {test_tenant.domain}")
            
            # Создание владельца tenant
            owner = User(
                phone="+79991234567",
                phone_verified=True,
                first_name="Test",
                last_name="Owner",
                password_hash=get_password_hash("test123"),
                role="owner",
                tenant_id=test_tenant.id
            )
            session.add(owner)
            await session.flush()
            print("✅ Created owner: +79991234567 / test123")
            
            # Получение тарифа Base
            from sqlalchemy import select
            result = await session.execute(
                select(Tariff).where(Tariff.name == "Base")
            )
            base_tariff = result.scalar_one_or_none()
            
            if base_tariff:
                # Создание подписки
                subscription = Subscription(
                    tenant_id=test_tenant.id,
                    tariff_id=base_tariff.id,
                    is_active=True
                )
                session.add(subscription)
                print("✅ Created subscription for test tenant")
            
            await session.commit()
            print("\n✅ Test data created successfully!")
            print("\nTest accounts:")
            print("  Superuser: +79990000001 / admin123")
            print("  Owner: +79991234567 / test123")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(create_test_data())







