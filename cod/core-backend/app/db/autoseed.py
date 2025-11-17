"""
Auto-seed script - run migrations and seed database
"""
import asyncio
from app.db.session import AsyncSessionLocal
from app.db.seed import seed_platform_master


async def run():
    """Run database seeding"""
    async with AsyncSessionLocal() as session:
        await seed_platform_master(session)


if __name__ == "__main__":
    asyncio.run(run())

