"""
Script to create platform_master user
Run: python -m scripts.create_platform_master
"""
import asyncio
import bcrypt
import uuid
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import get_db


async def create_platform_master():
    """Create platform_master user with login and password"""
    login = "89535574133"
    password = "Tehnologick987"
    
    # Hash password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    async with get_db() as db:
        # Check if user already exists
        check_query = "SELECT id FROM users WHERE phone = $1"
        existing = await db.fetchrow(check_query, login)
        
        if existing:
            # Update existing user
            update_query = """
                UPDATE users
                SET password_hash = $1, role = $2
                WHERE phone = $3
                RETURNING id
            """
            result = await db.fetchrow(update_query, password_hash, "platform_master", login)
            print(f"[OK] Updated platform_master user: {result['id']}")
        else:
            # Create new user
            user_id = uuid.uuid4()
            insert_query = """
                INSERT INTO users (id, phone, password_hash, role, phone_verified, tenant_id)
                VALUES ($1, $2, $3, $4, TRUE, NULL)
                RETURNING id
            """
            result = await db.fetchrow(insert_query, user_id, login, password_hash, "platform_master")
            print(f"[OK] Created platform_master user: {result['id']}")
        
        print(f"   Login: {login}")
        print(f"   Password: {password}")
        print(f"   Role: platform_master")


if __name__ == "__main__":
    asyncio.run(create_platform_master())


