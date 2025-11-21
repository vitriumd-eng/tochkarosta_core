"""
Скрипт для инициализации начальных тарифов в БД
Запускать после применения миграций: python -m app.modules.billing.init_data
"""
import asyncio
import sys
from pathlib import Path

# Добавляем путь к app для правильных импортов
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
import json

# Импортируем все модели в правильном порядке для инициализации relationships
from app.models.user import User
from app.models.tenant import Tenant
from app.modules.billing.models import Tariff, Subscription

TARIFFS = [
    {
        "name": "Base",
        "price_monthly": 990.0,
        "subdomain_limit": 1,
        "is_active": True,
        "features_json": json.dumps({
            "modules": ["shop"],
            "storage_gb": 5,
            "support": "email"
        })
    },
    {
        "name": "Growth",
        "price_monthly": 2990.0,
        "subdomain_limit": 2,
        "is_active": True,
        "features_json": json.dumps({
            "modules": ["shop", "events"],
            "storage_gb": 20,
            "support": "priority_email"
        })
    },
    {
        "name": "Master",
        "price_monthly": 9990.0,
        "subdomain_limit": 10,
        "is_active": True,
        "features_json": json.dumps({
            "modules": ["shop", "events", "portfolio", "courses"],
            "storage_gb": 100,
            "support": "priority_phone"
        })
    }
]

async def init_tariffs():
    """Инициализация тарифов в БД"""
    async with AsyncSessionLocal() as session:
        try:
            for tariff_data in TARIFFS:
                # Check if tariff already exists
                result = await session.execute(
                    select(Tariff).where(Tariff.name == tariff_data["name"])
                )
                existing = result.scalar_one_or_none()
                
                if not existing:
                    tariff = Tariff(**tariff_data)
                    session.add(tariff)
                    print(f"[OK] Created tariff: {tariff_data['name']}")
                else:
                    print(f"[SKIP] Tariff already exists: {tariff_data['name']}")
            
            await session.commit()
            print("\n[OK] Tariffs initialization completed!")
        except Exception as e:
            await session.rollback()
            print(f"[ERROR] Failed to initialize tariffs: {e}")
            import traceback
            traceback.print_exc()
            raise

if __name__ == "__main__":
    asyncio.run(init_tariffs())
