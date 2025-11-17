"""
Seed script to create platform_master user
Run: python -m app.seed.create_platform_master
"""
import asyncio
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.db.session import AsyncSessionLocal
from app.services.user_service import create_platform_master


async def run():
    """Create platform_master user"""
    login = "89535574133"
    password = "Tehnologick987"
    
    print(f"[INFO] Creating platform_master user...")
    print(f"  Login: {login}")
    print(f"  Role: platform_master")
    
    async with AsyncSessionLocal() as db:
        try:
            user = await create_platform_master(phone=login, password=password, db=db)
            print(f"[OK] Platform master user created/updated successfully")
            print(f"  User ID: {user.id}")
            print(f"  Phone: {user.phone}")
            print(f"  Role: {user.role.value if user.role else 'None'}")
        except ValueError as e:
            print(f"[ERROR] Failed to create platform master: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"[ERROR] Unexpected error: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)


if __name__ == "__main__":
    asyncio.run(run())

